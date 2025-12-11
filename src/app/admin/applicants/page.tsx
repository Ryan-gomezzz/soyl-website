import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAdminAuthenticatedFromCookies } from '@/lib/adminAuth'
import Link from 'next/link'
import { ApplicantManagement } from './ApplicantManagement'

async function loadApplicants() {
  try {
    const applicants = await prisma.applicant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limit to prevent performance issues
    })
    return { applicants, error: null }
  } catch (error) {
    console.error('[admin-applicants]', error)
    return {
      applicants: [],
      error: error instanceof Error ? error.message : 'Failed to load applicants',
    }
  }
}

export default async function AdminApplicantsPage() {
  const authed = await isAdminAuthenticatedFromCookies()
  if (!authed) {
    redirect('/admin/login')
  }

  const data = await loadApplicants()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1224] via-[#0e162d] to-[#0b1224] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-accent font-semibold">SOYL Admin</p>
            <h1 className="text-3xl font-bold">Applicant Management</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
            <form action="/api/admin/auth/logout" method="post">
              <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
                Logout
              </button>
            </form>
          </div>
        </div>

        {data.error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <p className="font-semibold">Error loading applicants</p>
            <p className="mt-1">{data.error}</p>
          </div>
        )}

        <ApplicantManagement initialApplicants={data.applicants} />
      </div>
    </div>
  )
}

