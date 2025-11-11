import type { NextApiRequest, NextApiResponse } from 'next';
import { ApplicantStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/utils/adminAuth';

const paramsSchema = z.object({
  id: z.string().uuid()
});

const bodySchema = z
  .object({
    status: z.nativeEnum(ApplicantStatus).optional(),
    adminNotes: z.string().trim().max(2000).optional(),
    assignedTo: z.string().trim().max(120).optional()
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided.'
  });

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const params = paramsSchema.safeParse(req.query);
  if (!params.success) {
    return res.status(400).json({ error: 'Invalid applicant ID.' });
  }

  const applicantId = params.data.id;

  if (req.method === 'PUT') {
    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsedBody.error.flatten() });
    }

    try {
      const updated = await prisma.applicant.update({
        where: { id: applicantId },
        data: parsedBody.data
      });
      return res.status(200).json(updated);
    } catch (error) {
      console.error('Failed to update applicant', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.applicant.delete({ where: { id: applicantId } });
      return res.status(204).end();
    } catch (error) {
      console.error('Failed to delete applicant', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  res.setHeader('Allow', 'PUT, DELETE');
  return res.status(405).end('Method Not Allowed');
});

