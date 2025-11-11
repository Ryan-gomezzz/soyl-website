'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';

type Applicant = {
  id: string;
  fullName: string;
  email: string;
  roleApplied: string;
  status: string;
  resumeUrl: string;
  linkedin: string;
  source?: string | null;
  keywordScore?: number | null;
  createdAt: string;
};

type ApplicantsResponse = {
  items: Applicant[];
  total: number;
  page: number;
  pageSize: number;
};

const adminToken = process.env.NEXT_PUBLIC_ADMIN_HINT ?? '';

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'x-admin-token': adminToken
    }
  });

  if (!response.ok) {
    throw new Error('Failed to load applicants.');
  }

  return (await response.json()) as ApplicantsResponse;
};

export default function ApplicantsAdminPage() {
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);
    return params.toString();
  }, [roleFilter, statusFilter]);

  const { data, mutate, error, isLoading } = useSWR<ApplicantsResponse>(
    `/api/admin${query ? `?${query}` : ''}`,
    fetcher
  );

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({ status })
    });
    mutate();
  };

  const previewResume = async (s3Path: string) => {
    const response = await fetch('/api/admin/sign-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({ s3Path })
    });

    if (!response.ok) {
      return;
    }

    const { signedUrl } = (await response.json()) as { signedUrl: string };
    window.open(signedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <header className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">SOYL Applicants</h1>
        <p className="mt-2 text-slate-400">Secure admin view for reviewing and triaging inbound candidates.</p>
      </header>

      <section className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-4">
        <input
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          placeholder="Filter by role"
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
        />
        <input
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          placeholder="Filter by status"
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
        />
      </section>

      <section className="mx-auto mt-6 max-w-6xl">
        {isLoading ? <p>Loading applicants…</p> : null}
        {error ? <p className="text-rose-200">Failed to load applicants.</p> : null}
        {data ? (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/70 uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Applicant</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Resume</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.items.map((applicant) => (
                  <tr key={applicant.id} className="bg-slate-900/40">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{applicant.fullName}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(applicant.createdAt).toLocaleString()} — {applicant.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">{applicant.roleApplied}</td>
                    <td className="px-4 py-3">{applicant.status}</td>
                    <td className="px-4 py-3">{(applicant.keywordScore ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => previewResume(applicant.resumeUrl)}
                        className="rounded-md border border-sky-500 px-3 py-1 text-xs font-medium text-sky-300 transition hover:bg-sky-500/10"
                      >
                        View resume
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {['SCREENING', 'INTERVIEW', 'REJECTED', 'HIRED'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateStatus(applicant.id, status)}
                            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-sky-400 hover:text-sky-300"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="flex items-center justify-between border-t border-slate-800 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">
              <span>Total applicants: {data.total}</span>
              <span>
                Page {data.page} of {Math.ceil(data.total / data.pageSize) || 1}
              </span>
            </footer>
          </div>
        ) : null}
      </section>
    </main>
  );
}

