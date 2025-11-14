import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { requireAdmin } from '@/utils/adminAuth';

const bodySchema = z.object({
  s3Path: z.string().regex(/^s3:\/\//, 'Invalid S3 path')
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_UPLOAD_SECRET_ACCESS_KEY ?? ''
  }
});

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  const s3Path = parsed.data.s3Path;
  if (!s3Path.startsWith(`s3://${process.env.RESUME_BUCKET}/`)) {
    return res.status(400).json({ error: 'Resume bucket mismatch.' });
  }

  const [, , ...keyParts] = s3Path.split('/');
  const key = keyParts.join('/');

  const command = new GetObjectCommand({
    Bucket: process.env.RESUME_BUCKET,
    Key: key,
    ResponseContentType: 'application/pdf'
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return res.status(200).json({ signedUrl, expiresInSeconds: 60 });
});


