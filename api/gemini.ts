import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export default async function handler(
  req: VercelRequest, 
  res: VercelResponse
) {
  console.log('gemini called, action:', req.body?.action);
  console.log('API key set:', !!process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ 
      error: 'AI service not configured. API key missing.' 
    });
  }
  
  console.log('API Key present:', !!process.env.GEMINI_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, ...params } = req.body;

  try {
    let result = '';

    if (action === 'improveJobDescription') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Rewrite this job description as 3 strong 
        resume bullet points using action verbs and 
        quantifiable metrics. Return only the bullet points 
        with a dash prefix, no extra text: ${params.description}`
      });
      result = response.text ?? '';

    } else if (action === 'suggestSkills') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `List 8 key technical and soft skills for 
        a ${params.jobTitle} role. Return only a 
        comma-separated list, nothing else.`
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
      const skillsText = params.skills?.slice(0, 5).join(', ') || '';
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Write a 3-sentence professional summary 
        for a resume. Name: ${params.name}, Role: ${params.role}, 
        Experience: ${expText}, Skills: ${skillsText}. 
        Make it impactful and ATS-friendly. Return only the 
        summary paragraph.`
      });
      result = response.text ?? '';

    } else if (action === 'generateCoverLetter') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Write a professional cover letter for 
        ${params.name} applying for ${params.jobTitle} at 
        ${params.company}. Tone: ${params.tone}. 
        Summary context: ${params.summary}. 
        Skills: ${params.skills}. 
        Keep it to 3 paragraphs under 300 words. 
        Return only the letter body.`
      });
      result = response.text ?? '';

    } else if (action === 'parseResume') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Extract resume information from this text 
        and return ONLY a valid JSON object, no markdown:
        {name, role, email, phone, location, linkedin, 
        portfolio, summary, 
        experience: [{title, company, startDate, endDate, 
          current, description}],
        education: [{institution, degree, field, startYear, 
          endYear, grade}],
        technicalSkills: [string], softSkills: [string],
        projects: [{name, description, techStack: [string], 
          liveUrl, githubUrl}]}
        
        Resume text: ${params.text}`
      });
      try {
        const cleaned = (response.text ?? '')
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
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Analyze this resume for ATS compatibility 
        and return ONLY a JSON object (no markdown):
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
        
        Resume: ${resumeText}`
      });
      
      try {
        const cleaned = (response.text ?? '')
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
