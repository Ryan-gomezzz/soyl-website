'use client'

import { useEffect, useState } from 'react'

interface AnalyticsData {
  applicants: {
    total: number
    statusCounts: Record<string, number>
    roleCounts: Record<string, number>
    sourceCounts: Record<string, number>
    avgKeywordScore: number | null
    timeSeries: Array<{ date: string; count: number }>
  }
  pageVisits: {
    total: number
    pathCounts: Record<string, number>
  }
  pilotRequests: {
    total: number
    statusCounts: Record<string, number>
  }
  inquiries: {
    total: number
    typeCounts: Record<string, number>
    statusCounts: Record<string, number>
  }
}

export function DashboardAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-muted">
        Loading analytics...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        {error || 'Failed to load analytics'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Applicant Status Distribution */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-4">Applicant Status Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(data.applicants.statusCounts).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-muted mt-1">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Application Breakdown */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-4">Applications by Role</h2>
        <div className="space-y-2">
          {Object.entries(data.applicants.roleCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm">{role}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Source Tracking */}
      {Object.keys(data.applicants.sourceCounts).length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Applications by Source</h2>
          <div className="space-y-2">
            {Object.entries(data.applicants.sourceCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm">{source || 'Unknown'}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Applications Over Time */}
      {data.applicants.timeSeries.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Applications Over Time</h2>
          <div className="space-y-1">
            {data.applicants.timeSeries.slice(-14).map(({ date, count }) => (
              <div key={date} className="flex items-center gap-2">
                <span className="text-xs text-muted w-24">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-4 relative overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{
                      width: `${(count / Math.max(...data.applicants.timeSeries.map((t) => t.count))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Average Keyword Score */}
      {data.applicants.avgKeywordScore !== null && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-2">Average Keyword Score</h2>
          <div className="text-3xl font-bold">
            {(data.applicants.avgKeywordScore * 100).toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  )
}

