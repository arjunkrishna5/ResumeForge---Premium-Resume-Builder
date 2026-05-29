import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import { PDFParse } from "pdf-parse";
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
        const parser = new PDFParse({ data: fileBuffer });
        const data = await parser.getText();
        text = data.text;
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

  app.post("/api/improveJobDescription", async (req, res) => {
    try {
      const aiClient = initAi();
      const { description } = req.body;
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Rewrite this job description as 3 strong resume bullet points using action verbs and quantifiable metrics. Return only the bullet points with a dash prefix, no extra text: ${description}`
      });
      res.json({ text: response.text ?? "" });
    } catch (e: any) {
      let errorMsg = e.message || 'An error occurred';
      if (errorMsg.includes('429') || errorMsg.includes('Quota')) {
        errorMsg = 'AI rate limit exceeded. Please wait a moment and try again.';
      } else {
        console.error(e);
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/suggestSkills", async (req, res) => {
    try {
      const aiClient = initAi();
      const { jobTitle } = req.body;
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `List 8 key technical and soft skills for a ${jobTitle} role. Return only a comma-separated list, nothing else.`
      });
      const skills = (response.text ?? "").split(",").map(s => s.trim()).filter(Boolean);
      res.json({ skills: skills });
    } catch (e: any) {
      let errorMsg = e.message || 'An error occurred';
      if (errorMsg.includes('429') || errorMsg.includes('Quota')) {
        errorMsg = 'AI rate limit exceeded. Please wait a moment and try again.';
      } else {
        console.error(e);
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/generateSummary", async (req, res) => {
    try {
      const aiClient = initAi();
      const data = req.body;
      const expText = data.experience.length > 0
        ? `${data.experience[0].title} at ${data.experience[0].company}`
        : "various roles";
      const skillsText = data.skills.slice(0, 5).join(", ");
      
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Write a 3-sentence professional summary for a resume. Name: ${data.name}, Role: ${data.role}, Experience: ${expText}, Skills: ${skillsText}. Make it impactful, confident, and ATS-friendly. Return only the summary paragraph, no labels or extra text.`
      });
      res.json({ text: response.text ?? "" });
    } catch (e: any) {
      let errorMsg = e.message || 'An error occurred';
      if (errorMsg.includes('429') || errorMsg.includes('Quota')) {
        errorMsg = 'AI rate limit exceeded. Please wait a moment and try again.';
      } else {
        console.error(e);
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/parseResume", async (req, res) => {
    try {
      const aiClient = initAi();
      const { text } = req.body;
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Extract resume information from this text and return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{name, role, email, phone, location, linkedin, portfolio, summary, experience: [{title, company, startDate, endDate, current, description}], education: [{institution, degree, field, startYear, endYear, grade}], technicalSkills: [string], softSkills: [string], projects: [{name, description, techStack: [string], liveUrl, githubUrl}]}

Input text:
${text}`
      });
      let jsonText = (response.text ?? "").trim();
      // Remove possible markdown formatting for JSON
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (jsonText.startsWith("```")) {
         jsonText = jsonText.replace(/^```/, "").replace(/```$/, "").trim();
      }
      const data = JSON.parse(jsonText);
      res.json(data);
    } catch (e: any) {
      let errorMsg = e.message || 'An error occurred';
      if (errorMsg.includes('429') || errorMsg.includes('Quota')) {
        errorMsg = 'AI rate limit exceeded. Please wait a moment and try again.';
      } else {
        console.error(e);
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/generateCoverLetter", async (req, res) => {
    try {
      const aiClient = initAi();
      const { name, jobTitle, company, tone, summary, skills } = req.body;
      const response = await aiClient.models.generateContent({
         model: "gemini-3.5-flash",
         contents: `Write a professional cover letter for ${name} applying for ${jobTitle} at ${company}. Tone: ${tone}. Use this resume summary as context: ${summary}. Skills: ${skills.join(", ")}. Keep it to 3 paragraphs, under 300 words. Return only the letter body, no subject line, no date, no address.`
      });
      res.json({ text: response.text ?? "" });
    } catch (e: any) {
      let errorMsg = e.message || 'An error occurred';
      if (errorMsg.includes('429') || errorMsg.includes('Quota')) {
        errorMsg = 'AI rate limit exceeded. Please wait a moment and try again.';
      } else {
        console.error(e);
      }
      res.status(500).json({ error: errorMsg });
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
