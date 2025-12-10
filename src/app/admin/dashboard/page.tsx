import { redirect } from 'next/navigation'
import prisma, { safePrismaOperation, isDatabaseConnectionError } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface DashboardData {
    pageVisits: number | null
    pilotRequests: any[]
    inquiries: any[]
    errors: {
        pageVisits?: string
        pilotRequests?: string
        inquiries?: string
    }
}

async function fetchDashboardData(): Promise<DashboardData> {
    const data: DashboardData = {
        pageVisits: null,
        pilotRequests: [],
        inquiries: [],
        errors: {}
    }

    // Fetch each data source independently to allow partial success
    const [pageVisitsResult, pilotRequestsResult, inquiriesResult] = await Promise.allSettled([
        safePrismaOperation(async () => await prisma.pageVisit.count(), 0),
        safePrismaOperation(async () => await prisma.pilotRequest.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        }), []),
        safePrismaOperation(async () => await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        }), [])
    ])

    // Handle page visits
    if (pageVisitsResult.status === 'fulfilled' && pageVisitsResult.value.success) {
        data.pageVisits = pageVisitsResult.value.data ?? 0
    } else {
        const error = pageVisitsResult.status === 'rejected' 
            ? 'Unexpected error' 
            : pageVisitsResult.value.error || 'Unknown error'
        data.errors.pageVisits = error
        console.error('[Dashboard] Failed to fetch page visits:', error)
    }

    // Handle pilot requests
    if (pilotRequestsResult.status === 'fulfilled' && pilotRequestsResult.value.success) {
        data.pilotRequests = pilotRequestsResult.value.data ?? []
    } else {
        const error = pilotRequestsResult.status === 'rejected'
            ? 'Unexpected error'
            : pilotRequestsResult.value.error || 'Unknown error'
        data.errors.pilotRequests = error
        console.error('[Dashboard] Failed to fetch pilot requests:', error)
    }

    // Handle inquiries
    if (inquiriesResult.status === 'fulfilled' && inquiriesResult.value.success) {
        data.inquiries = inquiriesResult.value.data ?? []
    } else {
        const error = inquiriesResult.status === 'rejected'
            ? 'Unexpected error'
            : inquiriesResult.value.error || 'Unknown error'
        data.errors.inquiries = error
        console.error('[Dashboard] Failed to fetch inquiries:', error)
    }

    return data
}

export default async function AdminDashboard() {
    // Verify admin session
    try {
        await requireAdminSession()
    } catch {
        redirect('/admin/login')
    }

    // Fetch data from database with error handling
    const dashboardData = await fetchDashboardData()
    
    // Check if database is unavailable (if any error is a connection error)
    const allErrors = [
        dashboardData.errors.pageVisits,
        dashboardData.errors.pilotRequests,
        dashboardData.errors.inquiries
    ].filter(Boolean)
    
    const isDatabaseUnavailable = allErrors.length > 0 && 
        allErrors.some(err => err?.includes('connection') || err?.includes('Database') || err?.includes('unavailable'))

    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

                {/* Database Error Banner */}
                {isDatabaseUnavailable && (
                    <div className="mb-6 glass p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                        <p className="text-yellow-400">
                            <strong>Warning:</strong> Database connection unavailable. Some data may not be displayed. 
                            Please check your DATABASE_URL configuration.
                        </p>
                    </div>
                )}

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass p-6 rounded-xl border border-white/10">
                        <h3 className="text-muted text-sm uppercase tracking-wider mb-2">Total Page Views</h3>
                        {dashboardData.pageVisits !== null ? (
                            <p className="text-4xl font-bold text-accent">{dashboardData.pageVisits}</p>
                        ) : (
                            <div>
                                <p className="text-2xl font-bold text-muted">—</p>
                                {dashboardData.errors.pageVisits && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {dashboardData.errors.pageVisits.includes('connection') 
                                            ? 'Database unavailable' 
                                            : 'Error loading data'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="glass p-6 rounded-xl border border-white/10">
                        <h3 className="text-muted text-sm uppercase tracking-wider mb-2">Pilot Requests</h3>
                        {!dashboardData.errors.pilotRequests ? (
                            <p className="text-4xl font-bold text-accent">{dashboardData.pilotRequests.length}</p>
                        ) : (
                            <div>
                                <p className="text-2xl font-bold text-muted">—</p>
                                <p className="text-xs text-red-400 mt-1">
                                    {dashboardData.errors.pilotRequests.includes('connection')
                                        ? 'Database unavailable'
                                        : 'Error loading data'}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="glass p-6 rounded-xl border border-white/10">
                        <h3 className="text-muted text-sm uppercase tracking-wider mb-2">Inquiries</h3>
                        {!dashboardData.errors.inquiries ? (
                            <p className="text-4xl font-bold text-accent">{dashboardData.inquiries.length}</p>
                        ) : (
                            <div>
                                <p className="text-2xl font-bold text-muted">—</p>
                                <p className="text-xs text-red-400 mt-1">
                                    {dashboardData.errors.inquiries.includes('connection')
                                        ? 'Database unavailable'
                                        : 'Error loading data'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pilot Requests Table */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Pilot Requests</h2>
                    <div className="glass rounded-xl border border-white/10 overflow-hidden">
                        {dashboardData.errors.pilotRequests ? (
                            <div className="p-8 text-center">
                                <p className="text-red-400 mb-2">
                                    {dashboardData.errors.pilotRequests.includes('connection')
                                        ? 'Database connection unavailable'
                                        : 'Error loading pilot requests'}
                                </p>
                                <p className="text-sm text-muted">
                                    {process.env.NODE_ENV === 'development' && dashboardData.errors.pilotRequests}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Company</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {dashboardData.pilotRequests.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted">No requests yet</td>
                                            </tr>
                                        ) : (
                                            dashboardData.pilotRequests.map((req) => (
                                                <tr key={req.id} className="hover:bg-white/5">
                                                    <td className="p-4">{req.name}</td>
                                                    <td className="p-4">{req.company}</td>
                                                    <td className="p-4">{req.email}</td>
                                                    <td className="p-4">{req.createdAt.toLocaleDateString()}</td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs">
                                                            {req.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Inquiries Table */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Inquiries</h2>
                    <div className="glass rounded-xl border border-white/10 overflow-hidden">
                        {dashboardData.errors.inquiries ? (
                            <div className="p-8 text-center">
                                <p className="text-red-400 mb-2">
                                    {dashboardData.errors.inquiries.includes('connection')
                                        ? 'Database connection unavailable'
                                        : 'Error loading inquiries'}
                                </p>
                                <p className="text-sm text-muted">
                                    {process.env.NODE_ENV === 'development' && dashboardData.errors.inquiries}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Message</th>
                                            <th className="p-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {dashboardData.inquiries.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted">No inquiries yet</td>
                                            </tr>
                                        ) : (
                                            dashboardData.inquiries.map((inq) => (
                                                <tr key={inq.id} className="hover:bg-white/5">
                                                    <td className="p-4">{inq.name}</td>
                                                    <td className="p-4">{inq.email}</td>
                                                    <td className="p-4">{inq.type}</td>
                                                    <td className="p-4 max-w-xs truncate">{inq.message}</td>
                                                    <td className="p-4">{inq.createdAt.toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
