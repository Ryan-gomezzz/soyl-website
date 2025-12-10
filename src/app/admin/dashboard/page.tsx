import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    // Verify admin session
    try {
        await requireAdminSession()
    } catch {
        redirect('/admin/login')
    }

    // Fetch data from database
    const [pageVisits, pilotRequests, inquiries] = await Promise.all([
        prisma.pageVisit.count(),
        prisma.pilotRequest.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit for display
        }),
        prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit for display
        }),
    ])

    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass p-6 rounded-xl border border-white/10">
                        <h3 className="text-muted text-sm uppercase tracking-wider mb-2">Total Page Views</h3>
                        <p className="text-4xl font-bold text-accent">{pageVisits}</p>
                    </div>
                    <div className="glass p-6 rounded-xl border border-white/10">
                        <h3 className="text-muted text-sm uppercase tracking-wider mb-2">Pilot Requests</h3>
                        <p className="text-4xl font-bold text-accent">{pilotRequests.length}</p>
                    </div>
                    <div className="glass p-6 rounded-xl border border-white/10">
                        <h3 className="text-muted text-sm uppercase tracking-wider mb-2">Inquiries</h3>
                        <p className="text-4xl font-bold text-accent">{inquiries.length}</p>
                    </div>
                </div>

                {/* Pilot Requests Table */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Pilot Requests</h2>
                    <div className="glass rounded-xl border border-white/10 overflow-hidden">
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
                                    {pilotRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted">No requests yet</td>
                                        </tr>
                                    ) : (
                                        pilotRequests.map((req) => (
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
                    </div>
                </div>

                {/* Inquiries Table */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Inquiries</h2>
                    <div className="glass rounded-xl border border-white/10 overflow-hidden">
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
                                    {inquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted">No inquiries yet</td>
                                        </tr>
                                    ) : (
                                        inquiries.map((inq) => (
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
                    </div>
                </div>
            </div>
        </div>
    )
}
