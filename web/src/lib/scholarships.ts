export type ScholarshipStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Awarded';

export type ScholarshipSort = 'deadline' | 'amount' | 'eligibility';

export interface ScholarshipDocument {
  label: string;
  verified: boolean;
}

export interface ScholarshipRecord {
  id: string;
  student: string;
  program: string;
  scholarship: string;
  status: ScholarshipStatus;
  awardAmount: number;
  eligibilityScore: number;
  deadline: string;
  reviewer: string;
  documents: ScholarshipDocument[];
}

export interface ScholarshipFilters {
  query: string;
  status: 'All' | ScholarshipStatus;
  sort: ScholarshipSort;
}

export const scholarshipRecords: ScholarshipRecord[] = [
  {
    id: 'SSV-2026-1042',
    student: 'Mika Reyes',
    program: 'BS Computer Science',
    scholarship: 'Stellar Merit Grant',
    status: 'Awarded',
    awardAmount: 125000,
    eligibilityScore: 96,
    deadline: '2026-07-12',
    reviewer: 'A. Santos',
    documents: [
      { label: 'Transcript', verified: true },
      { label: 'Income certificate', verified: true },
      { label: 'Recommendation', verified: true },
    ],
  },
  {
    id: 'SSV-2026-1088',
    student: 'Lance Navarro',
    program: 'BS Accountancy',
    scholarship: 'Access Scholars Fund',
    status: 'Under Review',
    awardAmount: 84000,
    eligibilityScore: 88,
    deadline: '2026-06-28',
    reviewer: 'M. Delgado',
    documents: [
      { label: 'Transcript', verified: true },
      { label: 'Income certificate', verified: false },
      { label: 'Recommendation', verified: true },
    ],
  },
  {
    id: 'SSV-2026-1120',
    student: 'Trisha Dizon',
    program: 'BS Nursing',
    scholarship: 'Community Care Award',
    status: 'Approved',
    awardAmount: 102000,
    eligibilityScore: 92,
    deadline: '2026-07-03',
    reviewer: 'K. Lim',
    documents: [
      { label: 'Transcript', verified: true },
      { label: 'Income certificate', verified: true },
      { label: 'Recommendation', verified: false },
    ],
  },
  {
    id: 'SSV-2026-1156',
    student: 'Noel Garcia',
    program: 'BS Civil Engineering',
    scholarship: 'Future Builders Grant',
    status: 'Pending',
    awardAmount: 76000,
    eligibilityScore: 81,
    deadline: '2026-06-20',
    reviewer: 'Unassigned',
    documents: [
      { label: 'Transcript', verified: false },
      { label: 'Income certificate', verified: true },
      { label: 'Recommendation', verified: false },
    ],
  },
  {
    id: 'SSV-2026-1199',
    student: 'Bea Mercado',
    program: 'BA Communication',
    scholarship: 'Public Service Fellowship',
    status: 'Rejected',
    awardAmount: 0,
    eligibilityScore: 64,
    deadline: '2026-06-16',
    reviewer: 'J. Cruz',
    documents: [
      { label: 'Transcript', verified: true },
      { label: 'Income certificate', verified: false },
      { label: 'Recommendation', verified: false },
    ],
  },
];

export function getDocumentProgress(record: ScholarshipRecord): number {
  if (record.documents.length === 0) return 0;
  const verified = record.documents.filter((document) => document.verified).length;
  return Math.round((verified / record.documents.length) * 100);
}

export function getScholarshipSummary(records: ScholarshipRecord[]) {
  const active = records.filter((record) => record.status !== 'Rejected').length;
  const awardedAmount = records.reduce((total, record) => {
    if (record.status !== 'Awarded' && record.status !== 'Approved') return total;
    return total + record.awardAmount;
  }, 0);
  const reviewQueue = records.filter(
    (record) => record.status === 'Pending' || record.status === 'Under Review',
  ).length;
  const averageEligibility =
    records.length === 0
      ? 0
      : Math.round(
          records.reduce((total, record) => total + record.eligibilityScore, 0) /
            records.length,
        );

  return {
    active,
    awardedAmount,
    reviewQueue,
    averageEligibility,
  };
}

export function filterScholarships(
  records: ScholarshipRecord[],
  filters: ScholarshipFilters,
): ScholarshipRecord[] {
  const query = filters.query.trim().toLowerCase();

  return records
    .filter((record) => {
      const matchesStatus =
        filters.status === 'All' || record.status === filters.status;
      const matchesQuery =
        query.length === 0 ||
        [record.id, record.student, record.program, record.scholarship]
          .join(' ')
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesQuery;
    })
    .sort((a, b) => {
      if (filters.sort === 'amount') return b.awardAmount - a.awardAmount;
      if (filters.sort === 'eligibility') {
        return b.eligibilityScore - a.eligibilityScore;
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
}
