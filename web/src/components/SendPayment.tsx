'use client';

import { useState } from 'react';
import { NETWORK_PASSPHRASE } from '@/lib/stellar';
import {
  buildPaymentXDR,
  pollTransaction,
  submitSignedXDR,
  type AssetCode,
} from '@/lib/payment';

type Status =
  | 'idle'
  | 'building'
  | 'signing'
  | 'submitting'
  | 'polling'
  | 'success'
  | 'error';

const STATUS_LABEL: Record<Status, string> = {
  idle: 'Release award payment',
  building: 'Building transaction...',
  signing: 'Waiting for Freighter...',
  submitting: 'Submitting...',
  polling: 'Confirming on-chain...',
  success: 'Release award payment',
  error: 'Release award payment',
};

export default function SendPayment({
  publicKey,
  onSent,
}: {
  publicKey: string;
  onSent: () => void;
}) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState<AssetCode>('XLM');
  const [status, setStatus] = useState<Status>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const busy = ['building', 'signing', 'submitting', 'polling'].includes(status);

  const handleSend = async () => {
    setStatus('building');
    setErrorMsg('');
    setTxHash('');
    try {
      const xdr = await buildPaymentXDR(publicKey, destination.trim(), amount, asset);

      setStatus('signing');
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

      setStatus('submitting');
      const hash = await submitSignedXDR(signed.signedTxXdr);
      setTxHash(hash);

      setStatus('polling');
      await pollTransaction(hash);
      setStatus('success');
      onSent();
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Payment failed');
      setStatus('error');
    }
  };

  return (
    <div className="rounded-lg border border-[#2F3A33] bg-[#161D18] p-5 shadow-2xl shadow-black/20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D6A84F]">
          Award disbursement
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#F5F0E6]">
          Send Scholarship Payment
        </h2>
      </div>

      <div className="mt-5 grid gap-4">
        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#A8B3A3]">
            Asset
          </span>
          <select
            value={asset}
            onChange={(event) => setAsset(event.target.value as AssetCode)}
            className="h-11 w-full rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 text-sm text-[#F5F0E6] outline-none transition focus:border-[#D6A84F] focus:ring-2 focus:ring-[#D6A84F]/20"
          >
            <option value="XLM">XLM</option>
            <option value="USDC">USDC (requires trustline)</option>
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#A8B3A3]">
            Destination address
          </span>
          <input
            type="text"
            placeholder="Funded testnet account address"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className="h-11 w-full rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 font-mono text-sm text-[#F5F0E6] outline-none transition placeholder:text-[#A8B3A3]/60 focus:border-[#D6A84F] focus:ring-2 focus:ring-[#D6A84F]/20"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#A8B3A3]">
            Amount
          </span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="h-11 w-full rounded-md border border-[#2F3A33] bg-[#0F1411] px-3 text-sm text-[#F5F0E6] outline-none transition placeholder:text-[#A8B3A3]/60 focus:border-[#D6A84F] focus:ring-2 focus:ring-[#D6A84F]/20"
          />
        </label>

        <button
          onClick={handleSend}
          disabled={busy || !destination || !amount}
          className="h-11 w-full whitespace-nowrap rounded-md bg-[#D6A84F] px-5 text-sm font-semibold text-[#0F1411] transition hover:bg-[#E7BE66] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {STATUS_LABEL[status]}
        </button>
      </div>

      {status === 'success' && (
        <div className="mt-4 rounded-lg border border-[#22C55E]/35 bg-[#22C55E]/10 p-3">
          <p className="font-semibold text-[#86EFAC]">Payment confirmed.</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm text-[#D6A84F] hover:underline"
          >
            View on Stellar Expert
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 rounded-lg border border-[#EF4444]/35 bg-[#EF4444]/10 p-3">
          <p className="text-sm text-[#FCA5A5]">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
