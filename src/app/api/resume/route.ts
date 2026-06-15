import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
import { pathToFileURL } from 'url';

// Configure pdfjs worker path for Next.js server-side compatibility
try {
  const workerPath = path.join(
    process.cwd(),
    'node_modules',
    'pdfjs-dist',
    'legacy',
    'build',
    'pdf.worker.mjs'
  );
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();
} catch (error) {
  console.error('Error setting pdfjs worker path:', error);
}

// Memory cache for request throttling / rate limiting
const rateLimitMap = new Map<string, number[]>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute window
const LIMIT_MAX_REQUESTS = 15; // Max 15 uploads per minute

const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

export async function POST(req: NextRequest) {
  // Throttling / Rate limiting check
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'global-anonymous';
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requestTimes = rateLimitMap.get(ip) || [];
  const activeTimes = requestTimes.filter(t => now - t < LIMIT_WINDOW);
  
  if (activeTimes.length >= LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      { success: false, error: 'Too many upload requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }
  
  activeTimes.push(now);
  rateLimitMap.set(ip, activeTimes);

  let file: File | null = null;
  try {
    const formData = await req.formData();
    file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // File size validation (5MB max)
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds the 5MB maximum limit. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let extractedText = '';
    const contentType = file.type;
    const fileName = file.name.toLowerCase();

    // MIME and Extension validation
    const isValidMime = ALLOWED_MIME_TYPES.includes(contentType);
    const isValidExt = fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc');

    if (!isValidMime && !isValidExt) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format. Only PDF, DOCX, and DOC files are permitted.' },
        { status: 400 }
      );
    }

    if (contentType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      extractedText = textResult.text || '';
      await parser.destroy();
    } else {
      const result = await mammoth.extractRawText({ buffer: buffer });
      extractedText = result.value || '';
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error: any) {
    console.error('Error parsing resume file:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to extract text from the uploaded document. Please check the file formatting.' },
      { status: 500 }
    );
  }
}
