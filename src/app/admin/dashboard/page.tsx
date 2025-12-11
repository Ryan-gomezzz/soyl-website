import prisma from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdminAuthenticatedFromCookies } from '@/lib/adminAuth'
import { DashboardAnalytics } from './DashboardAnalytics'

async function loadData() {
  try {
    const [pageVisits, pilotRequests, inquiries, applicants] = await Promise.all([
      prisma.pageVisit.count().catch(() => null),
      prisma.pilotRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }).catch(() => []),
      prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }).catch(() => []),
      prisma.applicant.count().catch(() => null),
    ])
    return { pageVisits, pilotRequests, inquiries, applicants, error: null }
  } catch (error) {
    console.error('[admin-dashboard]', error)
    return {
      pageVisits: null,
      pilotRequests: [],
      inquiries: [],
      applicants: null,
      error: error instanceof Error ? error.message : 'Failed to load data',
    }
  }
}

export default async function AdminDashboard() {
  const authed = await isAdminAuthenticatedFromCookies()
  if (!authed) {
    redirect('/admin/login')
  }

  const data = await loadData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1224] via-[#0e162d] to-[#0b1224] text-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-accent font-semibold">SOYL Admin</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <form action="/api/admin/auth/logout" method="post">
            <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
              Logout
            </button>
          </form>
        </div>

        {data.error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <p className="font-semibold">Error loading data</p>
            <p className="mt-1">{data.error}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Page Visits" value={data.pageVisits ?? '—'} />
          <StatCard label="Pilot Requests" value={data.pilotRequests.length} />
          <StatCard label="Inquiries" value={data.inquiries.length} />
          <StatCard label="Applicants" value={data.applicants ?? '—'} />
        </div>

        <div className="mt-10">
          <DashboardAnalytics />
        </div>

        <div className="mt-10 space-y-8">
          <DataTable
            title="Pilot Requests"
            columns={['Name', 'Email', 'Company', 'Created']}
            rows={data.pilotRequests.map((r) => [
              r.name,
              r.email,
              r.company,
              r.createdAt.toLocaleDateString(),
            ])}
            empty="No pilot requests yet."
          />

          <DataTable
            title="Inquiries"
            columns={['Name', 'Email', 'Type', 'Message', 'Created']}
            rows={data.inquiries.map((r) => [
              r.name,
              r.email,
              r.type,
              r.message,
              r.createdAt.toLocaleDateString(),
            ])}
            empty="No inquiries yet."
          />
        </div>

        <div className="mt-8 text-sm text-muted">
          Need help? <Link className="text-accent hover:underline" href="mailto:hello@soyl.ai">Contact support</Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
      <p className="text-sm text-muted mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function DataTable({
  title,
  columns,
  rows,
  empty,
}: {
  title: string
  columns: string[]
  rows: (string | number | null)[][]
  empty: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs text-muted">{rows.length} items</span>
      </div>
      {rows.length === 0 ? (
        <div className="p-4 text-sm text-muted">{empty}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2 text-left font-semibold text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-2 text-white/90">
                      {cell ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

