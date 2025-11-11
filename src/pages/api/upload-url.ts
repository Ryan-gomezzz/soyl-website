import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';
import { z } from 'zod';

const payloadSchema = z.object({
  fileName: z.string().min(1).max(180),
  fileType: z.string().min(1),
  fileSize: z.number().positive()
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_UPLOAD_SECRET_ACCESS_KEY ?? ''
  }
});

const ALLOWED_TYPES = new Set(['application/pdf']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  if (req.headers['x-api-secret'] !== process.env.UPLOAD_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parseResult = payloadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parseResult.error.flatten() });
  }

  const { fileName, fileType, fileSize } = parseResult.data;

  if (!process.env.RESUME_BUCKET) {
    return res.status(500).json({ error: 'Resume bucket not configured.' });
  }

  if (!process.env.S3_UPLOAD_ACCESS_KEY_ID || !process.env.S3_UPLOAD_SECRET_ACCESS_KEY) {
    return res.status(500).json({ error: 'S3 upload credentials missing.' });
  }

  if (!ALLOWED_TYPES.has(fileType)) {
    return res.status(400).json({ error: 'Only PDF resumes are supported.' });
  }

  if (fileSize > MAX_FILE_SIZE) {
    return res.status(400).json({ error: 'File exceeds 5 MB limit.' });
  }

  const sanitizedFileName = fileName.replace(/[^\w.-]/g, '-').toLowerCase();
  const key = `resumes/${crypto.randomUUID()}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.RESUME_BUCKET,
    Key: key,
    ContentType: fileType,
    Metadata: {
      uploadedAt: new Date().toISOString()
    }
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  const fileUrl = `s3://${process.env.RESUME_BUCKET}/${key}`;

  return res.status(200).json({ uploadUrl, fileUrl, expiresInSeconds: 60 * 5 });
}

