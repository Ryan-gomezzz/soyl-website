import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/utils/rateLimit';
import { sendApplicantEmail } from '@/utils/sendgrid';
import { postSlackNotification } from '@/utils/slack';
import { scoreResumeKeywords } from '@/utils/resumeScorer';

const bodySchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().max(80).optional(),
  location: z.string().trim().max(120).optional(),
  roleApplied: z.string().trim().min(1),
  seniority: z.string().trim().min(1),
  linkedin: z.string().trim().min(1, 'LinkedIn URL is required').refine(
    (val) => {
      const lower = val.toLowerCase();
      return lower.includes('linkedin.com') || lower.startsWith('http');
    },
    { message: 'LinkedIn URL must contain linkedin.com' }
  ),
  github: z.string().trim().url().optional().or(z.literal('')),
  resumeUrl: z.string().trim().regex(/^s3:\/\//, 'Resume must be stored in S3'),
  coverLetter: z.string().trim().max(1600).optional(),
  workEligibility: z.string().trim().min(1),
  noticePeriod: z.string().trim().max(120).optional(),
  salaryExpectation: z.string().trim().max(120).optional(),
  consent: z.boolean(),
  utmSource: z.string().trim().max(120).optional(),
  recaptchaToken: z.string().trim().min(10, 'reCAPTCHA token missing')
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_TOKENS = 10;

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('RECAPTCHA_SECRET_KEY missing. Skipping verification.');
    return true;
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      secret,
      response: token
    })
  });

  const data = (await response.json()) as { success: boolean; score?: number };
  return data.success && (typeof data.score !== 'number' || data.score >= 0.5);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const isLimited = await rateLimit(req, {
    intervalMs: RATE_LIMIT_WINDOW_MS,
    uniqueTokenPerInterval: RATE_LIMIT_TOKENS
  });

  if (!isLimited.success) {
    return res.status(429).json({ error: 'Too many submissions. Please try again shortly.' });
  }

  const parseResult = bodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parseResult.error.flatten() });
  }

  const payload = parseResult.data;

  if (!payload.consent) {
    return res.status(400).json({ error: 'Consent is required.' });
  }

  if (!process.env.RESUME_BUCKET || !payload.resumeUrl.startsWith(`s3://${process.env.RESUME_BUCKET}/`)) {
    return res.status(400).json({ error: 'Resume location is invalid.' });
  }

  const isRecaptchaValid = await verifyRecaptcha(payload.recaptchaToken);
  if (!isRecaptchaValid) {
    return res.status(400).json({ error: 'reCAPTCHA validation failed.' });
  }

  try {
    const keywordScore = await scoreResumeKeywords(payload.resumeUrl, [
      'LLM',
      'LangChain',
      'PyTorch',
      'Terraform',
      'Next.js',
      'PostgreSQL'
    ]);

    const applicant = await prisma.applicant.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        location: payload.location,
        roleApplied: payload.roleApplied,
        seniority: payload.seniority,
        linkedin: payload.linkedin,
        github: payload.github,
        resumeUrl: payload.resumeUrl,
        coverLetter: payload.coverLetter,
        workEligibility: payload.workEligibility,
        noticePeriod: payload.noticePeriod,
        salaryExpectation: payload.salaryExpectation,
        consent: payload.consent,
        source: payload.utmSource,
        keywordScore
      }
    });

    void Promise.all([sendApplicantEmail(applicant), postSlackNotification(applicant)]);

    return res.status(201).json({ id: applicant.id });
  } catch (error) {
    console.error('Failed to create applicant', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}


