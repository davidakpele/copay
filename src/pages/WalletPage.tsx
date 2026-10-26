import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AppShell from '../components/AppShell';
import { useWallet, wallets as ALL_WALLETS } from '../contexts/WalletContext';
import type { Wallet } from '../types';

/* ─── Mock transactions ────────────────────────────────────────────── */
interface Txn {
  id: string; type: 'deposit' | 'withdrawal' | 'swap' | 'transfer' | 'credited';
  description: string; date: string; amount: number; symbol: string;
  status: 'completed' | 'pending' | 'failed';
  ref: string; sessionId: string;
  previousBalance: number; availableBalance: number;
  currency: string;
}

const MOCK_TXNS: Record<string, Txn[]> = {
  USD: [
    { id: 'u1', type: 'credited',   description: 'Money Received from John Adewale', date: '2025-07-22T10:24:00', amount: 240,      symbol: '$', status: 'completed', ref: 'REF001USD', sessionId: 'SID001', previousBalance: 2210,    availableBalance: 2450,    currency: 'USD' },
    { id: 'u2', type: 'withdrawal', description: 'Transfer to Chiciera Okafor',       date: '2025-07-21T16:32:00', amount: -80,      symbol: '$', status: 'completed', ref: 'REF002USD', sessionId: 'SID002', previousBalance: 2450,    availableBalance: 2370,    currency: 'USD' },
    { id: 'u3', type: 'swap',       description: 'Swap USD → NGN',                    date: '2025-07-18T14:10:00', amount: -500,     symbol: '$', status: 'completed', ref: 'REF003USD', sessionId: 'SID003', previousBalance: 2870,    availableBalance: 2370,    currency: 'USD' },
    { id: 'u4', type: 'deposit',    description: 'Bank Transfer Deposit',             date: '2025-07-15T09:00:00', amount: 1000,     symbol: '$', status: 'completed', ref: 'REF004USD', sessionId: 'SID004', previousBalance: 1870,    availableBalance: 2870,    currency: 'USD' },
    { id: 'u5', type: 'withdrawal', description: 'Airtime Purchase MTN',             date: '2025-07-12T13:45:00', amount: -5,       symbol: '$', status: 'completed', ref: 'REF005USD', sessionId: 'SID005', previousBalance: 1875,    availableBalance: 1870,    currency: 'USD' },
    { id: 'u6', type: 'credited',   description: 'Money Received from Sarah Blake',  date: '2025-07-10T11:00:00', amount: 120,      symbol: '$', status: 'pending',   ref: 'REF006USD', sessionId: 'SID006', previousBalance: 1750,    availableBalance: 1870,    currency: 'USD' },
  ],
  NGN: [
    { id: 'n1', type: 'credited',   description: 'Money Received from Akpele Becky', date: '2025-07-22T08:00:00', amount: 50000,    symbol: '₦', status: 'completed', ref: 'REF001NGN', sessionId: 'SID101', previousBalance: 1230500, availableBalance: 1280500, currency: 'NGN' },
    { id: 'n2', type: 'withdrawal', description: 'Bill Payment IKEDC',               date: '2025-07-21T18:00:00', amount: -15000,   symbol: '₦', status: 'completed', ref: 'REF002NGN', sessionId: 'SID102', previousBalance: 1295500, availableBalance: 1280500, currency: 'NGN' },
    { id: 'n3', type: 'transfer',   description: 'Transfer to Tunde Adeyemi',        date: '2025-07-19T15:15:00', amount: -30000,   symbol: '₦', status: 'completed', ref: 'REF003NGN', sessionId: 'SID103', previousBalance: 1325500, availableBalance: 1295500, currency: 'NGN' },
    { id: 'n4', type: 'swap',       description: 'Swap USD → NGN',                   date: '2025-07-18T14:10:00', amount: 800000,   symbol: '₦', status: 'completed', ref: 'REF004NGN', sessionId: 'SID104', previousBalance: 525500,  availableBalance: 1325500, currency: 'NGN' },
    { id: 'n5', type: 'deposit',    description: 'Bank Transfer Deposit',            date: '2025-07-14T10:30:00', amount: 200000,   symbol: '₦', status: 'completed', ref: 'REF005NGN', sessionId: 'SID105', previousBalance: 325500,  availableBalance: 525500,  currency: 'NGN' },
    { id: 'n6', type: 'withdrawal', description: 'Airtime Purchase Airtel',          date: '2025-07-11T14:00:00', amount: -2000,    symbol: '₦', status: 'failed',    ref: 'REF006NGN', sessionId: 'SID106', previousBalance: 327500,  availableBalance: 325500,  currency: 'NGN' },
  ],
  GBP: [
    { id: 'g1', type: 'credited',   description: 'Money Received from Emma Wilson',  date: '2025-07-22T07:30:00', amount: 50,       symbol: '£', status: 'completed', ref: 'REF001GBP', sessionId: 'SID201', previousBalance: 270,    availableBalance: 320,    currency: 'GBP' },
    { id: 'g2', type: 'transfer',   description: 'Transfer to James Carter',         date: '2025-07-19T13:00:00', amount: -30,      symbol: '£', status: 'completed', ref: 'REF002GBP', sessionId: 'SID202', previousBalance: 300,    availableBalance: 270,    currency: 'GBP' },
    { id: 'g3', type: 'deposit',    description: 'Card Payment Deposit',             date: '2025-07-10T09:00:00', amount: 300,      symbol: '£', status: 'completed', ref: 'REF003GBP', sessionId: 'SID203', previousBalance: 0,      availableBalance: 300,    currency: 'GBP' },
  ],
  EUR: [
    { id: 'e1', type: 'swap',       description: 'Swap EUR → NGN',                   date: '2025-07-17T17:00:00', amount: -100,     symbol: '€', status: 'completed', ref: 'REF001EUR', sessionId: 'SID301', previousBalance: 510,    availableBalance: 410,    currency: 'EUR' },
    { id: 'e2', type: 'deposit',    description: 'USSD Deposit',                     date: '2025-07-12T11:00:00', amount: 500,      symbol: '€', status: 'completed', ref: 'REF002EUR', sessionId: 'SID302', previousBalance: 10,     availableBalance: 510,    currency: 'EUR' },
    { id: 'e3', type: 'credited',   description: 'Money Received from Marco Ricci',  date: '2025-07-08T15:00:00', amount: 10,       symbol: '€', status: 'pending',   ref: 'REF003EUR', sessionId: 'SID303', previousBalance: 0,      availableBalance: 10,     currency: 'EUR' },
  ],
};

const TABS = ['All', 'Deposits', 'Withdrawals', 'Swaps', 'Credited'];

/* ─── Helpers ────────────────────────────────────────────────────── */
function fmt(n: number) {
  return Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function isCredit(t: Txn) { return ['deposit', 'credited'].includes(t.type); }

function typeColor(type: Txn['type']) {
  const m: Record<string, string> = {
    deposit: '#2563eb', withdrawal: '#ef4444', swap: '#8b5cf6',
    transfer: '#3b82f6', credited: '#16a34a',
  };
  return m[type] ?? '#6b7280';
}

function TypeIcon({ type }: { type: Txn['type'] }) {
  const c = typeColor(type);
  switch (type) {
    case 'deposit':    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M6 9l6 6 6-6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 21h18" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'withdrawal': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21V9M6 15l6-6 6 6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3h18" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'swap':       return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4l4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'credited':   return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12V7H4v5" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="2" y="5" width="20" height="14" rx="2" stroke={c} strokeWidth="2"/><path d="M12 12v4m-2-2h4" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
    default:           return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
}

function StatusBadge({ status }: { status: Txn['status'] }) {
  const map = {
    completed: { bg: '#dcfce7', color: '#16a34a', label: 'Completed' },
    pending:   { bg: '#fef9c3', color: '#a16207', label: 'Pending'   },
    failed:    { bg: '#fee2e2', color: '#dc2626', label: 'Failed'     },
  };
  const { bg, color, label } = map[status];
  return <span className="wh-status" style={{ background: bg, color }}>{label}</span>;
}

/* ─── Transaction detail panel ─────────────────────────────────────── */
function DetailPanel({ txn, onClose }: { txn: Txn; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(key: string, val: string) {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(k => k === key ? null : k), 1500);
  }
  const rows = [
    { label: 'Reference No.', key: 'ref',     value: txn.ref },
    { label: 'Session ID',    key: 'ses',     value: txn.sessionId },
    { label: 'Date',          key: 'date',    value: fmtDate(txn.date) },
    { label: 'Prev. Balance', key: 'prev',    value: txn.symbol + fmt(txn.previousBalance)  },
    { label: 'Avail. Balance',key: 'avail',   value: txn.symbol + fmt(txn.availableBalance) },
    { label: 'Currency',      key: 'curr',    value: txn.currency },
    { label: 'Status',        key: 'stat',    value: txn.status   },
  ];
  return (
    <div className="wh-detail-panel">
      <div className="wh-detail-grid">
        {rows.map(r => (
          <div key={r.key} className="wh-detail-item">
            <span className="wh-detail-label">{r.label}</span>
            <span className="wh-detail-value">
              {r.value}
              {['ref', 'ses'].includes(r.key) && (
                <button className="wh-copy-btn" type="button" onClick={() => copy(r.key, r.value)} aria-label="Copy">
                  {copied === r.key
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="wh-detail-actions">
        <button className="wh-action-btn wh-action-btn--print" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.8"/><rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>
          Print
        </button>
        <button className="wh-action-btn wh-action-btn--view" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" stroke="currentColor" strokeWidth="1.8"/></svg>
          View Receipt
        </button>
        <button className="wh-action-btn wh-action-btn--delete" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
}

/* ─── Currency picker modal ────────────────────────────────────────── */
function CurrencyModal({
  onSelect, onClose,
}: { onSelect: (w: Wallet) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = ALL_WALLETS.filter(w =>
    w.currency.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="wh-modal-overlay" onClick={onClose}>
      <div className="wh-currency-modal" onClick={e => e.stopPropagation()}>
        <div className="wh-currency-modal__header">
          <h3>Select Currency</h3>
          <button className="wh-currency-modal__close" type="button" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="wh-currency-modal__search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="#aaa" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/></svg>
          <input
            type="search"
            placeholder="Search currency…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="wh-currency-modal__list">
          {filtered.length === 0 && <p className="wh-currency-modal__empty">No currencies found</p>}
          {filtered.map(w => (
            <button
              key={w.currency}
              className="wh-currency-item"
              type="button"
              onClick={() => { onSelect(w); onClose(); }}
              onTouchEnd={e => { e.preventDefault(); onSelect(w); onClose(); }}
            >
              <span className="wh-currency-item__radio">
                <span className="wh-currency-item__radio-inner" />
              </span>
              <span className="wh-currency-item__flag">{w.flag}</span>
              <span className="wh-currency-item__name">{w.currency}</span>
              <span className="wh-currency-item__balance">
                {w.symbol}{w.balance.toLocaleString('en', { minimumFractionDigits: 2 })}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function WalletPage() {
  const navigate = useNavigate();
  const { activeWallet, setActiveWallet } = useWallet();

  const [selectedWallet,    setSelectedWallet]    = useState<Wallet>(activeWallet);
  const [showBalance,       setShowBalance]        = useState(false);
  const [showCurrencyModal, setShowCurrencyModal]  = useState(false);
  const [activeTab,         setActiveTab]          = useState('All');
  const [expandedId,        setExpandedId]         = useState<string | null>(null);
  const [tabLoading,        setTabLoading]         = useState(false);
  const [txnLoading,        setTxnLoading]         = useState(true);
  const [showDateFilter,    setShowDateFilter]     = useState(false);
  const [dateFilter,        setDateFilter]         = useState({ start: '', end: '' });

  /* initial load spinner */
  useEffect(() => {
    const t = setTimeout(() => setTxnLoading(false), 1400);
    return () => clearTimeout(t);
  }, [selectedWallet.currency]);

  function handleTabClick(tab: string) {
    setActiveTab(tab);
    setExpandedId(null);
    setTabLoading(true);
    setTimeout(() => setTabLoading(false), 700);
  }

  function handleCurrencySelect(w: Wallet) {
    setSelectedWallet(w);
    setActiveWallet(w);
    setTxnLoading(true);
    setActiveTab('All');
    setExpandedId(null);
    setTimeout(() => setTxnLoading(false), 1200);
  }

  /* filter */
  const rawTxns = MOCK_TXNS[selectedWallet.currency] ?? [];
  const filtered = rawTxns.filter(t => {
    if (activeTab !== 'All') {
      const map: Record<string, string[]> = {
        Deposits: ['deposit'], Withdrawals: ['withdrawal'],
        Swaps: ['swap'], Credited: ['credited', 'transfer'],
      };
      if (!map[activeTab]?.includes(t.type)) return false;
    }
    if (dateFilter.start) {
      if (t.date.slice(0, 10) < dateFilter.start) return false;
    }
    if (dateFilter.end) {
      if (t.date.slice(0, 10) > dateFilter.end) return false;
    }
    return true;
  });

  const hasDateFilter = dateFilter.start || dateFilter.end;

  function fmtBalance() {
    if (!showBalance) return '•••••';
    const b = selectedWallet.balance;
    return selectedWallet.symbol + b.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }

  return (
    <AppShell>
      <div className="wh-page">

        {/* ══ HERO BANNER ══ */}
        <section className="wh-hero">
          {/* Top row: currency pill + eye toggle */}
          <div className="wh-hero__top">
            <button
              className="wh-currency-pill"
              type="button"
              onClick={() => setShowCurrencyModal(true)}
            >
              <span>{selectedWallet.flag}</span>
              <span className="wh-currency-pill__code">{selectedWallet.currency}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="wh-hero__eye"
              type="button"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              onClick={() => setShowBalance(b => !b)}
            >
              {showBalance
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M1 1l22 22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/></svg>}
            </button>
          </div>

          {/* Balance */}
          <div className="wh-hero__balance-section">
            <p className="wh-hero__label">Available Balance</p>
            <p className="wh-hero__amount">{fmtBalance()}</p>
          </div>

          {/* Actions */}
          <div className="wh-hero__actions">
            <button className="wh-hero__action-item" type="button" onClick={() => navigate('/deposit-banks')}>
              <span className="wh-hero__action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </span>
              <span>Deposit</span>
            </button>
            <button className="wh-hero__action-item" type="button" onClick={() => navigate('/beneficiary-transfer')}>
              <span className="wh-hero__action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span>Withdraw</span>
            </button>
          </div>
        </section>

        {/* ══ HISTORY SECTION ══ */}
        <section className="wh-history">

          {/* Header */}
          <div className="wh-history__header">
            <h2 className="wh-history__title">Transaction History</h2>

            {/* Tabs row */}
            <div className="wh-history__controls">
              <div className="wh-tabs">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    type="button"
                    className={`wh-tab${activeTab === tab ? ' wh-tab--active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Filter button */}
              <button
                className={`wh-filter-btn${showDateFilter ? ' wh-filter-btn--open' : ''}`}
                type="button"
                onClick={() => setShowDateFilter(v => !v)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Date Filter
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d={showDateFilter ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Date filter panel */}
            {showDateFilter && (
              <div className="wh-date-filter">
                <div className="wh-date-filter__fields">
                  <div className="wh-date-filter__field">
                    <label>From</label>
                    <input type="date" value={dateFilter.start} onChange={e => setDateFilter(f => ({ ...f, start: e.target.value }))} />
                  </div>
                  <div className="wh-date-filter__field">
                    <label>To</label>
                    <input type="date" value={dateFilter.end} onChange={e => setDateFilter(f => ({ ...f, end: e.target.value }))} />
                  </div>
                </div>
                <div className="wh-date-filter__btns">
                  <button className="wh-date-quick" type="button" onClick={() => { const e = new Date(), s = new Date(); s.setDate(s.getDate()-7); setDateFilter({ start: s.toISOString().split('T')[0], end: e.toISOString().split('T')[0] }); }}>Last 7 days</button>
                  <button className="wh-date-quick" type="button" onClick={() => { const e = new Date(), s = new Date(); s.setDate(s.getDate()-30); setDateFilter({ start: s.toISOString().split('T')[0], end: e.toISOString().split('T')[0] }); }}>Last 30 days</button>
                  <button className="wh-date-clear" type="button" onClick={() => setDateFilter({ start: '', end: '' })}>Clear</button>
                </div>
              </div>
            )}

            {/* Active date badge */}
            {hasDateFilter && (
              <div className="wh-active-filter">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 7C3 6.45 3.45 6 4 6h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zM3 12c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zM4 16c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4z" fill="currentColor"/></svg>
                <span>{dateFilter.start || 'Beginning'} → {dateFilter.end || 'Today'}</span>
                <button type="button" onClick={() => setDateFilter({ start: '', end: '' })} aria-label="Clear filter">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            )}
          </div>

          {/* Transactions container */}
          <div className="wh-txns">
            {txnLoading ? (
              <div className="wh-loading-state">
                <div className="wh-spinner" />
                <p>Loading transactions…</p>
              </div>
            ) : tabLoading ? (
              <div className="wh-loading-state">
                <div className="wh-spinner" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="wh-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#ccc" strokeWidth="1.8"/><path d="M2 10h20" stroke="#ccc" strokeWidth="1.8"/></svg>
                <p className="wh-empty-state__title">No transactions found</p>
                <p className="wh-empty-state__sub">Try changing the filter or date range</p>
              </div>
            ) : (
              <div className="wh-txn-list">
                {filtered.map(txn => {
                  const expanded = expandedId === txn.id;
                  const credit   = isCredit(txn);
                  const amtColor = credit ? '#16a34a' : '#ef4444';
                  const tc       = typeColor(txn.type);
                  return (
                    <div key={txn.id} className={`wh-txn-card${expanded ? ' wh-txn-card--expanded' : ''}`}>
                      <div
                        className="wh-txn-summary"
                        onClick={() => setExpandedId(expanded ? null : txn.id)}
                        onTouchEnd={e => { e.preventDefault(); setExpandedId(expanded ? null : txn.id); }}
                      >
                        {/* Icon */}
                        <div className="wh-txn-icon" style={{ background: `${tc}18`, color: tc }}>
                          <TypeIcon type={txn.type} />
                        </div>

                        {/* Info */}
                        <div className="wh-txn-info">
                          <div className="wh-txn-main">
                            <span className="wh-txn-type" style={expanded ? { color: '#fbbf24' } : {}}>{txn.type}</span>
                            <span className="wh-txn-amount" style={{ color: amtColor }}>
                              {credit ? '+' : '-'}{txn.symbol}{fmt(txn.amount)}
                            </span>
                          </div>
                          <div className="wh-txn-meta">
                            <span className="wh-txn-desc">{txn.description}</span>
                            <span className="wh-txn-date">{fmtDate(txn.date)}</span>
                          </div>
                          <StatusBadge status={txn.status} />
                        </div>

                        {/* Expand btn */}
                        <button className="wh-expand-btn" type="button" aria-label={expanded ? 'Collapse' : 'Expand'}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d={expanded ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>

                      {/* Detail panel */}
                      {expanded && <DetailPanel txn={txn} onClose={() => setExpandedId(null)} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Currency picker modal */}
      {showCurrencyModal && (
        <CurrencyModal
          onSelect={handleCurrencySelect}
          onClose={() => setShowCurrencyModal(false)}
        />
      )}
    </AppShell>
  );
}
