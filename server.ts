import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import mammoth from "mammoth";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const upload = multer();

  let ai: GoogleGenAI | null = null;
  const initAi = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
  };

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/extractText", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const fileBuffer = req.file.buffer;
      const originalname = req.file.originalname.toLowerCase();
      
      let text = "";
      if (originalname.endsWith('.pdf') || req.file.mimetype === 'application/pdf') {
        const pdfParseModule = await import('pdf-parse');
        const pdfParse = (pdfParseModule as any).default || pdfParseModule;
        const result = await pdfParse(fileBuffer);
        text = result.text;
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

  app.post("/api/gemini", async (req, res) => {
    try {
      const aiClient = initAi();
      const { action, ...params } = req.body;
      let result = '';

      if (action === 'improveJobDescription') {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Rewrite this job description as 3 strong resume bullet points using action verbs and quantifiable metrics. Return only the bullet points with a dash prefix, no extra text: ${params.description}`
        });
        result = response.text ?? '';

      } else if (action === 'suggestSkills') {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `List 8 key technical and soft skills for a ${params.jobTitle} role. Return only a comma-separated list, nothing else.`
        });
        const skills = (response.text ?? '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        return res.json({ skills });

      } else if (action === 'generateSummary') {
        const expText = params.experience?.length > 0
          ? `${params.experience[0].title} at ${params.experience[0].company}`
          : 'various roles';
        const skillsText = params.technicalSkills?.slice(0, 5).join(', ') || '';
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Write a 3-sentence professional summary for a resume. Name: ${params.name}, Role: ${params.role}, Experience: ${expText}, Skills: ${skillsText}. Make it impactful and ATS-friendly. Return only the summary paragraph.`
        });
        result = response.text ?? '';

      } else if (action === 'generateCoverLetter') {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Write a professional cover letter for ${params.name} applying for ${params.jobTitle} at ${params.company}. Tone: ${params.tone}. Summary context: ${params.summary}. Skills: ${params.skills?.join(', ')}. Keep it to 3 paragraphs under 300 words. Return only the letter body.`
        });
        result = response.text ?? '';

      } else if (action === 'parseResume') {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Extract resume information from this text and return ONLY a valid JSON object, no markdown:
{name, role, email, phone, location, linkedin, portfolio, summary, experience: [{title, company, startDate, endDate, current, description}], education: [{institution, degree, field, startYear, endYear, grade}], technicalSkills: [string], softSkills: [string], projects: [{name, description, techStack: [string], liveUrl, githubUrl}]}
Resume text: ${params.text}`
        });
        try {
          const cleaned = (response.text ?? '')
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
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Analyze this resume for ATS compatibility and return ONLY a JSON object (no markdown):
{"score":<0-100>,"grade":<"A"|"B"|"C"|"D">,"issues":[<up to 4 strings>],"suggestions":[<up to 3 strings>]}
Resume: ${resumeText}`
        });
        try {
          const cleaned = (response.text ?? '')
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
