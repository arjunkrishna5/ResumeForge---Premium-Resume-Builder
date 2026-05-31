import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  try {
    // Collect raw body chunks
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const rawBody = Buffer.concat(chunks);
    
    // Get content type to find boundary
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ 
        error: 'Invalid multipart request' 
      });
    }
    
    const boundary = boundaryMatch[1];
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    
    // Split by boundary
    const parts = splitBuffer(rawBody, boundaryBuffer);
    
    let fileBuffer: Buffer | null = null;
    let mimeType = '';
    
    for (const part of parts) {
      const headerEnd = part.indexOf('\r\n\r\n');
      if (headerEnd === -1) continue;
      
      const headerSection = part.slice(0, headerEnd).toString();
      const fileContent = part.slice(headerEnd + 4);
      
      if (headerSection.includes('filename=') && 
          fileContent.length > 2) {
        // Remove trailing \r\n
        fileBuffer = fileContent.slice(
          0, 
          fileContent.length - 2
        );
        const mimeMatch = headerSection.match(
          /Content-Type:\s*([^\r\n]+)/i
        );
        if (mimeMatch) mimeType = mimeMatch[1].trim();
        break;
      }
    }
    
    if (!fileBuffer) {
      return res.status(400).json({ error: 'No file found in request' });
    }
    
    let text = '';
    
    if (mimeType.includes('pdf')) {
      const pdfModule = await import('pdf-parse');
      const PDFParse = (pdfModule as any).default || pdfModule;
      const parsed = await PDFParse(fileBuffer);
      text = parsed.text;
    } else if (mimeType.includes('wordprocessingml') || 
               mimeType.includes('docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ 
        buffer: fileBuffer 
      });
      text = result.value;
    } else {
      return res.status(400).json({ 
        error: 'Only PDF and DOCX files are supported' 
      });
    }
    
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Could not extract text from file. ' +
               'Please ensure the file is not scanned/image-based.' 
      });
    }
    
    return res.json({ text: text.trim() });
    
  } catch (error: any) {
    console.error('Extract text error:', error);
    return res.status(500).json({ 
      error: 'Failed to process file: ' + 
             (error.message || 'Unknown error') 
    });
  }
}

function splitBuffer(buffer: Buffer, delimiter: Buffer): Buffer[] {
  const parts: Buffer[] = [];
  let start = 0;
  
  while (true) {
    const idx = buffer.indexOf(delimiter, start);
    if (idx === -1) break;
    if (idx > start) {
      parts.push(buffer.slice(start, idx));
    }
    start = idx + delimiter.length;
  }
  
  if (start < buffer.length) {
    parts.push(buffer.slice(start));
  }
  
  return parts.filter(p => p.length > 4);
}
