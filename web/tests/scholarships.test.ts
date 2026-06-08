import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  filterScholarships,
  getDocumentProgress,
  getScholarshipSummary,
  scholarshipRecords,
} from '../src/lib/scholarships.ts';

describe('scholarship helpers', () => {
  it('summarizes active records, review queue, awards, and eligibility', () => {
    const summary = getScholarshipSummary(scholarshipRecords);

    assert.equal(summary.active, 4);
    assert.equal(summary.reviewQueue, 2);
    assert.equal(summary.awardedAmount, 227000);
    assert.equal(summary.averageEligibility, 84);
  });

  it('calculates document verification progress', () => {
    const record = scholarshipRecords.find((item) => item.id === 'SSV-2026-1088');

    assert.ok(record);
    assert.equal(getDocumentProgress(record), 67);
  });

  it('filters by query and status', () => {
    const records = filterScholarships(scholarshipRecords, {
      query: 'nursing',
      status: 'Approved',
      sort: 'deadline',
    });

    assert.deepEqual(
      records.map((record) => record.student),
      ['Trisha Dizon'],
    );
  });

  it('sorts by award amount descending', () => {
    const records = filterScholarships(scholarshipRecords, {
      query: '',
      status: 'All',
      sort: 'amount',
    });

    assert.equal(records[0].awardAmount, 125000);
    assert.equal(records.at(-1)?.awardAmount, 0);
  });
});
