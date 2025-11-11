import type { NextApiRequest, NextApiResponse } from 'next';
import { ApplicantStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/utils/adminAuth';

const querySchema = z.object({
  role: z.string().trim().optional(),
  status: z.nativeEnum(ApplicantStatus).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const parseResult = querySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters', details: parseResult.error.flatten() });
  }

  const { role, status, page = 1, pageSize = 20 } = parseResult.data;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(role ? { roleApplied: role } : {}),
    ...(status ? { status } : {})
  };

  const [items, total] = await Promise.all([
    prisma.applicant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    }),
    prisma.applicant.count({ where })
  ]);

  return res.status(200).json({
    items,
    total,
    page,
    pageSize
  });
});

