# Stellar Scholarship Vault

Enterprise-style scholarship management for tracking applications, eligibility, documents, awards, and Stellar testnet treasury flows.

## Problem

Scholarship teams often manage applications, document checks, approvals, and award disbursements across spreadsheets, emails, and disconnected finance tools. That makes status tracking slow, audit trails fragile, and payment readiness hard to verify.

In the Philippines, this matters because scholarships and education grants are a practical path to mobility, but schools, foundations, LGUs, and student-support programs often need clearer workflows for reviewing applicants and preparing award releases. Stellar Scholarship Vault gives administrators a polished dashboard for scholarship operations while showing how fast, low-cost Stellar payments can support transparent education funding.

## How It Works

An administrator opens the vault dashboard and reviews scholarship application records. The dashboard shows active applications, award pipeline totals, review queue count, and average eligibility score.

From the application ledger, the administrator can search by applicant, program, scholarship, or record ID; filter by status; and sort by deadline, award amount, or eligibility. Each record displays applicant details, scholarship type, award amount, reviewer, status badge, deadline, and document verification progress.

When a Stellar wallet is connected through Freighter, the administrator can fund a testnet treasury account, add a USDC trustline, view XLM/USDC balances, and release a scholarship payment to a funded testnet destination account. If a Soroban contract is deployed, the award-pool panel reads the contract state and lets a connected wallet contribute to the on-chain funding goal.

## How It Uses Stellar

Stellar is used for the treasury and award-disbursement layer:

- Freighter wallet connection for administrator signing.
- Stellar testnet account funding through Friendbot.
- Classic Stellar payments for sending XLM or USDC testnet awards.
- USDC trustline creation for holding and sending a non-native asset.
- Horizon balance reads for XLM and USDC.
- Soroban contract reads and signed contract invocations for an on-chain award-pool funding goal.

Stellar fits this project because scholarship awards benefit from fast settlement, low transaction costs, transparent payment status, and support for both native XLM and issued assets such as USDC.

## Track

StellarX Philippines - Fullstack Payments with optional Soroban smart contract integration.

## Tech Stack

- Framework: Next.js 16.2.7, React 19.2.4, TypeScript
- Styling: Tailwind CSS 4
- Stellar SDK: `@stellar/stellar-sdk` v15.1.0
- Wallet: `@stellar/freighter-api` v6.0.1
- Network: Stellar testnet
- Contract: Rust Soroban contract in `contracts/savings-goal`
- Tests: Node.js built-in test runner

## Setup & Run

Prerequisites:

- Node.js 20+ and npm
- Freighter browser extension, unlocked and set to Test Net
- Optional for contract deployment: Rust, `wasm32v1-none`, and Stellar CLI

```bash
git clone [your-repo-url]
cd stellar-scholarship-vault/web
npm install

# Optional environment variables in web/.env.local:
# NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
# NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
# NEXT_PUBLIC_USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
# NEXT_PUBLIC_CONTRACT_ID=

npm run dev
```

Open `http://localhost:3000`.

Validation commands:

```bash
cd web
npm audit
npm run lint
npm run build
npm run test
```

Optional Soroban contract deployment from the repository root:

```bash
# Windows
.\scripts\deploy.ps1

# macOS/Linux
./scripts/deploy.sh
```

The deploy script builds the Rust contract, deploys it to testnet, initializes the funding goal, and writes `NEXT_PUBLIC_CONTRACT_ID` into `web/.env.local`. Restart `npm run dev` after deployment.

## Network Details

- Network: Stellar testnet
- Soroban RPC URL: `https://soroban-testnet.stellar.org`
- Horizon URL: `https://horizon-testnet.stellar.org`
- Contract IDs: Set by deployment script in `web/.env.local` as `NEXT_PUBLIC_CONTRACT_ID`
- USDC issuer: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`
- Native asset: XLM

## Team

- Add team member name - @github-username

## License

MIT
