'use client';

import { useMemo, useState } from 'react';
import {
  filterScholarships,
  getDocumentProgress,
  getScholarshipSummary,
  scholarshipRecords,
  type ScholarshipSort,
  type ScholarshipStatus,
} from '@/lib/scholarships';

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

const statusStyles: Record<ScholarshipStatus, string> = {
  Pending: 'border-[#D6A84F]/30 bg-[#D6A84F]/12 text-[#F4D48B]',
  'Under Review': 'border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#94F7B8]',
  Approved: 'border-[#22C55E]/35 bg-[#22C55E]/12 text-[#86EFAC]',
  Rejected: 'border-[#EF4444]/35 bg-[#EF4444]/12 text-[#FCA5A5]',
  Awarded: 'border-[#D6A84F]/50 bg-[#D6A84F]/18 text-[#FFE1A3]',
};

const statuses: Array<'All' | ScholarshipStatus> = [
  'All',
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Awarded',
];

const sortOptions: Array<{ label: string; value: ScholarshipSort }> = [
  { label: 'Deadline', value: 'deadline' },
  { label: 'Award amount', value: 'amount' },
  { label: 'Eligibility', value: 'eligibility' },
];

export default function ScholarshipVault() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | ScholarshipStatus>('All');
  const [sort, setSort] = useState<ScholarshipSort>('deadline');

  const records = useMemo(
    () => filterScholarships(scholarshipRecords, { query, status, sort }),
    [query, sort, status],
  );
  const summary = useMemo(
    () => getScholarshipSummary(scholarshipRecords),
    [],
  );

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile label="Active applications" value={summary.active.toString()} />
        <SummaryTile
          label="Award pipeline"
          value={currency.format(summary.awardedAmount)}
        />
        <SummaryTile label="Review queue" value={summary.reviewQueue.toString()} />
        <SummaryTile
          label="Avg eligibility"
          value={`${summary.averageEligibility}%`}
        />
      </div>

      <div className="rounded-lg border border-[#2F3A33] bg-[#161D18] p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D6A84F]">
              Scholarship ledger
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#F5F0E6]">
              Application Records
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px_160px] lg:min-w-[680px]">
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#A8B3A3]">
                Search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, program, ID"
                className="h-11 w-full rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 text-sm text-[#F5F0E6] outline-none transition focus:border-[#D6A84F] focus:ring-2 focus:ring-[#D6A84F]/20"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#A8B3A3]">
                Status
              </span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as 'All' | ScholarshipStatus)
                }
                className="h-11 w-full rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 text-sm text-[#F5F0E6] outline-none transition focus:border-[#D6A84F] focus:ring-2 focus:ring-[#D6A84F]/20"
              >
                {statuses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#A8B3A3]">
                Sort
              </span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as ScholarshipSort)}
                className="h-11 w-full rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 text-sm text-[#F5F0E6] outline-none transition focus:border-[#D6A84F] focus:ring-2 focus:ring-[#D6A84F]/20"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-[#2F3A33] bg-[#0F1411] p-8 text-center">
            <p className="text-base font-semibold text-[#F5F0E6]">
              No applications found
            </p>
            <p className="mt-2 text-sm text-[#A8B3A3]">
              Adjust the search term or status filter to widen the vault view.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 hidden overflow-hidden rounded-lg border border-[#2F3A33] lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0F1411] text-xs uppercase tracking-wide text-[#A8B3A3]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Applicant</th>
                    <th className="px-4 py-3 font-medium">Scholarship</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Award</th>
                    <th className="px-4 py-3 font-medium">Docs</th>
                    <th className="px-4 py-3 font-medium">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2F3A33] bg-[#161D18]">
                  {records.map((record) => (
                    <RecordRow key={record.id} recordId={record.id} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 lg:hidden">
              {records.map((record) => (
                <RecordCard key={record.id} recordId={record.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#2F3A33] bg-[#1E2821] p-5 shadow-xl shadow-black/15 transition duration-200 hover:-translate-y-0.5 hover:border-[#D6A84F]/50">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A8B3A3]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-[#F5F0E6]">{value}</p>
    </div>
  );
}

function RecordRow({ recordId }: { recordId: string }) {
  const record = scholarshipRecords.find((item) => item.id === recordId);
  if (!record) return null;
  const progress = getDocumentProgress(record);

  return (
    <tr className="transition hover:bg-[#1E2821]">
      <td className="px-4 py-4">
        <p className="font-semibold text-[#F5F0E6]">{record.student}</p>
        <p className="mt-1 text-xs text-[#A8B3A3]">{record.program}</p>
        <p className="mt-1 font-mono text-[11px] text-[#D6A84F]">{record.id}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-[#F5F0E6]">{record.scholarship}</p>
        <p className="mt-1 text-xs text-[#A8B3A3]">Reviewer: {record.reviewer}</p>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={record.status} />
      </td>
      <td className="px-4 py-4 font-semibold text-[#F5F0E6]">
        {currency.format(record.awardAmount)}
      </td>
      <td className="px-4 py-4">
        <Progress value={progress} />
      </td>
      <td className="px-4 py-4 text-[#A8B3A3]">{record.deadline}</td>
    </tr>
  );
}

function RecordCard({ recordId }: { recordId: string }) {
  const record = scholarshipRecords.find((item) => item.id === recordId);
  if (!record) return null;
  const progress = getDocumentProgress(record);

  return (
    <article className="rounded-lg border border-[#2F3A33] bg-[#1E2821] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[#F5F0E6]">{record.student}</p>
          <p className="mt-1 text-sm text-[#A8B3A3]">{record.program}</p>
        </div>
        <StatusBadge status={record.status} />
      </div>
      <p className="mt-4 text-sm text-[#F5F0E6]">{record.scholarship}</p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Metric label="Award" value={currency.format(record.awardAmount)} />
        <Metric label="Eligibility" value={`${record.eligibilityScore}%`} />
        <Metric label="Deadline" value={record.deadline} />
        <Metric label="Reviewer" value={record.reviewer} />
      </div>
      <div className="mt-4">
        <Progress value={progress} />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#A8B3A3]">{label}</p>
      <p className="mt-1 font-semibold text-[#F5F0E6]">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ScholarshipStatus }) {
  return (
    <span
      className={`inline-flex h-7 items-center whitespace-nowrap rounded-full border px-3 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs text-[#A8B3A3]">
        <span>Verification</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0F1411]">
        <div
          className="h-full rounded-full bg-[#4ADE80] transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
