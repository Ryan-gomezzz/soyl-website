import { supabase, RESUME_BUCKET } from '@/lib/supabase';

const TEXT_DECODER = new TextDecoder();

async function fetchResumeText(fileUri: string): Promise<string> {
  if (!supabase) {
    return '';
  }

  // Parse Supabase Storage URI: supabase://bucket/path
  if (!fileUri.startsWith('supabase://')) {
    return '';
  }

  const urlParts = fileUri.replace('supabase://', '').split('/');
  if (urlParts.length < 2) {
    return '';
  }

  const bucket = urlParts[0];
  const filePath = urlParts.slice(1).join('/');

  // Verify bucket matches configured bucket
  if (bucket !== RESUME_BUCKET) {
    return '';
  }

  try {
    const { data, error } = await supabase.storage
      .from(RESUME_BUCKET)
      .download(filePath);

    if (error) {
      console.error('Unable to fetch resume for scoring', { error, filePath });
      return '';
    }

    if (!data) {
      return '';
    }

    // PDF parsing requires an external service (Textract, LLM, etc.).
    // For now, return empty string for PDFs
    const arrayBuffer = await data.arrayBuffer();
    // Basic check: PDF files start with %PDF
    const firstBytes = new Uint8Array(arrayBuffer.slice(0, 4));
    if (String.fromCharCode(...firstBytes) === '%PDF') {
      return '';
    }

    return TEXT_DECODER.decode(arrayBuffer);
  } catch (error) {
    console.error('Unable to fetch resume for scoring', { error, filePath });
    return '';
  }
}

export async function scoreResumeKeywords(fileUri: string, keywords: string[]): Promise<number> {
  const text = await fetchResumeText(fileUri);
  if (!text) {
    return 0;
  }

  const normalized = text.toLowerCase();
  const total = keywords.length;
  const matches = keywords.reduce((acc, keyword) => {
    const occurrences = normalized.includes(keyword.toLowerCase());
    return occurrences ? acc + 1 : acc;
  }, 0);

  return total === 0 ? 0 : matches / total;
}

