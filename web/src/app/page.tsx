'use client';

import { useCallback, useState } from 'react';
import AddTrustline from '@/components/AddTrustline';
import BalanceCard from '@/components/BalanceCard';
import ConnectWallet from '@/components/ConnectWallet';
import FundAccount from '@/components/FundAccount';
import SavingsGoal from '@/components/SavingsGoal';
import ScholarshipVault from '@/components/ScholarshipVault';
import SendPayment from '@/components/SendPayment';
import { useWallet } from '@/hooks/useWallet';

export default function Home() {
  const wallet = useWallet();
  const { publicKey, connecting } = wallet;
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  return (
    <main className="min-h-screen w-full bg-[#0F1411] text-[#F5F0E6]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-[#2F3A33] bg-[#161D18] p-5 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D6A84F]">
                Enterprise scholarship management
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-[#F5F0E6] sm:text-4xl">
                Stellar Scholarship Vault
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#A8B3A3]">
                Track applications, eligibility, document verification, awards,
                and Stellar testnet treasury actions from one polished vault.
              </p>
            </div>
            <ConnectWallet {...wallet} />
          </div>
        </header>

        <ScholarshipVault />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <div className="rounded-lg border border-[#2F3A33] bg-[#161D18] p-5 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D6A84F]">
                    Treasury controls
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#F5F0E6]">
                    Testnet Wallet Operations
                  </h2>
                </div>
                {publicKey && (
                  <button
                    onClick={refresh}
                    className="h-10 whitespace-nowrap rounded-md border border-[#2F3A33] px-4 text-sm font-semibold text-[#F5F0E6] transition hover:border-[#D6A84F] hover:text-[#D6A84F]"
                  >
                    Refresh balances
                  </button>
                )}
              </div>

              {!publicKey && !connecting && (
                <div className="mt-5 rounded-lg border border-dashed border-[#2F3A33] bg-[#0F1411] p-8 text-center">
                  <p className="font-semibold text-[#F5F0E6]">
                    Connect Freighter to activate treasury actions.
                  </p>
                  <p className="mt-2 text-sm text-[#A8B3A3]">
                    Install Freighter from{' '}
                    <a
                      href="https://freighter.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#D6A84F] hover:underline"
                    >
                      freighter.app
                    </a>{' '}
                    and switch it to Test Net.
                  </p>
                </div>
              )}

              {publicKey && (
                <>
                  <div className="mt-5 flex flex-wrap items-start gap-3">
                    <FundAccount publicKey={publicKey} onFunded={refresh} />
                    <AddTrustline publicKey={publicKey} onDone={refresh} />
                  </div>
                  <BalanceCard publicKey={publicKey} refreshKey={refreshKey} />
                </>
              )}
            </div>

            {publicKey && <SendPayment publicKey={publicKey} onSent={refresh} />}
          </div>

          <SavingsGoal publicKey={publicKey} />
        </section>

        <footer className="pb-4 text-center text-xs text-[#A8B3A3]">
          Built on the StellarX Workshop scaffold for a production-style
          scholarship vault.
        </footer>
      </div>
    </main>
  );
}
