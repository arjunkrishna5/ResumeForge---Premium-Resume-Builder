import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ maxFileSize: 5 * 1024 * 1024 });
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    const file = Array.isArray(files.file) 
      ? files.file[0] 
      : files.file;
      
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    try {
      const buffer = fs.readFileSync(file.filepath);
      let text = '';

      if (file.mimetype === 'application/pdf') {
        const PDFParse = (await import('pdf-parse')).default;
        const data = await PDFParse(buffer);
        text = data.text;
      } else if (
        file.mimetype === 
        'application/vnd.openxmlformats-officedocument' +
        '.wordprocessingml.document' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.originalFilename?.endsWith('.docx')
      ) {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ 
          buffer 
        });
        text = result.value;
      } else {
        return res.status(400).json({ 
          error: 'Only PDF and DOCX files are supported' 
        });
      }

      return res.json({ text });
    } catch (error: any) {
      return res.status(500).json({ 
        error: 'Failed to extract text from file' 
      });
    }
  });
}
