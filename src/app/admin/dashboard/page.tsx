import { redirect } from 'next/navigation'
import prisma, { safePrismaOperation } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import type { PilotRequest, Inquiry } from '@prisma/client'
import { LogoutButton } from './LogoutButton'

export const dynamic = 'force-dynamic'

interface DashboardData {
    pageVisits: number | null
    pilotRequests: PilotRequest[]
    inquiries: Inquiry[]
    errors: {
        pageVisits?: string
        pilotRequests?: string
        inquiries?: string
    }
    database: {
        available: boolean
        message?: string
    }
}

async function fetchDashboardData(): Promise<DashboardData> {
    const data: DashboardData = {
        pageVisits: null,
        pilotRequests: [],
        inquiries: [],
        errors: {},
        database: { available: true },
    }

    // Quick health check before running multiple queries
    const dbHealth = await safePrismaOperation(async () => await prisma.$queryRaw`SELECT 1`, null)
    if (!dbHealth.success) {
        data.database = {
            available: false,
            message: dbHealth.error || 'Database unavailable',
        }
        data.errors.pageVisits = dbHealth.error
        data.errors.pilotRequests = dbHealth.error
        data.errors.inquiries = dbHealth.error
        return data
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

    // Propagate DB status for banner messaging
    const allErrors = [
        data.errors.pageVisits,
        data.errors.pilotRequests,
        data.errors.inquiries,
    ].filter(Boolean)
    if (allErrors.length > 0) {
        data.database.available = false
        data.database.message = allErrors[0]
    }

    return data
}

export default async function AdminDashboard() {
    // Verify admin session
    try {
        await requireAdminSession()
    } catch (error) {
        console.warn('[Admin Dashboard] Authentication failed, redirecting to login:', error)
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
    
    const isDatabaseUnavailable = !dashboardData.database.available || allErrors.some(err => err?.toLowerCase().includes('connection') || err?.toLowerCase().includes('database') || err?.toLowerCase().includes('unavailable'))

    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <LogoutButton />
                </div>

                {/* Database Error Banner */}
                {isDatabaseUnavailable && (
                    <div className="mb-6 glass p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-yellow-400 font-semibold mb-1">Database Connection Warning</p>
                                <p className="text-yellow-300/80 text-sm">
                                    The database connection is currently unavailable. Some data may not be displayed correctly. 
                                    Please verify your <code className="bg-yellow-500/20 px-1 rounded">DATABASE_URL</code> environment variable is correctly configured.
                                </p>
                            </div>
                        </div>
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
                                        {dashboardData.errors.pageVisits.includes('connection') || dashboardData.errors.pageVisits.includes('Database')
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
                                    {dashboardData.errors.pilotRequests.includes('connection') || dashboardData.errors.pilotRequests.includes('Database')
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
                                    {dashboardData.errors.inquiries.includes('connection') || dashboardData.errors.inquiries.includes('Database')
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
                                <div className="space-y-2">
                                    <p className="text-red-400 font-medium">
                                        {dashboardData.errors.pilotRequests.includes('connection') || dashboardData.errors.pilotRequests.includes('Database')
                                            ? 'Database connection unavailable'
                                            : 'Error loading pilot requests'}
                                    </p>
                                    {process.env.NODE_ENV === 'development' && (
                                        <p className="text-xs text-muted font-mono bg-red-500/10 p-2 rounded">
                                            {dashboardData.errors.pilotRequests}
                                        </p>
                                    )}
                                </div>
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
                                <div className="space-y-2">
                                    <p className="text-red-400 font-medium">
                                        {dashboardData.errors.inquiries.includes('connection') || dashboardData.errors.inquiries.includes('Database')
                                            ? 'Database connection unavailable'
                                            : 'Error loading inquiries'}
                                    </p>
                                    {process.env.NODE_ENV === 'development' && (
                                        <p className="text-xs text-muted font-mono bg-red-500/10 p-2 rounded">
                                            {dashboardData.errors.inquiries}
                                        </p>
                                    )}
                                </div>
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
