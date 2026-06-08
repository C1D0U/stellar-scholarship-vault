'use client';

import { useEffect, useState } from 'react';
import {
  buildContributeXDR,
  contractConfigured,
  readSavingsState,
  type SavingsState,
} from '@/lib/contract';
import { pollTransaction, submitSignedXDR } from '@/lib/payment';
import { NETWORK_PASSPHRASE } from '@/lib/stellar';

export default function SavingsGoal({ publicKey }: { publicKey: string | null }) {
  const configured = contractConfigured();
  const [state, setState] = useState<SavingsState | null>(null);
  const [loading, setLoading] = useState(configured);
  const [refreshToken, setRefreshToken] = useState(0);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    if (!configured) return;
    setLoading(true);
    setError('');
    setRefreshToken((token) => token + 1);
  };

  useEffect(() => {
    if (!configured) return;

    let active = true;

    const loadState = async () => {
      try {
        const nextState = await readSavingsState();
        if (!active) return;
        setState(nextState);
      } catch (e: unknown) {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Failed to read contract');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadState();

    return () => {
      active = false;
    };
  }, [configured, refreshToken]);

  const contribute = async () => {
    if (!publicKey) return;
    setBusy(true);
    setMsg('');
    setError('');
    try {
      const xdr = await buildContributeXDR(publicKey, Number(amount));
      const freighter = await import('@stellar/freighter-api');
      const signed = await freighter.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: publicKey,
      });
      if (signed.error) {
        throw new Error(
          typeof signed.error === 'string' ? signed.error : 'Signing was rejected',
        );
      }
      const hash = await submitSignedXDR(signed.signedTxXdr);
      await pollTransaction(hash);
      setMsg('Award pool contribution recorded on-chain.');
      setAmount('');
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Contribution failed');
    } finally {
      setBusy(false);
    }
  };

  if (!configured) {
    return (
      <div className="rounded-lg border border-dashed border-[#2F3A33] bg-[#161D18] p-5 shadow-2xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D6A84F]">
          Soroban award pool
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#F5F0E6]">
          Contract Not Connected
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#A8B3A3]">
          Deploy the Rust contract and set its ID to enable on-chain award pool
          tracking.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md border border-[#2F3A33] bg-[#0F1411] p-3 text-xs text-[#F5F0E6]">
          .\scripts\deploy.ps1
        </pre>
        <p className="mt-3 text-xs leading-5 text-[#A8B3A3]">
          The script writes NEXT_PUBLIC_CONTRACT_ID into web/.env.local. Restart
          the dev server afterward.
        </p>
      </div>
    );
  }

  const pct =
    state && state.target > 0
      ? Math.min(100, Math.round((state.saved / state.target) * 100))
      : 0;

  return (
    <div className="rounded-lg border border-[#2F3A33] bg-[#161D18] p-5 shadow-2xl shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D6A84F]">
        Soroban award pool
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[#F5F0E6]">
        On-chain Funding Goal
      </h2>

      {loading && (
        <p className="mt-5 text-sm text-[#A8B3A3]">Reading contract state...</p>
      )}

      {!loading && state && (
        <>
          <div className="mt-5 flex justify-between gap-4 text-sm text-[#A8B3A3]">
            <span>Saved: {state.saved}</span>
            <span>Target: {state.target}</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#0F1411]">
            <div
              className="h-full rounded-full bg-[#4ADE80] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs text-[#A8B3A3]">{pct}% funded</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px] xl:grid-cols-1">
            <input
              type="number"
              placeholder="Contribution amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-11 w-full rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 text-sm text-[#F5F0E6] outline-none transition placeholder:text-[#A8B3A3]/60 focus:border-[#D6A84F] focus:ring-2 focus:ring-[#D6A84F]/20"
            />
            <button
              onClick={contribute}
              disabled={busy || !publicKey || !amount}
              className="h-11 whitespace-nowrap rounded-md bg-[#D6A84F] px-4 text-sm font-semibold text-[#0F1411] transition hover:bg-[#E7BE66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Working...' : 'Contribute'}
            </button>
          </div>
          {!publicKey && (
            <p className="mt-3 text-xs leading-5 text-[#A8B3A3]">
              Connect a wallet to sign Soroban contributions.
            </p>
          )}
        </>
      )}

      {msg && (
        <p className="mt-4 rounded-lg border border-[#22C55E]/35 bg-[#22C55E]/10 p-3 text-sm text-[#86EFAC]">
          {msg}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-[#EF4444]/35 bg-[#EF4444]/10 p-3 text-sm text-[#FCA5A5]">
          {error}
        </p>
      )}
    </div>
  );
}
