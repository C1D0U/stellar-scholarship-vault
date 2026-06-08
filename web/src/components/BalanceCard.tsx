'use client';

import { useEffect, useState } from 'react';
import { fetchBalances, type Balances } from '@/lib/balances';

export default function BalanceCard({
  publicKey,
  refreshKey,
}: {
  publicKey: string;
  refreshKey: number;
}) {
  const requestKey = `${publicKey}:${refreshKey}`;
  const [result, setResult] = useState<{
    requestKey: string;
    balances: Balances | null;
    failed: boolean;
  }>({
    requestKey: '',
    balances: null,
    failed: false,
  });
  const loading = result.requestKey !== requestKey;

  useEffect(() => {
    let active = true;

    fetchBalances(publicKey)
      .then((balances) => {
        if (!active) return;
        setResult({ requestKey, balances, failed: false });
      })
      .catch(() => {
        if (!active) return;
        setResult({ requestKey, balances: null, failed: true });
      });

    return () => {
      active = false;
    };
  }, [publicKey, requestKey]);

  if (loading) {
    return (
      <div className="mt-5 grid animate-pulse gap-4 sm:grid-cols-2">
        <div className="h-24 rounded-lg bg-[#1E2821]" />
        <div className="h-24 rounded-lg bg-[#1E2821]" />
      </div>
    );
  }

  if (result.failed) {
    return (
      <p className="mt-5 rounded-lg border border-[#EF4444]/35 bg-[#EF4444]/10 p-3 text-sm text-[#FCA5A5]">
        Failed to load balances.
      </p>
    );
  }

  const balances = result.balances;

  if (balances && !balances.funded) {
    return (
      <p className="mt-5 rounded-lg border border-[#D6A84F]/35 bg-[#D6A84F]/10 p-3 text-sm text-[#F4D48B]">
        This account is not funded yet. Use Friendbot to activate it on testnet.
      </p>
    );
  }

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <BalanceTile label="XLM" value={balances?.xlm ?? '0.00'} />
      <BalanceTile label="USDC" value={balances?.usdc ?? '0.00'} />
    </div>
  );
}

function BalanceTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#2F3A33] bg-[#1E2821] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A8B3A3]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-[#F5F0E6]">{value}</p>
    </div>
  );
}
