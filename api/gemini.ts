import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

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

export default async function handler(
  req: VercelRequest, 
  res: VercelResponse
) {
  // Inject Security Headers
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  // IP-based Rate Limiter (15 req / min)
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60000;
  const limit = 15;

  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitMap.set(ip, record);
  } else {
    record.count++;
    if (record.count > limit) {
      return res.status(429).json({
        error: "Too many requests. Please wait before trying again."
      });
    }
  }

  console.log('gemini called, action:', req.body?.action);
  const hasKeys = !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY);
  console.log('Any API key set:', hasKeys);

  if (!hasKeys) {
    console.error('No AI API Keys are configured');
    return res.status(500).json({ 
      error: 'AI service not configured. API keys are missing.' 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, ...params } = req.body;

  try {
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
      const skillsText = params.skills?.slice(0, 5).join(', ') || '';
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
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        return res.json({ data: JSON.parse(cleaned) });
      } catch {
        return res.status(400).json({ 
          error: 'Could not parse resume data' 
        });
      }

    } else if (action === 'calculateATSScore') {
      const resumeText = `
        Name: ${params.name}
        Role: ${params.role}
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
        {
          "score": <number 0-100>,
          "grade": <"A"|"B"|"C"|"D">,
          "issues": [<up to 4 short strings describing problems>],
          "suggestions": [<up to 3 short improvement tips>]
        }
        
        Score based on:
        - Has professional summary (20 points)
        - Has measurable achievements with numbers (20 points)
        - Skills section present and relevant (20 points)
        - Consistent date formatting (15 points)
        - Contact info complete (15 points)
        - No spelling/grammar issues visible (10 points)
        
        Resume: ${resumeText}`,
        true
      );
      
      try {
        const cleaned = responseText
          .replace(/\`\`\`json/g, '')
          .replace(/\`\`\`/g, '')
          .trim();
        return res.json({ atsData: JSON.parse(cleaned) });
      } catch {
        return res.json({ 
          atsData: { score: 70, grade: 'B', 
            issues: [], suggestions: [] } 
        });
      }

    } else {
      return res.status(400).json({ error: 'Unknown action' });
    }

    return res.json({ text: result });

  } catch (error: any) {
    console.error('Gemini error:', error);
    if (error.message?.includes('429') || 
        error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'AI rate limit exceeded. Please wait and try again.' 
      });
    }
    return res.status(500).json({ 
      error: error.message || 'AI request failed' 
    });
  }
}
