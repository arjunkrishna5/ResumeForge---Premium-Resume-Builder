import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import mammoth from "mammoth";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback to .env

console.log("Loaded environment keys:", Object.keys(process.env).filter(k => k.includes("API") || k.includes("KEY")));
console.log("GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);
console.log("GEMINI_API_KEYS present:", !!process.env.GEMINI_API_KEYS);
console.log("OPENROUTER_API_KEY present:", !!process.env.OPENROUTER_API_KEY);

interface LLMProvider {
  name: string;
  isEnabled: boolean;
  execute: (prompt: string, jsonMode: boolean) => Promise<string>;
}

async function generateWithFallback(prompt: string, jsonMode: boolean = false): Promise<string> {
  const providers: LLMProvider[] = [
    // 1. Groq (Primary)
    {
      name: 'Groq',
      isEnabled: !!process.env.GROQ_API_KEY,
      execute: async (p, j) => {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: p }],
            temperature: 0.1,
            response_format: j ? { type: 'json_object' } : undefined
          })
        });
        if (!response.ok) throw new Error(`Groq returned ${response.status}: ${await response.text()}`);
        const data = (await response.json()) as any;
        return data.choices[0].message.content || '';
      }
    },
    
    // 2. Gemini Keys (Backup 1 - rotating list)
    ...(process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '')
      .split(',')
      .map(k => k.trim())
      .filter(Boolean)
      .map((key, index) => ({
        name: `Gemini (Key ${index + 1})`,
        isEnabled: true,
        execute: async (p, j) => {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: p }] }],
              generationConfig: j ? { responseMimeType: 'application/json' } : undefined
            })
          });
          if (!response.ok) throw new Error(`Gemini Key ${index + 1} returned ${response.status}: ${await response.text()}`);
          const data = (await response.json()) as any;
          return data.candidates[0].content.parts[0].text || '';
        }
      })),

    // 3. OpenRouter (Backup 2)
    {
      name: 'OpenRouter',
      isEnabled: !!process.env.OPENROUTER_API_KEY,
      execute: async (p, j) => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://resumeforge.com',
            'X-Title': 'ResumeForge'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash:free',
            messages: [{ role: 'user', content: p }],
            temperature: 0.1,
            response_format: j ? { type: 'json_object' } : undefined
          })
        });
        if (!response.ok) throw new Error(`OpenRouter returned ${response.status}: ${await response.text()}`);
        const data = (await response.json()) as any;
        return data.choices[0].message.content || '';
      }
    }
  ];

  const activeProviders = providers.filter(p => p.isEnabled);
  if (activeProviders.length === 0) {
    throw new Error('No AI providers configured. Please set GROQ_API_KEY, GEMINI_API_KEYS, or OPENROUTER_API_KEY.');
  }

  let lastError: any = null;
  for (const provider of activeProviders) {
    try {
      console.log(`[AI Engine] Attempting request using ${provider.name}...`);
      const result = await provider.execute(prompt, jsonMode);
      console.log(`[AI Engine] Request succeeded using ${provider.name}`);
      return result;
    } catch (err: any) {
      console.warn(`[AI Engine] ${provider.name} failed:`, err.message || err);
      lastError = err;
    }
  }

  throw new Error(`All configured AI providers failed. Last error: ${lastError?.message || lastError}`);
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function rateLimiter(limit: number, windowMs: number) {
  return (req: any, res: any, next: any) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitMap.set(ip, record);
      return next();
    }
    
    record.count++;
    if (record.count > limit) {
      return res.status(429).json({
        error: "Too many requests. Please wait before trying again."
      });
    }
    
    next();
  };
}

const apiRateLimiter = rateLimiter(15, 60000); // 15 requests per minute

async function startServer() {
  const app = express();
  const PORT = 3000;

  const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // Inject Security Headers
  app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    next();
  });

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/extractText", apiRateLimiter, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: "File size exceeds the 5MB limit." });
        }
        return res.status(500).json({ error: err.message || "Failed to upload file." });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const fileBuffer = req.file.buffer;
      const originalname = req.file.originalname.toLowerCase();
      
      let text = "";
      if (originalname.endsWith('.pdf') || req.file.mimetype === 'application/pdf') {
        if (typeof globalThis.DOMMatrix === 'undefined') {
          (globalThis as any).DOMMatrix = class DOMMatrix {};
        }
        const pdfParseModule = await import('pdf-parse');
        if (typeof pdfParseModule.PDFParse === 'function') {
          const parser = new pdfParseModule.PDFParse({ data: fileBuffer });
          const result = await parser.getText();
          text = result.text;
        } else {
          const pdfParse = (pdfParseModule as any).default || pdfParseModule;
          const result = await pdfParse(fileBuffer);
          text = result.text;
        }
      } else if (originalname.endsWith('.docx') || req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        text = result.value;
      } else {
        return res.status(400).json({ error: "Unsupported file format. Please upload a PDF or DOCX file." });
      }

      res.json({ text });
    } catch (e: any) {
      console.error("Text extraction failed:", e);
      res.status(500).json({ error: e.message || 'Failed to extract text from file' });
    }
  });

  app.post("/api/gemini", apiRateLimiter, async (req, res) => {
    try {
      const { action, ...params } = req.body;
      let result = '';

      if (action === 'improveJobDescription') {
        const responseText = await generateWithFallback(
          `Rewrite this job description as 3 strong resume bullet points using action verbs and quantifiable metrics. Return only the bullet points with a dash prefix, no extra text: ${params.description}`
        );
        result = responseText;

      } else if (action === 'suggestSkills') {
        const responseText = await generateWithFallback(
          `List 8 key technical and soft skills for a ${params.jobTitle} role. Return only a comma-separated list, nothing else.`
        );
        const skills = responseText
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        return res.json({ skills });

      } else if (action === 'generateSummary') {
        const expText = params.experience?.length > 0
          ? `${params.experience[0].title} at ${params.experience[0].company}`
          : 'various roles';
        const skillsText = params.technicalSkills?.slice(0, 5).join(', ') || '';
        const responseText = await generateWithFallback(
          `Write a 3-sentence professional summary for a resume. Name: ${params.name}, Role: ${params.role}, Experience: ${expText}, Skills: ${skillsText}. Make it impactful and ATS-friendly. Return only the summary paragraph.`
        );
        result = responseText;

      } else if (action === 'generateCoverLetter') {
        const responseText = await generateWithFallback(
          `Write a professional cover letter for ${params.name} applying for ${params.jobTitle} at ${params.company}. Tone: ${params.tone}. Summary context: ${params.summary}. Skills: ${params.skills?.join(', ')}. Keep it to 3 paragraphs under 300 words. Return only the letter body.`
        );
        result = responseText;

      } else if (action === 'parseResume') {
        const responseText = await generateWithFallback(
          `Extract resume information from this text and return ONLY a valid JSON object, no markdown:
{name, role, email, phone, location, linkedin, portfolio, summary, experience: [{title, company, startDate, endDate, current, description}], education: [{institution, degree, field, startYear, endYear, grade}], technicalSkills: [string], softSkills: [string], projects: [{name, description, techStack: [string], liveUrl, githubUrl}]}
Resume text: ${params.text}`,
          true
        );
        try {
          const cleaned = responseText
            .replace(/```json/g, '').replace(/```/g, '').trim();
          return res.json({ data: JSON.parse(cleaned) });
        } catch {
          return res.status(400).json({
            error: 'Could not parse resume data'
          });
        }

      } else if (action === 'calculateATSScore') {
        const resumeText = `
          Name: ${params.name}, Role: ${params.role}
          Summary: ${params.summary}
          Experience: ${params.experience?.map((e: any) =>
            `${e.title} at ${e.company}: ${e.description}`
          ).join('\n')}
          Skills: ${[
            ...(params.technicalSkills || []),
            ...(params.softSkills || [])
          ].join(', ')}
          Education: ${params.education?.map((e: any) =>
            `${e.degree} from ${e.institution}`
          ).join('\n')}
        `;
        const responseText = await generateWithFallback(
          `Analyze this resume for ATS compatibility and return ONLY a JSON object (no markdown):
{"score":<0-100>,"grade":<"A"|"B"|"C"|"D">,"issues":[<up to 4 strings>],"suggestions":[<up to 3 strings>]}
Resume: ${resumeText}`,
          true
        );
        try {
          const cleaned = responseText
            .replace(/```json/g, '').replace(/```/g, '').trim();
          return res.json({ atsData: JSON.parse(cleaned) });
        } catch {
          return res.json({
            atsData: { score: 70, grade: 'B', issues: [], suggestions: [] }
          });
        }

      } else {
        return res.status(400).json({ error: 'Unknown action' });
      }

      return res.json({ text: result });

    } catch (error: any) {
      console.error('Gemini error:', error);
      if (error.message?.includes('429') ||
          error.message?.includes('quota') || error.message?.includes('Quota')) {
        return res.status(429).json({
          error: 'AI rate limit exceeded. Please wait and try again.'
        });
      }
      return res.status(500).json({
        error: error.message || 'AI request failed'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static assets with correct MIME types
    app.use(express.static(distPath, {
      maxAge: '1y',
      etag: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || 
            filePath.endsWith('.mjs')) {
          res.setHeader('Content-Type', 
            'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Content-Type', 'text/html');
        }
      }
    }));
    
    // SPA catch-all — must be LAST
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
