import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAdminAuthenticatedFromCookies } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const authed = await isAdminAuthenticatedFromCookies()
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get date range from query params (optional)
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const dateFilter = startDate && endDate
      ? {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {}

    // Get all applicants
    const applicants = await prisma.applicant.findMany({
      where: dateFilter,
      select: {
        status: true,
        roleApplied: true,
        source: true,
        createdAt: true,
        keywordScore: true,
      },
    })

    // Get page visits
    const pageVisits = await prisma.pageVisit.findMany({
      where: dateFilter,
      select: {
        path: true,
        createdAt: true,
      },
    })

    // Get pilot requests
    const pilotRequests = await prisma.pilotRequest.findMany({
      where: dateFilter,
      select: {
        status: true,
        createdAt: true,
      },
    })

    // Get inquiries
    const inquiries = await prisma.inquiry.findMany({
      where: dateFilter,
      select: {
        type: true,
        status: true,
        createdAt: true,
      },
    })

    // Calculate statistics
    const applicantStatusCounts = applicants.reduce(
      (acc, applicant) => {
        acc[applicant.status] = (acc[applicant.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const roleCounts = applicants.reduce(
      (acc, applicant) => {
        acc[applicant.roleApplied] = (acc[applicant.roleApplied] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const sourceCounts = applicants.reduce(
      (acc, applicant) => {
        if (applicant.source) {
          acc[applicant.source] = (acc[applicant.source] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    )

    // Time series data (applications over time)
    const timeSeriesData = applicants.reduce(
      (acc, applicant) => {
        const date = new Date(applicant.createdAt).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Average keyword score
    const scoresWithValues = applicants
      .map((a) => a.keywordScore)
      .filter((score): score is number => score !== null)
    const avgKeywordScore =
      scoresWithValues.length > 0
        ? scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length
        : null

    // Page visit statistics
    const pageVisitCounts = pageVisits.reduce(
      (acc, visit) => {
        acc[visit.path] = (acc[visit.path] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return NextResponse.json({
      applicants: {
        total: applicants.length,
        statusCounts: applicantStatusCounts,
        roleCounts,
        sourceCounts,
        avgKeywordScore,
        timeSeries: Object.entries(timeSeriesData)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date)),
      },
      pageVisits: {
        total: pageVisits.length,
        pathCounts: pageVisitCounts,
      },
      pilotRequests: {
        total: pilotRequests.length,
        statusCounts: pilotRequests.reduce(
          (acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ),
      },
      inquiries: {
        total: inquiries.length,
        typeCounts: inquiries.reduce(
          (acc, inquiry) => {
            acc[inquiry.type] = (acc[inquiry.type] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ),
        statusCounts: inquiries.reduce(
          (acc, inquiry) => {
            acc[inquiry.status] = (acc[inquiry.status] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ),
      },
    })
  } catch (error) {
    console.error('[admin-analytics]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

