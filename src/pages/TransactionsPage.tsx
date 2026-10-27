import { useState, useEffect, useCallback, useRef } from 'react';
import AppShell from '../components/AppShell';
import { useWallet, wallets } from '../contexts/WalletContext';
import type { Wallet } from '../types';
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  SearchIcon,
  XIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CheckIcon,
  PlusIcon,
  ChevronRightIcon,
} from '../components/Icons';

// ─── Types ────────────────────────────────────────────────────────────────────

type TxnType = 'ALL' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'SWAP' | 'BILL_PAYMENT' | 'AIRTIME' | 'EXCHANGE' | 'INVESTMENT' | 'SAVINGS' | 'FEE' | 'REFUND';
type TxnStatus = 'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED';
type WalletCode = 'NGN' | 'USD' | 'GBP' | 'EUR';

interface Transaction {
  id: string;
  reference: string;
  type: TxnType;
  description: string;
  amount: number;
  currency: WalletCode;
  symbol: string;
  date: string;         // ISO
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  isCredit: boolean;
  balance: number;
  counterparty: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────


const ALL_TRANSACTIONS: Transaction[] = [
  { id: 'tx001', reference: 'REF20240701A', type: 'DEPOSIT',      description: 'Bank Transfer Deposit',          amount: 500_000, currency: 'NGN', symbol: '₦', date: '2024-07-01T08:14:00Z', status: 'COMPLETED', isCredit: true,  balance: 1_280_500, counterparty: 'Zenith Bank' },
  { id: 'tx002', reference: 'REF20240701B', type: 'TRANSFER',     description: 'Transfer to John Adewale',       amount: 25_000,  currency: 'NGN', symbol: '₦', date: '2024-07-01T11:30:00Z', status: 'COMPLETED', isCredit: false, balance: 1_255_500, counterparty: 'John Adewale' },
  { id: 'tx003', reference: 'REF20240702A', type: 'BILL_PAYMENT', description: 'DSTV Subscription',             amount: 6_500,   currency: 'NGN', symbol: '₦', date: '2024-07-02T09:05:00Z', status: 'COMPLETED', isCredit: false, balance: 1_249_000, counterparty: 'DSTV' },
  { id: 'tx004', reference: 'REF20240702B', type: 'AIRTIME',      description: 'MTN Airtime Purchase',           amount: 2_000,   currency: 'NGN', symbol: '₦', date: '2024-07-02T14:22:00Z', status: 'COMPLETED', isCredit: false, balance: 1_247_000, counterparty: 'MTN Nigeria' },
  { id: 'tx005', reference: 'REF20240703A', type: 'WITHDRAWAL',   description: 'ATM Withdrawal',                amount: 20_000,  currency: 'NGN', symbol: '₦', date: '2024-07-03T17:48:00Z', status: 'COMPLETED', isCredit: false, balance: 1_227_000, counterparty: 'GTBank ATM' },
  { id: 'tx006', reference: 'REF20240704A', type: 'DEPOSIT',      description: 'Salary Credit',                 amount: 350_000, currency: 'NGN', symbol: '₦', date: '2024-07-04T07:00:00Z', status: 'COMPLETED', isCredit: true,  balance: 1_577_000, counterparty: 'Acme Corp.' },
  { id: 'tx007', reference: 'REF20240705A', type: 'SWAP',         description: 'Currency Swap NGN → USD',       amount: 160_000, currency: 'NGN', symbol: '₦', date: '2024-07-05T10:15:00Z', status: 'COMPLETED', isCredit: false, balance: 1_417_000, counterparty: 'Exchange' },
  { id: 'tx008', reference: 'REF20240705B', type: 'DEPOSIT',      description: 'USD Swap Credit',               amount: 100,     currency: 'USD', symbol: '$', date: '2024-07-05T10:16:00Z', status: 'COMPLETED', isCredit: true,  balance: 2_450,     counterparty: 'Exchange' },
  { id: 'tx009', reference: 'REF20240706A', type: 'TRANSFER',     description: 'Transfer to Ada Okafor',        amount: 500,     currency: 'USD', symbol: '$', date: '2024-07-06T13:00:00Z', status: 'PENDING',   isCredit: false, balance: 1_950,     counterparty: 'Ada Okafor' },
  { id: 'tx010', reference: 'REF20240707A', type: 'BILL_PAYMENT', description: 'Electricity – EKEDC',           amount: 15_000,  currency: 'NGN', symbol: '₦', date: '2024-07-07T08:55:00Z', status: 'COMPLETED', isCredit: false, balance: 1_402_000, counterparty: 'EKEDC' },
  { id: 'tx011', reference: 'REF20240708A', type: 'DEPOSIT',      description: 'GBP Freelance Payment',         amount: 200,     currency: 'GBP', symbol: '£', date: '2024-07-08T16:40:00Z', status: 'COMPLETED', isCredit: true,  balance: 320,       counterparty: 'Upwork' },
  { id: 'tx012', reference: 'REF20240709A', type: 'TRANSFER',     description: 'Transfer – Wema Bank',          amount: 50_000,  currency: 'NGN', symbol: '₦', date: '2024-07-09T09:20:00Z', status: 'FAILED',    isCredit: false, balance: 1_402_000, counterparty: 'Wema Bank' },
  { id: 'tx013', reference: 'REF20240710A', type: 'AIRTIME',      description: 'Glo Airtime',                   amount: 1_000,   currency: 'NGN', symbol: '₦', date: '2024-07-10T11:10:00Z', status: 'COMPLETED', isCredit: false, balance: 1_401_000, counterparty: 'Glo' },
  { id: 'tx014', reference: 'REF20240711A', type: 'WITHDRAWAL',   description: 'Kuda Transfer Out',             amount: 75_000,  currency: 'NGN', symbol: '₦', date: '2024-07-11T14:00:00Z', status: 'COMPLETED', isCredit: false, balance: 1_326_000, counterparty: 'Kuda' },
  { id: 'tx015', reference: 'REF20240712A', type: 'SWAP',         description: 'Swap USD → EUR',                amount: 200,     currency: 'USD', symbol: '$', date: '2024-07-12T10:00:00Z', status: 'COMPLETED', isCredit: false, balance: 2_250,     counterparty: 'Exchange' },
  { id: 'tx016', reference: 'REF20240712B', type: 'DEPOSIT',      description: 'EUR Swap Credit',               amount: 183.5,   currency: 'EUR', symbol: '€', date: '2024-07-12T10:01:00Z', status: 'COMPLETED', isCredit: true,  balance: 410,       counterparty: 'Exchange' },
  { id: 'tx017', reference: 'REF20240713A', type: 'BILL_PAYMENT', description: 'Netflix Subscription',          amount: 4_800,   currency: 'NGN', symbol: '₦', date: '2024-07-13T12:00:00Z', status: 'PENDING',   isCredit: false, balance: 1_326_000, counterparty: 'Netflix' },
  { id: 'tx018', reference: 'REF20240714A', type: 'DEPOSIT',      description: 'Received – Emmanuel Tunde',    amount: 10_000,  currency: 'NGN', symbol: '₦', date: '2024-07-14T09:00:00Z', status: 'COMPLETED', isCredit: true,  balance: 1_336_000, counterparty: 'Emmanuel Tunde' },
];

const ITEMS_PER_PAGE = 8;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtAmount(symbol: string, amount: number) {
  return `${symbol}${amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function groupByDate(txns: Transaction[]): { label: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const t of txns) {
    const label = fmtDate(t.date);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(t);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

function typeLabel(type: TxnType) {
  const map: Record<TxnType, string> = {
    ALL: 'All Types', DEPOSIT: 'Deposit', WITHDRAWAL: 'Withdrawal',
    TRANSFER: 'Transfer', SWAP: 'Swap', BILL_PAYMENT: 'Bill Payment',
    AIRTIME: 'Airtime', EXCHANGE: 'Exchange', INVESTMENT: 'Investment',
    SAVINGS: 'Savings', FEE: 'Fee', REFUND: 'Refund',
  };
  return map[type];
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function DetailDrawer({ txn, onClose }: { txn: Transaction; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(txn.reference).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="hist-detail-drawer hist-detail-drawer--open" aria-label="Transaction details">
        <div className="hist-detail__header">
          <h2 className="hist-detail__title">Transaction Details</h2>
          <button className="hist-detail__close" type="button" onClick={onClose} aria-label="Close">
            <XIcon size={18} color="#555" />
          </button>
        </div>

        {/* Amount hero */}
        <div className={`hist-detail__hero ${txn.isCredit ? 'hist-detail__hero--credit' : 'hist-detail__hero--debit'}`}>
          <div className="hist-detail__hero-icon">
            {txn.isCredit
              ? <ArrowDownLeftIcon size={28} color="#16a34a" />
              : <ArrowUpRightIcon  size={28} color="#e5403a" />}
          </div>
          <p className="hist-detail__hero-amount">
            {txn.isCredit ? '+' : '-'}{fmtAmount(txn.symbol, txn.amount)}
          </p>
          <p className="hist-detail__hero-desc">{txn.description}</p>
          <span className={`hist-status hist-status--${txn.status.toLowerCase()}`}>{txn.status}</span>
        </div>

        {/* Rows */}
        <div className="hist-detail__body">
          {[
            { label: 'Date',         value: `${fmtDate(txn.date)} ${fmtTime(txn.date)}` },
            { label: 'Type',         value: typeLabel(txn.type) },
            { label: 'Currency',     value: txn.currency },
            { label: 'Counterparty', value: txn.counterparty },
            { label: 'Balance After',value: fmtAmount(txn.symbol, txn.balance) },
          ].map(({ label, value }) => (
            <div className="hist-detail__row" key={label}>
              <span className="hist-detail__row-label">{label}</span>
              <span className="hist-detail__row-value">{value}</span>
            </div>
          ))}

          {/* Reference with copy */}
          <div className="hist-detail__row">
            <span className="hist-detail__row-label">Reference</span>
            <div className="hist-detail__ref-wrap">
              <span className="hist-detail__row-value">{txn.reference}</span>
              <button
                className={`hist-detail__copy${copied ? ' hist-detail__copy--copied' : ''}`}
                type="button"
                onClick={handleCopy}
                aria-label="Copy reference"
              >
                {copied ? <CheckCircleIcon size={14} color="#15803d" /> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Filter sheet (bottom drawer on mobile) ───────────────────────────────────

interface FilterState {
  wallet:    WalletCode | 'ALL';
  type:      TxnType;
  status:    TxnStatus;
  startDate: string;
  endDate:   string;
  search:    string;
  period:    string;
}

const DEFAULT_FILTERS: FilterState = {
  wallet: 'ALL', type: 'ALL', status: 'ALL', startDate: '', endDate: '', search: '', period: 'Last 30 Days',
};

function periodToDates(p: string) {
  const end = new Date(), start = new Date();
  if      (p === 'Today')         { /* same day */ }
  else if (p === 'Last 7 Days')   { start.setDate(start.getDate() - 7); }
  else if (p === 'Last 30 Days')  { start.setDate(start.getDate() - 30); }
  else if (p === 'Last 3 Months') { start.setMonth(start.getMonth() - 3); }
  return { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
}

function FilterSheet({
  filters, onApply, onClose,
}: {
  filters: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<FilterState>(filters);

  function set<K extends keyof FilterState>(k: K, v: FilterState[K]) {
    setLocal((p) => ({ ...p, [k]: v }));
  }

  const txnTypes: TxnType[] = ['ALL','DEPOSIT','WITHDRAWAL','TRANSFER','SWAP','BILL_PAYMENT','AIRTIME','EXCHANGE','INVESTMENT','SAVINGS','FEE','REFUND'];
  const [typeSearch, setTypeSearch] = useState('');
  const filteredTypes = txnTypes.filter((t) =>
    typeLabel(t).toLowerCase().includes(typeSearch.toLowerCase())
  );

  return (
    <div className="hist-filter-modal" role="dialog" aria-modal="true" aria-label="Filter transactions">
      <div className="hist-filter-modal__top">
        <div className="hist-filter-modal__header">
          <span className="hist-filter-modal__title">Transaction type</span>
          <span className="hist-filter-modal__tag">FILTER</span>
        </div>
        <p className="hist-filter-modal__sub">Search by transaction type, useful for tracking one specific payment</p>
        <div className="hist-filter__search-wrap">
          <input
            className="hist-filter__search"
            type="text"
            placeholder="Search amount, narration"
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
          />
          <SearchIcon size={16} color="#aaa" />
        </div>
      </div>

      <div className="hist-filter-modal__body">
        <div className="hist-filter__radio-list">
          {filteredTypes.length === 0 && (
            <p className="hist-filter__no-result">No match</p>
          )}
          {filteredTypes.map((t) => (
            <label className="hist-filter__radio-row" key={t}>
              <span className={`hist-filter__radio${local.type === t ? ' hist-filter__radio--active' : ''}`} />
              <input type="radio" name="txnType" value={t} checked={local.type === t}
                onChange={() => set('type', t)} className="hist-filter__radio-input" />
              {typeLabel(t)}
            </label>
          ))}
        </div>

        <div className="hist-filter__date-section">
          <p className="hist-filter-modal__title">Date</p>
          <p className="hist-filter-modal__sub">See only transactions within a specific timeframe. Choose custom to pick exact dates</p>
          <div className="hist-filter__date-stack">
            <div className="hist-filter__date-group">
              <label className="hist-filter__date-label">Start Date</label>
              <input className="hist-filter__date-input" type="date" value={local.startDate}
                onChange={(e) => set('startDate', e.target.value)} />
            </div>
            <div className="hist-filter__date-group">
              <label className="hist-filter__date-label">End Date</label>
              <input className="hist-filter__date-input" type="date" value={local.endDate}
                onChange={(e) => set('endDate', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="hist-filter-modal__footer">
        <button className="hist-filter__reset" type="button" onClick={() => { setLocal(DEFAULT_FILTERS); onApply(DEFAULT_FILTERS); onClose(); }}>Clear All</button>
        <button className="hist-filter__apply" type="button" onClick={() => { onApply({ ...local, period: 'Custom' }); onClose(); }}>Apply Filters</button>
      </div>
    </div>
  );
}

// ─── Statement Modal ──────────────────────────────────────────────────────────

function StatementModal({
  filters,
  results,
  currency,
  onClose,
}: {
  filters: FilterState;
  results: Transaction[];
  currency: string;
  onClose: () => void;
}) {
  const [email,       setEmail]       = useState('');
  const [format,      setFormat]      = useState<'PDF' | 'CSV' | 'EXCEL'>('PDF');
  const [emailError,  setEmailError]  = useState('');
  const [sending,     setSending]     = useState(false);
  const [sent,        setSent]        = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');

    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (results.length === 0) {
      setEmailError('No transactions to include. Apply filters first.');
      return;
    }

    setSending(true);

    // Build payload matching the reference SendStatementPayload structure
    const statements = results.map((txn) => ({
      id:           txn.id,
      date:         txn.date,
      description:  txn.description,
      type:         txn.type,
      currencyType: txn.currency,
      netAmount:    txn.isCredit ? txn.amount : -txn.amount,
      balance:      txn.balance,
      reference:    txn.reference,
    }));

    const payload = {
      email:            email.trim(),
      format,
      currency,
      startDate:        filters.startDate || null,
      endDate:          filters.endDate   || null,
      transactionType:  filters.type !== 'ALL' ? filters.type : 'ALL',
      status:           filters.status !== 'ALL' ? filters.status : 'ALL',
      totalTransactions: results.length,
      requestedAt:      new Date().toISOString(),
      statements,
    };

    // Simulate network delay then log
    setTimeout(() => {
      console.log('=== Account Statement Payload ===');
      console.log(JSON.stringify(payload, null, 2));
      setSending(false);
      setSent(true);
    }, 1200);
  }

  return (
    <div className="stmt-overlay" onClick={onClose}>
      <div className="stmt-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Request Statement">

        {/* Header */}
        <div className="stmt-modal__header">
          <div className="stmt-modal__header-left">
            <div className="stmt-modal__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="9" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 className="stmt-modal__title">Request Account Statement</h2>
              <p className="stmt-modal__subtitle">
                {results.length} transaction{results.length !== 1 ? 's' : ''} · {currency} Wallet
                {filters.startDate && filters.endDate
                  ? ` · ${filters.startDate} → ${filters.endDate}`
                  : ` · ${filters.period || 'All time'}`}
              </p>
            </div>
          </div>
          <button className="stmt-modal__close" type="button" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Success state */}
        {sent ? (
          <div className="stmt-modal__success">
            <div className="stmt-modal__success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Statement Requested!</h3>
            <p>Your account statement has been sent to <strong>{email}</strong>. Check your inbox shortly.</p>
            <button className="stmt-modal__done-btn" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="stmt-modal__form" onSubmit={handleSend} noValidate>

            {/* Filter summary */}
            <div className="stmt-modal__summary">
              <div className="stmt-modal__summary-row">
                <span>Transactions</span>
                <strong>{results.length}</strong>
              </div>
              <div className="stmt-modal__summary-row">
                <span>Currency</span>
                <strong>{currency}</strong>
              </div>
              <div className="stmt-modal__summary-row">
                <span>Period</span>
                <strong>
                  {filters.startDate && filters.endDate
                    ? `${filters.startDate} → ${filters.endDate}`
                    : filters.period || 'All time'}
                </strong>
              </div>
              {filters.type !== 'ALL' && (
                <div className="stmt-modal__summary-row">
                  <span>Type filter</span>
                  <strong>{filters.type}</strong>
                </div>
              )}
            </div>

            {/* Email field */}
            <div className="stmt-modal__field">
              <label className="stmt-modal__label" htmlFor="stmt-email">
                Send to email address <span className="stmt-modal__required">*</span>
              </label>
              <input
                id="stmt-email"
                className={`stmt-modal__input${emailError ? ' stmt-modal__input--error' : ''}`}
                type="email"
                placeholder="e.g. ada.okafor@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                autoFocus
              />
              {emailError && <p className="stmt-modal__error">{emailError}</p>}
            </div>

            {/* Format field */}
            <div className="stmt-modal__field">
              <label className="stmt-modal__label" htmlFor="stmt-format">Statement format</label>
              <div className="stmt-modal__format-group">
                {(['PDF', 'CSV', 'EXCEL'] as const).map((f) => (
                  <label
                    key={f}
                    className={`stmt-modal__format-option${format === f ? ' stmt-modal__format-option--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={f}
                      checked={format === f}
                      onChange={() => setFormat(f)}
                      className="sr-only"
                    />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      {f === 'PDF'   && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>}
                      {f === 'CSV'   && <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>}
                      {f === 'EXCEL' && <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>}
                    </svg>
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Note */}
            <p className="stmt-modal__note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              The statement will be generated based on your current filters and sent to the email address above.
            </p>

            {/* Submit */}
            <button
              className="stmt-modal__submit"
              type="submit"
              disabled={sending}
            >
              {sending ? (
                <><span className="stmt-modal__spinner" /> Sending…</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  </svg>
                  Send Statement
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const { activeWallet, setActiveWallet } = useWallet();
  const [walletOpen,       setWalletOpen]       = useState(false);
  const [periodOpen,       setPeriodOpen]        = useState(false);
  const [filterOpen,       setFilterOpen]        = useState(false);
  const [filters,          setFilters]           = useState<FilterState>(DEFAULT_FILTERS);
  const [detailTxn,        setDetailTxn]         = useState<Transaction | null>(null);
  const [loading,          setLoading]           = useState(false);
  const [results,          setResults]           = useState<Transaction[]>(ALL_TRANSACTIONS);
  const [page,             setPage]              = useState(1);
  const [hasSearched,      setHasSearched]       = useState(true);
  const [stmtModalOpen,    setStmtModalOpen]     = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!walletOpen && !periodOpen) return;
    let handler: ((e: Event) => void) | null = null;
    const timer = setTimeout(() => {
      handler = (e: Event) => {
        if (walletOpen && walletRef.current && !walletRef.current.contains(e.target as Node)) {
          setWalletOpen(false);
        }
        if (periodOpen && periodRef.current && !periodRef.current.contains(e.target as Node)) {
          setPeriodOpen(false);
        }
      };
      document.addEventListener('click', handler);
    }, 100);
    return () => {
      clearTimeout(timer);
      if (handler) document.removeEventListener('click', handler);
    };
  }, [walletOpen, periodOpen]);

  const applyFilters = useCallback((f: FilterState) => {
    setFilters(f);
    setLoading(true);
    setHasSearched(true);
    setPage(1);
    setTimeout(() => {
      let out = [...ALL_TRANSACTIONS];
      if (f.wallet !== 'ALL') out = out.filter((t) => t.currency === f.wallet);
      if (f.type   !== 'ALL') out = out.filter((t) => t.type     === f.type);
      if (f.status !== 'ALL') out = out.filter((t) => t.status   === f.status);
      if (f.startDate)        out = out.filter((t) => t.date >= f.startDate);
      if (f.endDate)          out = out.filter((t) => t.date <= f.endDate + 'T23:59:59Z');
      if (f.search) {
        const q = f.search.toLowerCase();
        out = out.filter((t) =>
          t.description.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q)   ||
          String(t.amount).includes(q)
        );
      }
      setResults(out);
      setLoading(false);
    }, 900);
  }, []);

  useEffect(() => { applyFilters(DEFAULT_FILTERS); }, [applyFilters]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const pageItems  = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const groups     = groupByDate(pageItems);

  return (
    <AppShell title="Transaction History" subtitle="Review and filter your account activity.">
      {detailTxn && (
        <DetailDrawer txn={detailTxn} onClose={() => setDetailTxn(null)} />
      )}
      {filterOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setFilterOpen(false)} aria-hidden="true" />
          <FilterSheet
            filters={filters}
            onApply={applyFilters}
            onClose={() => setFilterOpen(false)}
          />
        </>
      )}
      {stmtModalOpen && (
        <StatementModal
          filters={filters}
          results={results}
          currency={activeWallet.currency}
          onClose={() => setStmtModalOpen(false)}
        />
      )}

      <div className="hist-page">

        {/* ── Compact toolbar: account name | Other Accounts | Period ── */}
        <div className="hist-toolbar">
          {/* Account name + number */}
          <div className="hist-toolbar__account">
            <span className="hist-toolbar__acct-name">{activeWallet.currency} Wallet</span>
            <span className="hist-toolbar__acct-num">{activeWallet.flag} {activeWallet.formatted}</span>
          </div>

          {/* Other Accounts dropdown — reuses wallet-dropdown from WalletCard */}
          <div className="hist-toolbar__other" ref={walletRef}>
            <button
              className="hist-toolbar__other-btn"
              type="button"
              onClick={() => setWalletOpen((o) => !o)}
            >
              Other Accounts <ChevronDownIcon size={13} color="currentColor" />
            </button>
            {walletOpen && (
              <div className="wallet-dropdown hist-wallet-dropdown" role="listbox" aria-label="Select wallet">
                <p className="wallet-dropdown__title">Select Wallet</p>
                {wallets.map((w: Wallet) => (
                  <button
                    key={w.currency}
                    className={`wallet-dropdown__item${activeWallet.currency === w.currency ? ' wallet-dropdown__item--active' : ''}`}
                    onClick={() => { setActiveWallet(w); applyFilters({ ...filters, wallet: w.currency as WalletCode }); setWalletOpen(false); }}
                    role="option"
                    aria-selected={activeWallet.currency === w.currency}
                  >
                    <span className="wallet-dropdown__flag">{w.flag}</span>
                    <div className="wallet-dropdown__info">
                      <span className="wallet-dropdown__currency">{w.currency}</span>
                      {w.isPrimary && <span className="wallet-dropdown__badge">Primary</span>}
                    </div>
                    <span className="wallet-dropdown__check">
                      {activeWallet.currency === w.currency
                        ? <CheckIcon size={14} color="#fff" />
                        : <span className="wallet-dropdown__radio" />}
                    </span>
                  </button>
                ))}
                <button className="wallet-dropdown__add" onClick={() => setWalletOpen(false)}>
                  <span className="wallet-dropdown__add-icon"><PlusIcon size={14} color="#111" /></span>
                  <span>Add Wallet</span>
                  <ChevronRightIcon size={14} color="#888" />
                </button>
              </div>
            )}
          </div>

          {/* Period picker — "Custom" opens the filter modal */}
          <div className="hist-toolbar__period" ref={periodRef}>
            <button
              className={`hist-toolbar__period-btn${periodOpen ? ' hist-toolbar__period-btn--open' : ''}`}
              type="button"
              onClick={() => { setPeriodOpen((o) => !o); setFilterOpen(false); }}
            >
              {filters.period === 'Custom' && filters.startDate && filters.endDate
                ? `${filters.startDate} → ${filters.endDate}`
                : filters.period || 'Last 30 Days'
              } <ChevronDownIcon size={13} color="currentColor" />
            </button>
            {periodOpen && (
              <ul className="hist-period-dropdown">
                {['Today','Last 7 Days','Last 30 Days','Last 3 Months','Custom'].map((p) => (
                  <li key={p}>
                    <button
                      className={`hist-period-option${(filters.period || 'Last 30 Days') === p ? ' hist-period-option--active' : ''}`}
                      type="button"
                      onClick={() => {
                        if (p === 'Custom') {
                          setPeriodOpen(false);
                          setFilterOpen(true);
                        } else {
                          const dates = periodToDates(p);
                          applyFilters({ ...filters, period: p, ...dates });
                          setPeriodOpen(false);
                        }
                      }}
                    >{p}</button>
                  </li>
                ))}
              </ul>
            )}
            {/* Filter modal opens at top level */}
          </div>

          {/* Request Statement button — only when filtered results exist */}
          {results.length > 0 && (filters.type !== 'ALL' || filters.status !== 'ALL' || filters.wallet !== 'ALL' || (filters.startDate && filters.endDate) || filters.search) && (
            <button
              className="hist-stmt-btn"
              type="button"
              onClick={() => setStmtModalOpen(true)}
              title="Request account statement"
            >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="9" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span className="hist-stmt-btn__text">Statement</span>
          </button>
          )}
        </div>

        {/* ── Active filter chips ─────────────────────────────────────── */}
        {(filters.type !== 'ALL' || filters.search || (filters.startDate && filters.endDate)) && (
          <div className="hist-chips">
            {filters.type !== 'ALL' && (
              <span className="hist-chip">
                {typeLabel(filters.type)}
                <button type="button" onClick={() => applyFilters({ ...filters, type: 'ALL' })}>×</button>
              </span>
            )}
            {filters.search && (
              <span className="hist-chip">
                "{filters.search}"
                <button type="button" onClick={() => applyFilters({ ...filters, search: '' })}>×</button>
              </span>
            )}
            {filters.startDate && filters.endDate && (
              <span className="hist-chip">
                {filters.startDate} → {filters.endDate}
                <button type="button" onClick={() => applyFilters({ ...filters, startDate: '', endDate: '', period: 'Last 30 Days' })}>×</button>
              </span>
            )}
            <button className="hist-chip hist-chip--clear" type="button" onClick={() => applyFilters(DEFAULT_FILTERS)}>
              Clear all
            </button>
          </div>
        )}

       

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="hist-empty">
            <div className="hist-empty__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="#ccc" strokeWidth="1.5"/>
                <path d="m16.5 16.5 4 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 11h6M11 8v6" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="hist-empty__title">No transactions found</p>
            <p className="hist-empty__sub">Try adjusting your filters or date range.</p>
            <button className="hist-empty__reset" type="button" onClick={() => applyFilters(DEFAULT_FILTERS)}>
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Transaction groups ──────────────────────────────────────── */}
        {!loading && results.length > 0 && (
          <div className="hist-results">
            <p className="hist-results__count">{results.length} transaction{results.length !== 1 ? 's' : ''}</p>

            {groups.map(({ label, items }) => (
              <div className="hist-group" key={label}>
                <p className="hist-group__label">{label}</p>
                <div className="hist-group__list">
                  {items.map((txn) => (
                    <button
                      key={txn.id}
                      className="hist-item"
                      type="button"
                      onClick={() => setDetailTxn(txn)}
                    >
                      <div className={`hist-item__icon ${txn.isCredit ? 'hist-item__icon--credit' : 'hist-item__icon--debit'}`}>
                        {txn.isCredit
                          ? <ArrowDownLeftIcon size={18} color="#16a34a" />
                          : <ArrowUpRightIcon  size={18} color="#e5403a" />}
                      </div>
                      <div className="hist-item__body">
                        <p className="hist-item__desc">{txn.description}</p>
                        <p className="hist-item__meta">{txn.counterparty} · {fmtTime(txn.date)}</p>
                      </div>
                      <div className="hist-item__right">
                        <p className={`hist-item__amount ${txn.isCredit ? 'hist-item__amount--credit' : 'hist-item__amount--debit'}`}>
                          {txn.isCredit ? '+' : '-'}{fmtAmount(txn.symbol, txn.amount)}
                        </p>
                        <span className={`hist-status hist-status--${txn.status.toLowerCase()}`}>{txn.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="hist-pagination">
                <button
                  className="hist-page-btn"
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >← Prev</button>
                <span className="hist-page-info">{page} / {totalPages}</span>
                <button
                  className="hist-page-btn"
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >Next →</button>
              </div>
            )}
          </div>
        )}

      </div>
    </AppShell>
  );
}