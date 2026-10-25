import { useState } from 'react';
import AppShell from '../components/AppShell';
import { UserIcon, BellIcon, WalletIcon, ChevronRightIcon } from '../components/Icons';

type SettingsTab = 'profile' | 'app' | 'notifications' | 'wallet';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',       icon: <UserIcon   size={16} color="currentColor" /> },
  { id: 'app',           label: 'App',            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="15" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="2" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="15" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg> },
  { id: 'notifications', label: 'Notifications',  icon: <BellIcon   size={16} color="currentColor" /> },
  { id: 'wallet',        label: 'Wallet',         icon: <WalletIcon size={16} color="currentColor" /> },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`settings-toggle${checked ? ' settings-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-toggle__thumb" />
    </button>
  );
}

function SettingsRow({
  label, sub, children
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-row">
      <div className="settings-row__text">
        <span className="settings-row__label">{label}</span>
        {sub && <span className="settings-row__sub">{sub}</span>}
      </div>
      <div className="settings-row__control">{children}</div>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="settings-group">
      <h3 className="settings-group__title">{title}</h3>
      <div className="settings-group__body">{children}</div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="settings-tab-content">
      <SettingsGroup title="Personal Details">
        <SettingsRow label="Full Name" sub="Ada Okafor">
          <button className="settings-edit-btn" type="button">Edit</button>
        </SettingsRow>
        <SettingsRow label="Email Address" sub="ada.okafor@email.com">
          <button className="settings-edit-btn" type="button">Edit</button>
        </SettingsRow>
        <SettingsRow label="Phone Number" sub="+234 803 456 7890">
          <button className="settings-edit-btn" type="button">Edit</button>
        </SettingsRow>
        <SettingsRow label="Date of Birth" sub="March 12, 1992">
          <button className="settings-edit-btn" type="button">Edit</button>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Security">
        <SettingsRow label="Change Password" sub="Last changed 3 months ago">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
        <SettingsRow label="Two-Factor Authentication" sub="Enabled via SMS">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
        <SettingsRow label="Login Activity" sub="View recent sessions">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Verification">
        <SettingsRow label="KYC Status" sub="Identity fully verified">
          <span className="settings-badge settings-badge--green">Verified</span>
        </SettingsRow>
        <SettingsRow label="BVN Linked" sub="Bank Verification Number on file">
          <span className="settings-badge settings-badge--green">Linked</span>
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
}

function AppTab() {
  const [darkMode, setDarkMode]         = useState(false);
  const [compactView, setCompactView]   = useState(false);
  const [biometrics, setBiometrics]     = useState(true);
  const [autoLock, setAutoLock]         = useState(true);
  const [language, setLanguage]         = useState('English');
  const [currency, setCurrency]         = useState('USD');

  return (
    <div className="settings-tab-content">
      <SettingsGroup title="Appearance">
        <SettingsRow label="Dark Mode" sub="Switch to dark theme">
          <Toggle checked={darkMode} onChange={setDarkMode} />
        </SettingsRow>
        <SettingsRow label="Compact View" sub="Show more content on screen">
          <Toggle checked={compactView} onChange={setCompactView} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Security">
        <SettingsRow label="Biometric Login" sub="Use fingerprint or Face ID">
          <Toggle checked={biometrics} onChange={setBiometrics} />
        </SettingsRow>
        <SettingsRow label="Auto Lock" sub="Lock app after 2 minutes of inactivity">
          <Toggle checked={autoLock} onChange={setAutoLock} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Preferences">
        <SettingsRow label="Language" sub={language}>
          <select
            className="settings-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>French</option>
            <option>Yoruba</option>
            <option>Igbo</option>
            <option>Hausa</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Display Currency" sub={currency}>
          <select
            className="settings-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option>USD</option>
            <option>NGN</option>
            <option>GBP</option>
            <option>EUR</option>
          </select>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="About">
        <SettingsRow label="App Version" sub="v1.0.0">
          <span className="settings-badge settings-badge--gray">Latest</span>
        </SettingsRow>
        <SettingsRow label="Terms of Service" sub="">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
        <SettingsRow label="Privacy Policy" sub="">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
}

function NotificationsTab() {
  const [push, setPush]           = useState(true);
  const [email, setEmail]         = useState(true);
  const [sms, setSms]             = useState(false);
  const [transfers, setTransfers] = useState(true);
  const [bills, setBills]         = useState(true);
  const [airtime, setAirtime]     = useState(false);
  const [security, setSecurity]   = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [digest, setDigest]       = useState(true);

  return (
    <div className="settings-tab-content">
      <SettingsGroup title="Channels">
        <SettingsRow label="Push Notifications" sub="Alerts on your device">
          <Toggle checked={push} onChange={setPush} />
        </SettingsRow>
        <SettingsRow label="Email Notifications" sub="Sent to ada.okafor@email.com">
          <Toggle checked={email} onChange={setEmail} />
        </SettingsRow>
        <SettingsRow label="SMS Notifications" sub="Sent to +234 803 456 7890">
          <Toggle checked={sms} onChange={setSms} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Activity Alerts">
        <SettingsRow label="Transfers" sub="Sent and received money alerts">
          <Toggle checked={transfers} onChange={setTransfers} />
        </SettingsRow>
        <SettingsRow label="Bill Payments" sub="Successful payment confirmations">
          <Toggle checked={bills} onChange={setBills} />
        </SettingsRow>
        <SettingsRow label="Airtime Purchases" sub="Airtime purchase receipts">
          <Toggle checked={airtime} onChange={setAirtime} />
        </SettingsRow>
        <SettingsRow label="Security Alerts" sub="Login attempts and device changes">
          <Toggle checked={security} onChange={setSecurity} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Marketing">
        <SettingsRow label="Promotional Offers" sub="Tips, offers and product updates">
          <Toggle checked={marketing} onChange={setMarketing} />
        </SettingsRow>
        <SettingsRow label="Weekly Digest" sub="Summary of your account activity">
          <Toggle checked={digest} onChange={setDigest} />
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
}

function WalletTab() {
  const [autoConvert, setAutoConvert] = useState(false);
  const [lowBalance, setLowBalance]   = useState(true);
  const [spendLimit, setSpendLimit]   = useState(false);

  const wallets = [
    { currency: 'USD', flag: '🇺🇸', balance: '$2,450.00',       primary: true  },
    { currency: 'NGN', flag: '🇳🇬', balance: '₦1,280,500.00',   primary: false },
    { currency: 'GBP', flag: '🇬🇧', balance: '£320.00',         primary: false },
    { currency: 'EUR', flag: '🇪🇺', balance: '€410.00',         primary: false },
  ];

  return (
    <div className="settings-tab-content">
      <SettingsGroup title="Your Wallets">
        <div className="settings-wallet-list">
          {wallets.map((w) => (
            <div key={w.currency} className="settings-wallet-item">
              <span className="settings-wallet-item__flag">{w.flag}</span>
              <div className="settings-wallet-item__info">
                <span className="settings-wallet-item__currency">{w.currency}</span>
                {w.primary && <span className="settings-badge settings-badge--dark">Primary</span>}
              </div>
              <span className="settings-wallet-item__balance">{w.balance}</span>
              <button className="settings-edit-btn" type="button">Manage</button>
            </div>
          ))}
        </div>
        <button className="settings-add-wallet-btn" type="button">+ Add New Wallet</button>
      </SettingsGroup>

      <SettingsGroup title="Wallet Preferences">
        <SettingsRow label="Auto Currency Conversion" sub="Convert to primary currency on receive">
          <Toggle checked={autoConvert} onChange={setAutoConvert} />
        </SettingsRow>
        <SettingsRow label="Low Balance Alert" sub="Alert when balance drops below $50">
          <Toggle checked={lowBalance} onChange={setLowBalance} />
        </SettingsRow>
        <SettingsRow label="Spending Limit" sub="Set a daily transaction limit">
          <Toggle checked={spendLimit} onChange={setSpendLimit} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Linked Accounts">
        <SettingsRow label="Bank Accounts" sub="2 accounts linked">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
        <SettingsRow label="Debit / Credit Cards" sub="2 cards on file">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
        <SettingsRow label="Transfer Limits" sub="View and update limits">
          <ChevronRightIcon size={16} color="#bbb" />
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
}

const tabContent: Record<SettingsTab, React.ReactNode> = {
  profile:       <ProfileTab />,
  app:           <AppTab />,
  notifications: <NotificationsTab />,
  wallet:        <WalletTab />,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <AppShell title="Settings" subtitle="Manage your account, preferences and security.">
      <div className="settings-page">
        <div className="settings-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`settings-tab-btn${activeTab === t.id ? ' settings-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="settings-tab-btn__icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="settings-tab-panel">
          {tabContent[activeTab]}
        </div>
      </div>
    </AppShell>
  );
}
