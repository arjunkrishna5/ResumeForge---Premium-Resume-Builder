import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  app.post("/api/improveJobDescription", async (req, res) => {
    try {
      const aiClient = initAi();
      const { description } = req.body;
      const response = await aiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Rewrite this job description as 3 strong resume bullet points using action verbs and quantifiable metrics. Return only the bullet points with a dash prefix, no extra text: ${description}`
      });
      res.json({ text: response.text ?? "" });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/suggestSkills", async (req, res) => {
    try {
      const aiClient = initAi();
      const { jobTitle } = req.body;
      const response = await aiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `List 8 key technical and soft skills for a ${jobTitle} role. Return only a comma-separated list, nothing else.`
      });
      const skills = (response.text ?? "").split(",").map(s => s.trim()).filter(Boolean);
      res.json({ skills: skills });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
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
        model: "gemini-2.0-flash",
        contents: `Write a 3-sentence professional summary for a resume. Name: ${data.name}, Role: ${data.role}, Experience: ${expText}, Skills: ${skillsText}. Make it impactful, confident, and ATS-friendly. Return only the summary paragraph, no labels or extra text.`
      });
      res.json({ text: response.text ?? "" });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
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
