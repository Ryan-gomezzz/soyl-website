import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client =
  process.env.RESUME_BUCKET && process.env.AWS_REGION
    ? new S3Client({
        region: process.env.AWS_REGION,
        credentials: process.env.S3_UPLOAD_ACCESS_KEY_ID
          ? {
              accessKeyId: process.env.S3_UPLOAD_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_UPLOAD_SECRET_ACCESS_KEY ?? ''
            }
          : undefined
      })
    : null;

const TEXT_DECODER = new TextDecoder();

async function fetchResumeText(s3Uri: string): Promise<string> {
  if (!client || !process.env.RESUME_BUCKET) {
    return '';
  }

  const [, , ...parts] = s3Uri.split('/');
  const key = parts.join('/');

  const command = new GetObjectCommand({
    Bucket: process.env.RESUME_BUCKET,
    Key: key
  });

  try {
    const response = await client.send(command);
    if (response.ContentType?.includes('pdf')) {
      // PDF parsing requires an external service (Textract, LLM, etc.).
      return '';
    }
    const body = await response.Body?.transformToByteArray();
    return body ? TEXT_DECODER.decode(body) : '';
  } catch (error) {
    console.error('Unable to fetch resume for scoring', { error, key });
    return '';
  }
}

export async function scoreResumeKeywords(s3Uri: string, keywords: string[]) {
  const text = await fetchResumeText(s3Uri);
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

