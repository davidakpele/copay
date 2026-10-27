import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import WalletCard from '../components/WalletCard';
import QuickActions from '../components/QuickActions';
import { useWallet } from '../contexts/WalletContext';

interface Txn {
  id: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'transfer' | 'credited';
  description: string;
  date: string;
  amount: number;
  symbol: string;
  status: 'completed' | 'pending' | 'failed';
  ref: string;
  sessionId: string;
  previousBalance: number;
  availableBalance: number;
  currency: string;
}

const MOCK_TXNS: Record<string, Txn[]> = {
  USD: [
    { id: 'u1', type: 'credited', description: 'Money Received from John Adewale', date: '2025-07-22T10:24:00', amount: 240, symbol: '$', status: 'completed', ref: 'REF001USD', sessionId: '[...]', previousBalance: 1200, availableBalance: 1440, currency: 'USD' },
    { id: 'u2', type: 'withdrawal', description: 'Transfer to Chiciera Okafor', date: '2025-07-21T16:32:00', amount: -80, symbol: '$', status: 'completed', ref: 'REF002USD', sessionId: '[...]', previousBalance: 1520, availableBalance: 1440, currency: 'USD' },
    { id: 'u3', type: 'swap', description: 'Swap USD → NGN', date: '2025-07-18T14:10:00', amount: -500, symbol: '$', status: 'completed', ref: 'REF003USD', sessionId: '[...]', previousBalance: 2000, availableBalance: 1500, currency: 'USD' },
    { id: 'u4', type: 'deposit', description: 'Bank Transfer Deposit', date: '2025-07-15T09:00:00', amount: 1000, symbol: '$', status: 'completed', ref: 'REF004USD', sessionId: '[...]', previousBalance: 1000, availableBalance: 2000, currency: 'USD' },
    { id: 'u5', type: 'withdrawal', description: 'Airtime Purchase MTN', date: '2025-07-12T13:45:00', amount: -5, symbol: '$', status: 'completed', ref: 'REF005USD', sessionId: '[...]', previousBalance: 500, availableBalance: 495, currency: 'USD' },
    { id: 'u6', type: 'credited', description: 'Money Received from Sarah Blake', date: '2025-07-10T11:00:00', amount: 120, symbol: '$', status: 'pending', ref: 'REF006USD', sessionId: '[...]', previousBalance: 350, availableBalance: 470, currency: 'USD' },
  ],
  NGN: [
    { id: 'n1', type: 'credited', description: 'Money Received from Akpele Becky', date: '2025-07-22T08:00:00', amount: 50000, symbol: '₦', status: 'completed', ref: 'REF001NGN', sessionId: '[...]', previousBalance: 1000000, availableBalance: 1050000, currency: 'NGN' },
    { id: 'n2', type: 'withdrawal', description: 'Bill Payment IKEDC', date: '2025-07-21T18:00:00', amount: -15000, symbol: '₦', status: 'completed', ref: 'REF002NGN', sessionId: '[...]', previousBalance: 1050000, availableBalance: 1035000, currency: 'NGN' },
    { id: 'n3', type: 'transfer', description: 'Transfer to Tunde Adeyemi', date: '2025-07-19T15:15:00', amount: -30000, symbol: '₦', status: 'completed', ref: 'REF003NGN', sessionId: '[...]', previousBalance: 1100000, availableBalance: 1070000, currency: 'NGN' },
    { id: 'n4', type: 'swap', description: 'Swap USD → NGN', date: '2025-07-18T14:10:00', amount: 800000, symbol: '₦', status: 'completed', ref: 'REF004NGN', sessionId: '[...]', previousBalance: 300000, availableBalance: 1100000, currency: 'NGN' },
    { id: 'n5', type: 'deposit', description: 'Bank Transfer Deposit', date: '2025-07-14T10:30:00', amount: 200000, symbol: '₦', status: 'completed', ref: 'REF005NGN', sessionId: '[...]', previousBalance: 700000, availableBalance: 900000, currency: 'NGN' },
    { id: 'n6', type: 'withdrawal', description: 'Airtime Purchase Airtel', date: '2025-07-11T14:00:00', amount: -2000, symbol: '₦', status: 'failed', ref: 'REF006NGN', sessionId: '[...]', previousBalance: 700000, availableBalance: 698000, currency: 'NGN' },
  ],
  GBP: [
    { id: 'g1', type: 'credited', description: 'Money Received from Emma Wilson', date: '2025-07-22T07:30:00', amount: 50, symbol: '£', status: 'completed', ref: 'REF001GBP', sessionId: '[...]', previousBalance: 300, availableBalance: 350, currency: 'GBP' },
    { id: 'g2', type: 'transfer', description: 'Transfer to James Carter', date: '2025-07-19T13:00:00', amount: -30, symbol: '£', status: 'completed', ref: 'REF002GBP', sessionId: '[...]', previousBalance: 350, availableBalance: 320, currency: 'GBP' },
    { id: 'g3', type: 'deposit', description: 'Card Payment Deposit', date: '2025-07-10T09:00:00', amount: 300, symbol: '£', status: 'completed', ref: 'REF003GBP', sessionId: '[...]', previousBalance: 50, availableBalance: 350, currency: 'GBP' },
  ],
  EUR: [
    { id: 'e1', type: 'swap', description: 'Swap EUR → NGN', date: '2025-07-17T17:00:00', amount: -100, symbol: '€', status: 'completed', ref: 'REF001EUR', sessionId: '[...]', previousBalance: 600, availableBalance: 500, currency: 'EUR' },
    { id: 'e2', type: 'deposit', description: 'USSD Deposit', date: '2025-07-12T11:00:00', amount: 500, symbol: '€', status: 'completed', ref: 'REF002EUR', sessionId: '[...]', previousBalance: 0, availableBalance: 500, currency: 'EUR' },
    { id: 'e3', type: 'credited', description: 'Money Received from Marco Ricci', date: '2025-07-08T15:00:00', amount: 10, symbol: '€', status: 'pending', ref: 'REF003EUR', sessionId: '[...]', previousBalance: 330, availableBalance: 340, currency: 'EUR' },
  ],
};

const TABS = ['All', 'Deposits', 'Withdrawals', 'Swaps', 'Credited'];

function fmt(number: number) {
  return Math.abs(number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isCredit(txn: Txn) {
  return ['deposit', 'credited'].includes(txn.type);
}

function typeColor(type: Txn['type']) {
  const map: Record<string, string> = {
    deposit: '#2563eb',
    withdrawal: '#ef4444',
    swap: '#8b5cf6',
    transfer: '#3b82f6',
    credited: '#16a34a',
  };
  return map[type] ?? '#6b7280';
}

function TypeIcon({ type }: { type: Txn['type'] }) {
  const c = typeColor(type);
  switch (type) {
    case 'deposit':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M6 9l6 6 6-6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 18h16" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case 'withdrawal':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21V9M6 15l6-6 6 6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 5h16" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case 'swap':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4l4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'credited':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12V7H4v5" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="2" y="5" width="20" height="14" rx="2" stroke={c} strokeWidth="2"/><path d="M8 15h8" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
    default:
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
}

function StatusBadge({ status }: { status: Txn['status'] }) {
  const map = {
    completed: { bg: '#dcfce7', color: '#16a34a', label: 'Completed' },
    pending: { bg: '#fef9c3', color: '#a16207', label: 'Pending' },
    failed: { bg: '#fee2e2', color: '#dc2626', label: 'Failed' },
  };
  const { bg, color, label } = map[status];
  return <span className="wh-status" style={{ background: bg, color }}>{label}</span>;
}

function DetailPanel({ txn, onDelete }: { txn: Txn; onDelete: (id: string) => void }) {
  const [copied,      setCopied]      = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  function copy(key: string, value: string) {
    navigator.clipboard.writeText(value).catch(() => undefined);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1500);
  }

  const credit     = isCredit(txn);
  const amtColor   = credit ? '#16a34a' : '#ef4444';
  const tc         = typeColor(txn.type);

  const infoRows = [
    { label: 'Reference No.', key: 'ref',   value: txn.ref,                               copyable: true  },
    { label: 'Session ID',    key: 'ses',   value: txn.sessionId,                         copyable: true  },
    { label: 'Date',          key: 'date',  value: fmtDate(txn.date),                     copyable: false },
    { label: 'Currency',      key: 'curr',  value: txn.currency,                          copyable: false },
    { label: 'Prev. Balance', key: 'prev',  value: txn.symbol + fmt(txn.previousBalance), copyable: false },
    { label: 'Avail. Balance',key: 'avail', value: txn.symbol + fmt(txn.availableBalance),copyable: false },
    { label: 'Type',          key: 'type',  value: txn.type,                              copyable: false },
    { label: 'Status',        key: 'stat',  value: txn.status,                            copyable: false },
  ];

  return (
    <>
      <div className="wh-detail-panel">

        {/* ── Hero row ── */}
        <div className="wh-detail-hero">
          <div className="wh-detail-hero__icon" style={{ background: `${tc}18`, color: tc }}>
            <TypeIcon type={txn.type} />
          </div>
          <div className="wh-detail-hero__body">
            <p className="wh-detail-hero__desc">{txn.description}</p>
            <p className="wh-detail-hero__amount" style={{ color: amtColor }}>
              {credit ? '+' : '-'}{txn.symbol}{fmt(txn.amount)}
            </p>
          </div>
          <StatusBadge status={txn.status} />
        </div>

        {/* ── Info cards 2-col grid ── */}
        <div className="wh-detail-cards">
          {infoRows.map((row) => (
            <div key={row.key} className="wh-detail-card">
              <span className="wh-detail-card__label">{row.label}</span>
              <div className="wh-detail-card__value-row">
                {row.key === 'stat' ? (
                  <span className="wh-detail-card__status-pill" style={{
                    background: txn.status === 'completed' ? '#dcfce7' : txn.status === 'pending' ? '#fef9c3' : '#fee2e2',
                    color:      txn.status === 'completed' ? '#16a34a' : txn.status === 'pending' ? '#a16207' : '#dc2626',
                  }}>{txn.status}</span>
                ) : row.key === 'ref' || row.key === 'ses' ? (
                  <span className="wh-detail-card__mono">{row.value}</span>
                ) : (
                  <span className="wh-detail-card__value">{row.value}</span>
                )}
                {row.copyable && (
                  <button
                    className={`wh-detail-copy${copied === row.key ? ' wh-detail-copy--done' : ''}`}
                    type="button"
                    onClick={() => copy(row.key, row.value)}
                    aria-label={`Copy ${row.label}`}
                  >
                    {copied === row.key
                      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Action buttons ── */}
        <div className="wh-detail-actions">
          <button className="wh-action-btn wh-action-btn--print" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9V2h12v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="6" y="14" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            Print
          </button>
          <button className="wh-action-btn wh-action-btn--view" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            View Receipt
          </button>
          <button
            className="wh-action-btn wh-action-btn--delete"
            type="button"
            onClick={() => setShowConfirm(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      {showConfirm && (
        <div className="wh-confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="wh-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wh-confirm-modal__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="wh-confirm-modal__title">Delete Transaction</h3>
            <p className="wh-confirm-modal__body">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="wh-confirm-modal__meta">
              <span>{txn.description}</span>
              <span style={{ color: amtColor, fontWeight: 700 }}>
                {credit ? '+' : '-'}{txn.symbol}{fmt(txn.amount)}
              </span>
            </div>
            <div className="wh-confirm-modal__actions">
              <button
                className="wh-confirm-modal__btn wh-confirm-modal__btn--ghost"
                type="button"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="wh-confirm-modal__btn wh-confirm-modal__btn--danger"
                type="button"
                onClick={() => { onDelete(txn.id); setShowConfirm(false); }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function WalletPage() {
  const { activeWallet } = useWallet();
  const [activeTab, setActiveTab] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [txnLoading, setTxnLoading] = useState(true);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  function handleDelete(id: string) {
    setDeletedIds((prev) => new Set([...prev, id]));
    setExpandedId(null);
  }

  useEffect(() => {
    const timer = setTimeout(() => setTxnLoading(false), 1400);
    return () => clearTimeout(timer);
  }, [activeWallet.currency]);

  function handleTabClick(tab: string) {
    setActiveTab(tab);
    setExpandedId(null);
    setTabLoading(true);
    setTimeout(() => setTabLoading(false), 700);
  }

  const rawTxns = MOCK_TXNS[activeWallet.currency] ?? [];
  const filtered = rawTxns.filter((txn) => {
    if (deletedIds.has(txn.id)) return false;
    if (activeTab !== 'All') {
      const map: Record<string, string[]> = {
        Deposits: ['deposit'],
        Withdrawals: ['withdrawal'],
        Swaps: ['swap'],
        Credited: ['credited', 'transfer'],
      };
      if (!map[activeTab]?.includes(txn.type)) return false;
    }
    if (dateFilter.start && txn.date.slice(0, 10) < dateFilter.start) return false;
    if (dateFilter.end && txn.date.slice(0, 10) > dateFilter.end) return false;
    return true;
  });

  const hasDateFilter = dateFilter.start || dateFilter.end;

  return (
    <AppShell>
      <div className="wh-page">
        <WalletCard />
        <QuickActions />

        <section className="wh-history">
          <div className="wh-history__header">
            <h2 className="wh-history__title">Transaction History</h2>

            <div className="wh-history__controls">
              <div className="wh-tabs">
                {TABS.map((tab) => (
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

              <button
                className={`wh-filter-btn${showDateFilter ? ' wh-filter-btn--open' : ''}`}
                type="button"
                onClick={() => setShowDateFilter((value) => !value)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Date Filter
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d={showDateFilter ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {showDateFilter && (
              <div className="wh-date-filter">
                <div className="wh-date-filter__fields">
                  <div className="wh-date-filter__field">
                    <label>From</label>
                    <input type="date" value={dateFilter.start} onChange={(event) => setDateFilter((state) => ({ ...state, start: event.target.value }))} />
                  </div>
                  <div className="wh-date-filter__field">
                    <label>To</label>
                    <input type="date" value={dateFilter.end} onChange={(event) => setDateFilter((state) => ({ ...state, end: event.target.value }))} />
                  </div>
                </div>
                <div className="wh-date-filter__btns">
                  <button
                    className="wh-date-quick"
                    type="button"
                    onClick={() => {
                      const end = new Date();
                      const start = new Date();
                      start.setDate(start.getDate() - 7);
                      setDateFilter({ start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) });
                    }}
                  >
                    Last 7 days
                  </button>
                  <button
                    className="wh-date-quick"
                    type="button"
                    onClick={() => {
                      const end = new Date();
                      const start = new Date();
                      start.setDate(start.getDate() - 30);
                      setDateFilter({ start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) });
                    }}
                  >
                    Last 30 days
                  </button>
                  <button className="wh-date-clear" type="button" onClick={() => setDateFilter({ start: '', end: '' })}>Clear</button>
                </div>
              </div>
            )}

            {hasDateFilter && (
              <div className="wh-active-filter">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 7C3 6.45 3.45 6 4 6h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zM3 12c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zm0 5c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <span>{dateFilter.start || 'Beginning'} → {dateFilter.end || 'Today'}</span>
                <button type="button" onClick={() => setDateFilter({ start: '', end: '' })} aria-label="Clear filter">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            )}
          </div>

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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#ccc" strokeWidth="1.8"/><path d="M2 10h20" stroke="#ccc" strokeWidth="1.8"/><path d="M8 15h8" stroke="#ccc" strokeWidth="1.8"/></svg>
                <p className="wh-empty-state__title">No transactions found</p>
                <p className="wh-empty-state__sub">Try changing the filter or date range</p>
              </div>
            ) : (
              <div className="wh-txn-list">
                {filtered.map((txn) => {
                  const expanded = expandedId === txn.id;
                  const credit = isCredit(txn);
                  const amountColor = credit ? '#16a34a' : '#ef4444';
                  const tileColor = typeColor(txn.type);

                  return (
                    <div key={txn.id} className={`wh-txn-card${expanded ? ' wh-txn-card--expanded' : ''}`}>
                      <div
                        className="wh-txn-summary"
                        onClick={() => setExpandedId(expanded ? null : txn.id)}
                        onTouchEnd={(event) => { event.preventDefault(); setExpandedId(expanded ? null : txn.id); }}
                      >
                        <div className="wh-txn-icon" style={{ background: `${tileColor}18`, color: tileColor }}>
                          <TypeIcon type={txn.type} />
                        </div>

                        <div className="wh-txn-info">
                          <div className="wh-txn-main">
                            <span className="wh-txn-type" style={expanded ? { color: '#fbbf24' } : {}}>{txn.type}</span>
                            <span className="wh-txn-amount" style={{ color: amountColor }}>
                              {credit ? '+' : '-'}{txn.symbol}{fmt(txn.amount)}
                            </span>
                          </div>
                          <div className="wh-txn-meta">
                            <span className="wh-txn-desc">{txn.description}</span>
                            <span className="wh-txn-date">{fmtDate(txn.date)}</span>
                          </div>
                          <StatusBadge status={txn.status} />
                        </div>

                        <button className="wh-expand-btn" type="button" aria-label={expanded ? 'Collapse' : 'Expand'}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d={expanded ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>

                      {expanded && <DetailPanel txn={txn} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
