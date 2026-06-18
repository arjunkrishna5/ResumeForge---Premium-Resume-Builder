import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: false,
    maxDuration: 30,
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
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) 
        ? chunk 
        : Buffer.from(chunk));
    }
    const rawBody = Buffer.concat(chunks);

    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(
      /boundary=(?:"([^"]+)"|([^\s;]+))/
    );
    
    if (!boundaryMatch) {
      return res.status(400).json({ 
        error: 'Invalid request format' 
      });
    }

    const boundary = boundaryMatch[1] || boundaryMatch[2];
    const delimiter = Buffer.from('\r\n--' + boundary);
    const firstDelimiter = Buffer.from('--' + boundary);

    let searchBuffer = rawBody;
    const firstIdx = searchBuffer.indexOf(firstDelimiter);
    if (firstIdx !== -1) {
      searchBuffer = searchBuffer.slice(
        firstIdx + firstDelimiter.length
      );
    }

    let fileBuffer: Buffer | null = null;
    let detectedMime = '';

    const parts = searchBuffer.toString('binary').split(
      '\r\n--' + boundary
    );
    
    for (const part of parts) {
      if (part.includes('filename=')) {
        const headerBodySplit = part.indexOf('\r\n\r\n');
        if (headerBodySplit === -1) continue;
        
        const headers = part.slice(0, headerBodySplit);
        const bodyBinary = part.slice(headerBodySplit + 4)
          .replace(/\r\n$/, '');
        
        const mimeMatch = headers.match(
          /content-type:\s*([^\r\n]+)/i
        );
        if (mimeMatch) detectedMime = mimeMatch[1].trim();
        
        fileBuffer = Buffer.from(bodyBinary, 'binary');
        break;
      }
    }

    if (!fileBuffer || fileBuffer.length < 10) {
      return res.status(400).json({ 
        error: 'No valid file found in request' 
      });
    }

    let extractedText = '';

    const isPdf = detectedMime.includes('pdf') || 
      (fileBuffer[0] === 0x25 && fileBuffer[1] === 0x50 && 
       fileBuffer[2] === 0x44 && fileBuffer[3] === 0x46);

    const isDocx = detectedMime.includes('wordprocessingml') ||
      detectedMime.includes('docx') ||
      (fileBuffer[0] === 0x50 && fileBuffer[1] === 0x4B);

    if (isPdf) {
      if (typeof globalThis.DOMMatrix === 'undefined') {
        (globalThis as any).DOMMatrix = class DOMMatrix {};
      }
      const pdfParseModule = await import('pdf-parse');
      if (typeof pdfParseModule.PDFParse === 'function') {
        const parser = new pdfParseModule.PDFParse({ data: fileBuffer });
        const result = await parser.getText();
        extractedText = result.text;
      } else {
        const pdfParse = (pdfParseModule as any).default || pdfParseModule;
        const result = await pdfParse(fileBuffer);
        extractedText = result.text;
      }
    } else if (isDocx) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ 
        buffer: fileBuffer 
      });
      extractedText = result.value;
    } else {
      return res.status(400).json({ 
        error: 'Only PDF and DOCX files are supported' 
      });
    }

    const cleaned = extractedText
      .replace(/\s{3,}/g, '\n\n')
      .trim();

    if (cleaned.length < 20) {
      return res.status(400).json({ 
        error: 'Could not extract readable text. ' +
               'The file may be image-based or protected.' 
      });
    }

    return res.json({ text: cleaned });

  } catch (err: any) {
    console.error('extractText error:', err);
    return res.status(500).json({ 
      error: 'Failed to process file: ' + 
             (err.message || 'Unknown error') 
    });
  }
}
