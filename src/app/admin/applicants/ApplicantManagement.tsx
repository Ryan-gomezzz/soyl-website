'use client'

import { useState, useMemo, useCallback } from 'react'
import { ApplicantStatus } from '@prisma/client'

interface Applicant {
  id: string
  fullName: string
  email: string
  phone: string | null
  location: string | null
  roleApplied: string
  seniority: string
  linkedin: string
  github: string | null
  resumeUrl: string
  coverLetter: string | null
  workEligibility: string
  noticePeriod: string | null
  salaryExpectation: string | null
  source: string | null
  consent: boolean
  keywordScore: number | null
  status: ApplicantStatus
  assignedTo: string | null
  adminNotes: string | null
  createdAt: Date
  updatedAt: Date
}

interface ApplicantManagementProps {
  initialApplicants: Applicant[]
}

export function ApplicantManagement({ initialApplicants }: ApplicantManagementProps) {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [filterStatus, setFilterStatus] = useState<ApplicantStatus | 'ALL'>('ALL')
  const [filterRole, setFilterRole] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    const roles = new Set(applicants.map((a) => a.roleApplied))
    return Array.from(roles).sort()
  }, [applicants])

  // Filter applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesStatus = filterStatus === 'ALL' || applicant.status === filterStatus
      const matchesRole = !filterRole || applicant.roleApplied === filterRole
      const matchesSearch =
        !searchQuery ||
        applicant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.roleApplied.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesRole && matchesSearch
    })
  }, [applicants, filterStatus, filterRole, searchQuery])

  const handleUpdate = async (id: string, updates: Partial<Applicant>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/applicants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update applicant')
      }

      const updated = await response.json()
      setApplicants((prev) => prev.map((a) => (a.id === id ? updated : a)))
      setSelectedApplicant(updated)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update applicant:', error)
      alert(error instanceof Error ? error.message : 'Failed to update applicant')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this applicant? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/applicants/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete applicant')
      }

      setApplicants((prev) => prev.filter((a) => a.id !== id))
      if (selectedApplicant?.id === id) {
        setSelectedApplicant(null)
      }
    } catch (error) {
      console.error('Failed to delete applicant:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete applicant')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadResume = async (applicant: Applicant) => {
    try {
      const response = await fetch(`/api/admin/resume/${applicant.id}`)
      if (!response.ok) {
        throw new Error('Failed to get resume download URL')
      }
      const { downloadUrl } = await response.json()
      window.open(downloadUrl, '_blank')
    } catch (error) {
      console.error('Failed to download resume:', error)
      alert('Failed to download resume. Please try again.')
    }
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: applicants.length,
      NEW: 0,
      SCREENING: 0,
      INTERVIEW: 0,
      REJECTED: 0,
      HIRED: 0,
    }
    applicants.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1
    })
    return counts
  }, [applicants])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Applicant List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Filters */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ApplicantStatus | 'ALL')}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="ALL">All ({statusCounts.ALL})</option>
                <option value="NEW">New ({statusCounts.NEW})</option>
                <option value="SCREENING">Screening ({statusCounts.SCREENING})</option>
                <option value="INTERVIEW">Interview ({statusCounts.INTERVIEW})</option>
                <option value="REJECTED">Rejected ({statusCounts.REJECTED})</option>
                <option value="HIRED">Hired ({statusCounts.HIRED})</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, email, or role..."
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* Applicant List */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Applicants ({filteredApplicants.length})</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filteredApplicants.length === 0 ? (
              <div className="p-8 text-center text-muted">No applicants found</div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    onClick={() => setSelectedApplicant(applicant)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition ${
                      selectedApplicant?.id === applicant.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{applicant.fullName}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              applicant.status === 'NEW'
                                ? 'bg-blue-500/20 text-blue-300'
                                : applicant.status === 'SCREENING'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : applicant.status === 'INTERVIEW'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : applicant.status === 'REJECTED'
                                      ? 'bg-red-500/20 text-red-300'
                                      : 'bg-green-500/20 text-green-300'
                            }`}
                          >
                            {applicant.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted">{applicant.email}</p>
                        <p className="text-xs text-muted mt-1">
                          {applicant.roleApplied} • {applicant.seniority}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {new Date(applicant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Applicant Details */}
      <div className="lg:col-span-1">
        {selectedApplicant ? (
          <ApplicantDetails
            applicant={selectedApplicant}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={() => {
              setIsEditing(false)
              setSelectedApplicant(
                applicants.find((a) => a.id === selectedApplicant.id) || null
              )
            }}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onDownloadResume={handleDownloadResume}
            isLoading={isLoading}
          />
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-muted">
            Select an applicant to view details
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicantDetails({
  applicant,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
  onDownloadResume,
  isLoading,
}: {
  applicant: Applicant
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onUpdate: (id: string, updates: Partial<Applicant>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onDownloadResume: (applicant: Applicant) => Promise<void>
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    status: applicant.status,
    assignedTo: applicant.assignedTo || '',
    adminNotes: applicant.adminNotes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate(applicant.id, formData)
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Applicant Details</h2>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-xs bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(applicant.id)}
              className="px-3 py-1.5 text-xs bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicantStatus })}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="NEW">New</option>
              <option value="SCREENING">Screening</option>
              <option value="INTERVIEW">Interview</option>
              <option value="REJECTED">Rejected</option>
              <option value="HIRED">Hired</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-2">Assigned To</label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Team member name"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-2">Admin Notes</label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
              rows={4}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Internal notes..."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-accent text-bg rounded-lg hover:bg-accent-2 transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted mb-1">Full Name</p>
            <p className="font-semibold">{applicant.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Email</p>
            <p>{applicant.email}</p>
          </div>
          {applicant.phone && (
            <div>
              <p className="text-xs text-muted mb-1">Phone</p>
              <p>{applicant.phone}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted mb-1">Role Applied</p>
            <p>{applicant.roleApplied}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Seniority</p>
            <p>{applicant.seniority}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Status</p>
            <span
              className={`inline-block text-xs px-2 py-1 rounded ${
                applicant.status === 'NEW'
                  ? 'bg-blue-500/20 text-blue-300'
                  : applicant.status === 'SCREENING'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : applicant.status === 'INTERVIEW'
                      ? 'bg-purple-500/20 text-purple-300'
                      : applicant.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-green-500/20 text-green-300'
              }`}
            >
              {applicant.status}
            </span>
          </div>
          {applicant.assignedTo && (
            <div>
              <p className="text-xs text-muted mb-1">Assigned To</p>
              <p>{applicant.assignedTo}</p>
            </div>
          )}
          {applicant.adminNotes && (
            <div>
              <p className="text-xs text-muted mb-1">Admin Notes</p>
              <p className="text-sm whitespace-pre-wrap">{applicant.adminNotes}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted mb-1">Resume</p>
            <button
              onClick={() => onDownloadResume(applicant)}
              className="px-3 py-1.5 text-xs bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition"
            >
              Download Resume
            </button>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Applied</p>
            <p className="text-sm">{new Date(applicant.createdAt).toLocaleString()}</p>
          </div>
          {applicant.keywordScore !== null && (
            <div>
              <p className="text-xs text-muted mb-1">Keyword Score</p>
              <p className="text-sm">{(applicant.keywordScore * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

