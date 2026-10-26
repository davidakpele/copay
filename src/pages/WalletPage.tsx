import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppShell from '../components/AppShell';
import { useWallet, wallets as ALL_WALLETS } from '../contexts/WalletContext';
import {
  SendIcon, ReceiveIcon, ArrowUpRightIcon, ArrowDownLeftIcon,
  EyeIcon, ChevronRightIcon, ExchangeIcon, DepositIcon,
} from '../components/Icons';
import type { Wallet } from '../types';

/* ─── Mock transactions per currency ────────────────────────────── */
const TXN_MAP: Record<string, { id: string; title: string; sub: string; date: string; amount: string; isCredit: boolean }[]> = {
  USD: [
    { id: '1', title: 'Money Received',    sub: 'From John Adewale',       date: 'Today, 10:24 AM',    amount: '+$240.00',    isCredit: true  },
    { id: '2', title: 'Money Sent',        sub: 'To Chiciera Okafor',      date: 'Yesterday, 4:32 PM', amount: '-$80.00',     isCredit: false },
    { id: '3', title: 'Exchange',          sub: 'USD → NGN',               date: 'Jul 18, 2:10 PM',    amount: '-$500.00',    isCredit: false },
    { id: '4', title: 'Deposit',           sub: 'Bank Transfer',           date: 'Jul 15, 9:00 AM',    amount: '+$1,000.00',  isCredit: true  },
    { id: '5', title: 'Airtime Purchase',  sub: 'MTN 09012345678',         date: 'Jul 12, 1:45 PM',    amount: '-$5.00',      isCredit: false },
    { id: '6', title: 'Money Received',    sub: 'From Sarah Blake',        date: 'Jul 10, 11:00 AM',   amount: '+$120.00',    isCredit: true  },
  ],
  NGN: [
    { id: '1', title: 'Money Received',    sub: 'From Akpele Becky',       date: 'Today, 8:00 AM',     amount: '+₦50,000',    isCredit: true  },
    { id: '2', title: 'Bill Payment',      sub: 'IKEDC Electricity',       date: 'Yesterday, 6:00 PM', amount: '-₦15,000',    isCredit: false },
    { id: '3', title: 'Money Sent',        sub: 'To Tunde Adeyemi',        date: 'Jul 19, 3:15 PM',    amount: '-₦30,000',    isCredit: false },
    { id: '4', title: 'Exchange',          sub: 'USD → NGN',               date: 'Jul 18, 2:10 PM',    amount: '+₦800,000',   isCredit: true  },
    { id: '5', title: 'Deposit',           sub: 'Bank Transfer',           date: 'Jul 14, 10:30 AM',   amount: '+₦200,000',   isCredit: true  },
    { id: '6', title: 'Airtime Purchase',  sub: 'Airtel 08123456789',      date: 'Jul 11, 2:00 PM',    amount: '-₦2,000',     isCredit: false },
  ],
  GBP: [
    { id: '1', title: 'Money Received',    sub: 'From Emma Wilson',        date: 'Today, 7:30 AM',     amount: '+£50.00',     isCredit: true  },
    { id: '2', title: 'Money Sent',        sub: 'To James Carter',         date: 'Jul 19, 1:00 PM',    amount: '-£30.00',     isCredit: false },
    { id: '3', title: 'Deposit',           sub: 'Card Payment',            date: 'Jul 10, 9:00 AM',    amount: '+£300.00',    isCredit: true  },
  ],
  EUR: [
    { id: '1', title: 'Exchange',          sub: 'EUR → NGN',               date: 'Jul 17, 5:00 PM',    amount: '-€100.00',    isCredit: false },
    { id: '2', title: 'Deposit',           sub: 'USSD',                    date: 'Jul 12, 11:00 AM',   amount: '+€500.00',    isCredit: true  },
    { id: '3', title: 'Money Received',    sub: 'From Marco Ricci',        date: 'Jul 8, 3:00 PM',     amount: '+€10.00',     isCredit: true  },
  ],
};

/* ─── Stats per currency ─────────────────────────────────────────── */
const STATS_MAP: Record<string, { sent: string; received: string; txnCount: number }> = {
  USD: { sent: '$1,240.00',    received: '$3,180.00',    txnCount: 42  },
  NGN: { sent: '₦480,000',    received: '₦2,050,000',   txnCount: 118 },
  GBP: { sent: '£320.00',     received: '£680.00',      txnCount: 14  },
  EUR: { sent: '€200.00',     received: '€510.00',      txnCount: 9   },
};

/* ─── Helpers ────────────────────────────────────────────────────── */
function fmtBalance(w: Wallet, hidden: boolean) {
  if (hidden) return `${w.symbol}••••••`;
  return `${w.symbol}${w.balance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ─── Wallet Card ────────────────────────────────────────────────── */
function WalletCard({ wallet, active, hidden, onClick }: {
  wallet: Wallet;
  active: boolean;
  hidden: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`wlt-card${active ? ' wlt-card--active' : ''}`}
      type="button"
      onClick={onClick}
    >
      <div className="wlt-card__top">
        <span className="wlt-card__flag">{wallet.flag}</span>
        {wallet.isPrimary && <span className="wlt-card__primary-badge">Primary</span>}
      </div>
      <p className="wlt-card__currency">{wallet.currency} Wallet</p>
      <p className="wlt-card__balance">{fmtBalance(wallet, hidden)}</p>
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function WalletPage() {
  const navigate                      = useNavigate();
  const { activeWallet, setActiveWallet } = useWallet();
  const [hidden, setHidden]           = useState(false);
  const [activeTab, setActiveTab]     = useState<'transactions' | 'stats'>('transactions');

  const wallet   = activeWallet;
  const txns     = TXN_MAP[wallet.currency] ?? [];
  const stats    = STATS_MAP[wallet.currency]!;

  function selectWallet(w: Wallet) {
    setActiveWallet(w);
  }

  return (
    <AppShell title="Wallets" subtitle="Manage all your currency wallets.">
      <div className="wlt-page">

        {/* ── Wallet cards row ── */}
        <div className="wlt-cards-row">
          {ALL_WALLETS.map((w) => (
            <WalletCard
              key={w.currency}
              wallet={w}
              active={w.currency === wallet.currency}
              hidden={hidden}
              onClick={() => selectWallet(w)}
            />
          ))}
        </div>

        {/* ── Active wallet hero ── */}
        <div className="wlt-hero">
          <div className="wlt-hero__left">
            <div className="wlt-hero__flag-wrap">
              <span className="wlt-hero__flag">{wallet.flag}</span>
            </div>
            <div>
              <p className="wlt-hero__label">{wallet.currency} Wallet</p>
              <p className="wlt-hero__balance">
                {fmtBalance(wallet, hidden)}
              </p>
              {wallet.isPrimary && <span className="wlt-hero__primary">Primary wallet</span>}
            </div>
          </div>
          <button
            className="wlt-hero__eye"
            type="button"
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
            onClick={() => setHidden((h) => !h)}
          >
            <EyeIcon size={18} color={hidden ? '#aaa' : 'var(--color-ink)'} />
          </button>
        </div>

        {/* ── Quick actions ── */}
        <div className="wlt-actions">
          {[
            { label: 'Send',     icon: <SendIcon    size={20} color="#fff" />, action: () => {} },
            { label: 'Deposit',  icon: <DepositIcon size={20} color="#fff" />, action: () => {} },
            { label: 'Exchange', icon: <ExchangeIcon size={20} color="#fff" />, action: () => navigate('/exchange') },
            { label: 'Receive',  icon: <ReceiveIcon size={20} color="#fff" />, action: () => {} },
          ].map(({ label, icon, action }) => (
            <button key={label} className="wlt-action-btn" type="button" onClick={action}>
              <span className="wlt-action-btn__icon">{icon}</span>
              <span className="wlt-action-btn__label">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Stats strip ── */}
        <div className="wlt-stats">
          <div className="wlt-stat">
            <ArrowUpRightIcon size={14} color="#e5403a" />
            <div>
              <p className="wlt-stat__label">Total Sent</p>
              <p className="wlt-stat__value">{hidden ? '••••' : stats.sent}</p>
            </div>
          </div>
          <div className="wlt-stat__divider" />
          <div className="wlt-stat">
            <ArrowDownLeftIcon size={14} color="#16a34a" />
            <div>
              <p className="wlt-stat__label">Total Received</p>
              <p className="wlt-stat__value">{hidden ? '••••' : stats.received}</p>
            </div>
          </div>
          <div className="wlt-stat__divider" />
          <div className="wlt-stat">
            <div>
              <p className="wlt-stat__label">Transactions</p>
              <p className="wlt-stat__value">{stats.txnCount}</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="wlt-tabs">
          {(['transactions', 'stats'] as const).map((t) => (
            <button
              key={t}
              className={`wlt-tab${activeTab === t ? ' wlt-tab--active' : ''}`}
              type="button"
              onClick={() => setActiveTab(t)}
            >
              {t === 'transactions' ? 'Transactions' : 'Overview'}
            </button>
          ))}
        </div>

        {/* ── Transaction list ── */}
        {activeTab === 'transactions' && (
          <div className="wlt-txn-list">
            {txns.length === 0 ? (
              <p className="wlt-empty">No transactions yet.</p>
            ) : txns.map((txn) => (
              <div key={txn.id} className="wlt-txn-item">
                <div className={`wlt-txn-item__icon ${txn.isCredit ? 'wlt-txn-item__icon--credit' : 'wlt-txn-item__icon--debit'}`}>
                  {txn.isCredit
                    ? <ArrowDownLeftIcon size={16} color="#16a34a" />
                    : <ArrowUpRightIcon  size={16} color="#e5403a" />}
                </div>
                <div className="wlt-txn-item__body">
                  <p className="wlt-txn-item__title">{txn.title}</p>
                  <p className="wlt-txn-item__sub">{txn.sub} · {txn.date}</p>
                </div>
                <p className={`wlt-txn-item__amount ${txn.isCredit ? 'wlt-txn-item__amount--credit' : 'wlt-txn-item__amount--debit'}`}>
                  {hidden ? '••••' : txn.amount}
                </p>
              </div>
            ))}
            <button
              className="wlt-view-all"
              type="button"
              onClick={() => navigate('/transactions')}
            >
              View all transactions
              <ChevronRightIcon size={14} color="currentColor" />
            </button>
          </div>
        )}

        {/* ── Overview tab ── */}
        {activeTab === 'stats' && (
          <div className="wlt-overview">
            <div className="wlt-overview__card">
              <h3 className="wlt-overview__title">Wallet Summary</h3>
              <div className="wlt-overview__rows">
                {[
                  { label: 'Currency',        value: wallet.currency },
                  { label: 'Current Balance', value: fmtBalance(wallet, hidden) },
                  { label: 'Total Sent',      value: hidden ? '••••' : stats.sent },
                  { label: 'Total Received',  value: hidden ? '••••' : stats.received },
                  { label: 'Transactions',    value: String(stats.txnCount) },
                  { label: 'Wallet Status',   value: 'Active' },
                  { label: 'Primary',         value: wallet.isPrimary ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="wlt-overview__row">
                    <span className="wlt-overview__row-label">{label}</span>
                    <span className="wlt-overview__row-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="wlt-overview__card">
              <h3 className="wlt-overview__title">Quick Links</h3>
              {[
                { label: 'View Transactions',    action: () => navigate('/transactions')  },
                { label: 'Exchange Currency',    action: () => navigate('/exchange')      },
                { label: 'Beneficiaries',        action: () => navigate('/beneficiaries') },
                { label: 'Deposit Banks',        action: () => navigate('/deposit-banks') },
                { label: 'Account Statements',   action: () => navigate('/transactions')  },
              ].map(({ label, action }) => (
                <button key={label} className="wlt-overview__link" type="button" onClick={action}>
                  <span>{label}</span>
                  <ChevronRightIcon size={14} color="#bbb" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
