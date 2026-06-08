'use client';

import { useState } from 'react';
import { fundTestnetAccount } from '@/lib/stellar';

export default function FundAccount({
  publicKey,
  onFunded,
}: {
  publicKey: string;
  onFunded: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fund = async () => {
    setLoading(true);
    setError('');
    try {
      await fundTestnetAccount(publicKey);
      onFunded();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Funding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fund}
        disabled={loading}
        className="h-10 whitespace-nowrap rounded-md bg-[#D6A84F] px-4 text-sm font-semibold text-[#0F1411] transition hover:bg-[#E7BE66] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Funding...' : 'Fund with Friendbot'}
      </button>
      {error && <p className="mt-2 text-sm text-[#FCA5A5]">{error}</p>}
    </div>
  );
}
