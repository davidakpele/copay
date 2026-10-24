import {
  SendIcon,
  ReceiveIcon,
  AirtimeIcon,
  LightningIcon,
  ChevronRightIcon,
  GlobeIcon,
} from './Icons';

const walletOverview = [
  { currency: 'USD', flag: '🇺🇸', amount: '$2,450.00' },
  { currency: 'NGN', flag: '🇳🇬', amount: '₦1,280,500.00' },
  { currency: 'GBP', flag: '🇬🇧', amount: '£320.00' },
  { currency: 'EUR', flag: '🇪🇺', amount: '€410.00' },
];

const quickActions = [
  { label: 'Send Money',     icon: <SendIcon      size={20} color="#fff" /> },
  { label: 'Receive Money',  icon: <ReceiveIcon   size={20} color="#fff" /> },
  { label: 'Buy Airtime',    icon: <AirtimeIcon   size={20} color="#fff" /> },
  { label: 'Pay Bills',      icon: <LightningIcon size={20} color="#fff" /> },
];

export default function RightPanel() {
  return (
    <aside className="right-panel">
      <section className="rp-section">
        <h2 className="rp-section__title">Quick Actions</h2>
        <div className="rp-quick-grid">
          {quickActions.map((action) => (
            <button key={action.label} className="rp-quick-item" type="button">
              <span className="rp-quick-item__icon">{action.icon}</span>
              <span className="rp-quick-item__label">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rp-section">
        <div className="rp-section__header">
          <h2 className="rp-section__title">Wallet Overview</h2>
          <button className="rp-view-all" type="button">View all</button>
        </div>
        <ul className="rp-wallet-list">
          {walletOverview.map((w) => (
            <li key={w.currency} className="rp-wallet-item">
              <span className="rp-wallet-item__flag">{w.flag}</span>
              <span className="rp-wallet-item__currency">{w.currency}</span>
              <span className="rp-wallet-item__amount">{w.amount}</span>
              <ChevronRightIcon size={15} color="#bbb" />
            </li>
          ))}
        </ul>
      </section>

      <div className="rp-promo-card">
        <div className="rp-promo-card__icon" aria-hidden="true">
          <GlobeIcon size={32} color="rgba(255,255,255,0.6)" />
        </div>
        <p className="rp-promo-card__title">Manage multiple currencies with ease.</p>
        <p className="rp-promo-card__sub">
          Switch between your wallets, transfer, and make payments in your preferred currency.
        </p>
        <button className="rp-promo-card__btn" type="button">
          View Wallets
          <ChevronRightIcon size={14} color="#111" />
        </button>
      </div>
    </aside>
  );
}
