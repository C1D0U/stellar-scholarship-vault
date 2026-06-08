'use client';

import { useState } from 'react';
import { signAndSubmit } from '@/lib/sign';
import { buildAddUsdcTrustlineXDR } from '@/lib/trustline';

type Status = 'idle' | 'working' | 'done' | 'error';

export default function AddTrustline({
  publicKey,
  onDone,
}: {
  publicKey: string;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const add = async () => {
    setStatus('working');
    setError('');
    try {
      const xdr = await buildAddUsdcTrustlineXDR(publicKey);
      await signAndSubmit(xdr, publicKey);
      setStatus('done');
      onDone();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add trustline');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="flex h-10 items-center rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 text-sm font-semibold text-[#86EFAC]">
        USDC trustline added.
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={add}
        disabled={status === 'working'}
        className="h-10 whitespace-nowrap rounded-md border border-[#2F3A33] bg-[#0F1411] px-4 text-sm font-semibold text-[#F5F0E6] transition hover:border-[#D6A84F] hover:text-[#D6A84F] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'working' ? 'Adding trustline...' : 'Add USDC trustline'}
      </button>
      {error && <p className="mt-2 text-sm text-[#FCA5A5]">{error}</p>}
    </div>
  );
}
