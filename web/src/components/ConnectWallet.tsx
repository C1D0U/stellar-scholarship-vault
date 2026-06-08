'use client';

import { useState } from 'react';
import type { WalletState } from '@/hooks/useWallet';

export default function ConnectWallet({
  publicKey,
  connecting,
  error,
  connect,
  disconnect,
}: WalletState) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (publicKey) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={copy}
          title="Copy full address"
          className="h-10 rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 font-mono text-sm text-[#F5F0E6] transition hover:border-[#D6A84F]"
        >
          {copied ? 'Copied!' : `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}`}
        </button>
        <button
          onClick={disconnect}
          className="h-10 whitespace-nowrap rounded-md border border-[#EF4444]/35 px-4 text-sm font-semibold text-[#FCA5A5] transition hover:bg-[#EF4444]/10"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="text-left lg:text-right">
      <button
        onClick={connect}
        disabled={connecting}
        className="h-11 whitespace-nowrap rounded-md bg-[#D6A84F] px-5 text-sm font-semibold text-[#0F1411] shadow-lg shadow-[#D6A84F]/10 transition hover:bg-[#E7BE66] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {connecting ? 'Connecting...' : 'Connect Freighter'}
      </button>
      {error && <p className="mt-2 max-w-xs text-sm text-[#FCA5A5]">{error}</p>}
    </div>
  );
}
