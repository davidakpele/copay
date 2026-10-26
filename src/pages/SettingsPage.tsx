import { useState, useRef } from 'react';
import AppShell from '../components/AppShell';

/* ─── Types ─────────────────────────────────────────────────────── */
type Tab = 'profile' | 'security' | 'notifications' | 'preferences' | 'pin';

/* ─── Inline icons ───────────────────────────────────────────────── */
function UserSvg()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function ShieldSvg() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l7 4v5c0 5-3.5 9-7 10C8.5 20 5 16 5 11V6l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>; }
function BellSvg()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function GlobeSvg()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" strokeWidth="1.8"/></svg>; }
function KeySvg()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M11.8 11.2L21 2M19 4l2 2M15 8l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function CameraSvg() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>; }
function TrashSvg()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function LockSvg()   { return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function WarnSvg()   { return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }

/* ─── Shared primitives ─────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`st-toggle${on ? ' st-toggle--on' : ''}`}
      onClick={() => onChange(!on)}
    >
      <span className="st-toggle__thumb" />
    </button>
  );
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="st-row">
      <div className="st-row__text">
        <span className="st-row__label">{label}</span>
        {sub && <span className="st-row__sub">{sub}</span>}
      </div>
      <div className="st-row__control">{children}</div>
    </div>
  );
}

function Card({ icon, title, desc, children }: {
  icon: React.ReactNode; title: string; desc?: string; children?: React.ReactNode;
}) {
  return (
    <div className="st-card">
      <div className="st-card__header">
        <span className="st-card__icon">{icon}</span>
        <h3 className="st-card__title">{title}</h3>
      </div>
      {desc && <p className="st-card__desc">{desc}</p>}
      {children}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="st-section">
      <div className="st-section__header">
        <h2 className="st-section__title">{title}</h2>
        {subtitle && <p className="st-section__sub">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── Modal ─────────────────────────────────────────────────────── */
function Modal({ icon, iconCls, title, body, actions, onClose }: {
  icon: React.ReactNode; iconCls: string; title: string; body: string;
  actions: React.ReactNode; onClose: () => void;
}) {
  return (
    <div className="st-modal-overlay" onClick={onClose}>
      <div className="st-modal" onClick={(e) => e.stopPropagation()}>
        <div className="st-modal__content">
          <div className={`st-modal__icon ${iconCls}`}>{icon}</div>
          <h3 className="st-modal__title">{title}</h3>
          <p className="st-modal__body">{body}</p>
          <div className="st-modal__actions">{actions}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── PIN input ─────────────────────────────────────────────────── */
function PinBoxes({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    if (!ch) return;
    const arr = value.split('');
    arr[i] = ch;
    onChange(arr.join('').slice(0, 4));
    if (i < 3) refs.current[i + 1]?.focus();
  }
  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      const arr = value.split('');
      if (arr[i]) { arr[i] = ''; onChange(arr.join('')); }
      else if (i > 0) { refs.current[i - 1]?.focus(); arr[i - 1] = ''; onChange(arr.join('')); }
    }
  }
  return (
    <div className="st-pin-block">
      <span className="st-pin-block__label">{label}</span>
      <div className="st-pin-inputs">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className="st-pin-input"
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKey(i, e)}
            aria-label={`${label} digit ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Profile tab ────────────────────────────────────────────────── */
function ProfileTab() {
  const [form, setForm] = useState({
    firstName: 'Ada', lastName: 'Okafor', gender: 'female',
    phone: '+234 803 456 7890', dob: '1992-03-12', email: 'ada.okafor@email.com',
  });
  function ch(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  return (
    <div className="st-content">
      <Section title="Profile Settings" subtitle="Update your personal information and photo.">

        {/* Avatar row */}
        <div className="st-avatar-row">
          <div className="st-avatar-wrap">
            <svg viewBox="0 0 100 100" fill="none" width="100" height="100" className="st-avatar" aria-hidden="true">
              <circle cx="50" cy="50" r="50" fill="#e8e0d8"/>
              <circle cx="50" cy="38" r="17" fill="#c4a882"/>
              <ellipse cx="50" cy="84" rx="29" ry="19" fill="#c4a882"/>
            </svg>
            <button className="st-avatar-upload" type="button" aria-label="Upload photo">
              <CameraSvg />
            </button>
          </div>
          <div>
            <h3 className="st-avatar-name">Ada Okafor</h3>
            <p className="st-avatar-hint">JPG, PNG or GIF. Max 2MB.</p>
            <div className="st-avatar-btns">
              <button className="st-btn-secondary" type="button">Upload Photo</button>
              <button className="st-btn-text" type="button">Remove</button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="st-form-grid">
          {([
            { name: 'firstName', label: 'First Name',    type: 'text'  },
            { name: 'lastName',  label: 'Last Name',     type: 'text'  },
            { name: 'email',     label: 'Email Address', type: 'email' },
            { name: 'phone',     label: 'Phone Number',  type: 'tel'   },
            { name: 'dob',       label: 'Date of Birth', type: 'date'  },
          ] as { name: keyof typeof form; label: string; type: string }[]).map(({ name, label, type }) => (
            <div key={name} className="st-form-group">
              <label htmlFor={`st-${name}`}>{label}</label>
              <input id={`st-${name}`} type={type} name={name} value={form[name]} onChange={ch} />
            </div>
          ))}
          <div className="st-form-group">
            <label htmlFor="st-gender">Gender</label>
            <select id="st-gender" name="gender" value={form.gender} onChange={ch} className="st-select">
              <option value="">-- Select --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Profile info cards */}
        <div className="st-info-header">
          <h3 className="st-info-title">Account Information</h3>
          <span className="st-info-badge">Verified</span>
        </div>
        <div className="st-info-cards">
          {[
            { icon: '👤', label: 'Username',    value: '@ada.okafor'        },
            { icon: '🆔', label: 'Customer ID', value: '#COP-00284719'      },
            { icon: '📅', label: 'Member Since', value: 'January 2023'      },
            { icon: '🌍', label: 'Country',      value: 'Nigeria'            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="st-info-card">
              <div className="st-info-card__icon">{icon}</div>
              <div>
                <p className="st-info-card__label">{label}</p>
                <p className="st-info-card__value">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="st-form-actions">
          <button className="st-btn-secondary" type="button">Cancel</button>
          <button className="st-btn-primary" type="button">Save Changes</button>
        </div>
      </Section>
    </div>
  );
}

/* ─── Security tab ───────────────────────────────────────────────── */
function SecurityTab() {
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [twoFA,        setTwoFA]        = useState(false);
  const [biometric,    setBiometric]    = useState(true);
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' });

  const sessions = [
    { device: 'iPhone 15 Pro',  browser: 'Chrome', location: 'Lagos, NG',    time: '2 mins ago'  },
    { device: 'MacBook Pro',    browser: 'Safari', location: 'New York, US', time: '2 days ago'  },
    { device: 'iPhone 15 Pro',  browser: 'App',    location: 'London, UK',   time: '1 week ago'  },
  ];

  return (
    <div className="st-content">
      <Section title="Security Settings" subtitle="Manage your password, 2FA and active sessions.">

        {/* Password */}
        <Card icon={<KeySvg />} title="Change Password" desc="Keep your account secure with a strong password. Last changed 3 months ago.">
          <button className="st-btn-primary st-btn--inline" type="button" onClick={() => setShowPwdModal(true)}>
            Change Password
          </button>
        </Card>

        {/* Toggles */}
        <Card icon={<ShieldSvg />} title="Authentication">
          <div className="st-toggle-list">
            <Row label="Two-Factor Authentication" sub="Receive a code via SMS on every login">
              <Toggle on={twoFA} onChange={setTwoFA} />
            </Row>
            <Row label="Biometric Login" sub="Use fingerprint or Face ID">
              <Toggle on={biometric} onChange={setBiometric} />
            </Row>
          </div>
        </Card>

        {/* Sessions */}
        <Card icon={<ShieldSvg />} title="Active Sessions" desc="Devices currently signed into your account.">
          <div className="st-sessions">
            {sessions.map((s, i) => (
              <div key={i} className="st-session-item">
                <div className="st-session-item__icon">
                  {s.device.includes('iPhone')
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                </div>
                <div className="st-session-item__info">
                  <h4>{s.device} · {s.browser}</h4>
                  <p>{s.location} · {s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {showPwdModal && (
        <div className="st-modal-overlay" onClick={() => setShowPwdModal(false)}>
          <div className="st-modal st-modal--form" onClick={(e) => e.stopPropagation()}>
            <div className="st-modal__header">
              <h3 className="st-modal__title">Change Password</h3>
              <button className="st-modal__close" type="button" onClick={() => setShowPwdModal(false)} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="st-form-grid st-form-grid--single">
              {([
                { name: 'current', label: 'Current Password' },
                { name: 'new',     label: 'New Password'     },
                { name: 'confirm', label: 'Confirm Password' },
              ] as { name: keyof typeof pwd; label: string }[]).map(({ name, label }) => (
                <div key={name} className="st-form-group">
                  <label>{label}</label>
                  <input
                    type="password"
                    value={pwd[name]}
                    onChange={(e) => setPwd((p) => ({ ...p, [name]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="st-form-actions">
              <button className="st-btn-secondary" type="button" onClick={() => setShowPwdModal(false)}>Cancel</button>
              <button className="st-btn-primary" type="button" onClick={() => setShowPwdModal(false)}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Notifications tab ──────────────────────────────────────────── */
function NotificationsTab() {
  const [s, setS] = useState({
    email: true, push: true, sms: false,
    transfers: true, bills: true, airtime: false, security: true,
    marketing: false, digest: true,
  });
  function tog(k: keyof typeof s) { setS((x) => ({ ...x, [k]: !x[k] })); }

  return (
    <div className="st-content">
      <Section title="Notification Settings" subtitle="Choose how and when you want to be notified.">
        <Card icon={<BellSvg />} title="Channels">
          <div className="st-toggle-list">
            <Row label="Email Notifications"    sub="Sent to ada.okafor@email.com"><Toggle on={s.email}    onChange={() => tog('email')}    /></Row>
            <Row label="Push Notifications"     sub="Alerts on your device">        <Toggle on={s.push}     onChange={() => tog('push')}     /></Row>
            <Row label="SMS Notifications"      sub="Sent to +234 803 456 7890">    <Toggle on={s.sms}      onChange={() => tog('sms')}      /></Row>
          </div>
        </Card>
        <Card icon={<BellSvg />} title="Activity Alerts">
          <div className="st-toggle-list">
            <Row label="Transfers"       sub="Sent and received money alerts">     <Toggle on={s.transfers} onChange={() => tog('transfers')} /></Row>
            <Row label="Bill Payments"   sub="Successful payment confirmations">   <Toggle on={s.bills}     onChange={() => tog('bills')}     /></Row>
            <Row label="Airtime"         sub="Airtime purchase receipts">          <Toggle on={s.airtime}   onChange={() => tog('airtime')}   /></Row>
            <Row label="Security Alerts" sub="Login attempts and device changes">  <Toggle on={s.security}  onChange={() => tog('security')}  /></Row>
          </div>
        </Card>
        <Card icon={<BellSvg />} title="Marketing">
          <div className="st-toggle-list">
            <Row label="Promotional Offers" sub="Tips, offers and product updates">     <Toggle on={s.marketing} onChange={() => tog('marketing')} /></Row>
            <Row label="Weekly Digest"      sub="Summary of your account activity">     <Toggle on={s.digest}    onChange={() => tog('digest')}    /></Row>
          </div>
        </Card>
      </Section>
    </div>
  );
}

/* ─── Preferences tab ────────────────────────────────────────────── */
function PreferencesTab() {
  const [theme,    setTheme]    = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="st-content">
      <Section title="Preferences" subtitle="Customise your app experience.">

        {/* Language + currency */}
        <Card icon={<GlobeSvg />} title="Localisation">
          <div className="st-form-grid">
            <div className="st-form-group">
              <label>Language</label>
              <select className="st-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option>English</option><option>French</option><option>Yoruba</option><option>Igbo</option><option>Hausa</option>
              </select>
            </div>
            <div className="st-form-group">
              <label>Display Currency</label>
              <select className="st-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option>USD</option><option>NGN</option><option>GBP</option><option>EUR</option>
              </select>
            </div>
          </div>
          <div className="st-form-actions">
            <button className="st-btn-primary" type="button">Save Preferences</button>
          </div>
        </Card>
      </Section>
    </div>
  );
}

/* ─── Transfer PIN tab ───────────────────────────────────────────── */
function PinTab() {
  const [hasPin,       setHasPin]       = useState(false);
  const [showCreate,   setShowCreate]   = useState(false);
  const [showChange,   setShowChange]   = useState(false);
  const [newPin,       setNewPin]       = useState('');
  const [confirmPin,   setConfirmPin]   = useState('');
  const [currentPin,   setCurrentPin]   = useState('');

  function handleCreate() {
    if (newPin.length === 4 && newPin === confirmPin) { setHasPin(true); setShowCreate(false); setNewPin(''); setConfirmPin(''); }
  }
  function handleChange2() {
    if (currentPin.length === 4 && newPin.length === 4 && newPin === confirmPin) { setShowChange(false); setCurrentPin(''); setNewPin(''); setConfirmPin(''); }
  }

  return (
    <div className="st-content">
      <Section title="Transfer PIN" subtitle="Set a 4-digit PIN to authorise transfers and payments.">

        {hasPin ? (
          <div className="st-pin-set-banner">
            <div className="st-pin-set-banner__left">
              <span className="st-pin-set-banner__icon">🔒</span>
              <div>
                <p className="st-pin-set-banner__title">Transfer PIN is set</p>
                <p className="st-pin-set-banner__sub">Your PIN is active and required for all transfers.</p>
              </div>
            </div>
            <span className="st-pin-set-badge">Active</span>
          </div>
        ) : (
          <div className="st-pin-notset-banner">
            <span className="st-pin-notset-banner__icon">⚠️</span>
            <div>
              <p className="st-pin-set-banner__title">No Transfer PIN set</p>
              <p className="st-pin-set-banner__sub">You need a PIN to authorise transfers. Set one now.</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-4)' }}>
          {hasPin ? (
            <button className="st-btn-primary" type="button" onClick={() => { setShowChange(true); setShowCreate(false); }}>
              Change PIN
            </button>
          ) : (
            <button className="st-btn-outline" type="button" onClick={() => { setShowCreate(true); setShowChange(false); }}>
              Create PIN
            </button>
          )}
        </div>

        {/* Create PIN form */}
        {showCreate && (
          <div className="st-pin-form-wrap">
            <p className="st-pin-form-title">Create your PIN</p>
            <PinBoxes label="New PIN"     value={newPin}     onChange={setNewPin}     />
            <PinBoxes label="Confirm PIN" value={confirmPin} onChange={setConfirmPin} />
            <div className="st-pin-form-actions">
              <button className="st-btn-secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="st-btn-primary" type="button" onClick={handleCreate} disabled={newPin.length < 4 || newPin !== confirmPin}>
                Save PIN
              </button>
            </div>
          </div>
        )}

        {/* Change PIN form */}
        {showChange && (
          <div className="st-pin-form-wrap">
            <p className="st-pin-form-title">Change your PIN</p>
            <PinBoxes label="Current PIN" value={currentPin} onChange={setCurrentPin} />
            <PinBoxes label="New PIN"     value={newPin}     onChange={setNewPin}     />
            <PinBoxes label="Confirm PIN" value={confirmPin} onChange={setConfirmPin} />
            <div className="st-pin-form-actions">
              <button className="st-btn-secondary" type="button" onClick={() => setShowChange(false)}>Cancel</button>
              <button className="st-btn-primary" type="button" onClick={handleChange2} disabled={currentPin.length < 4 || newPin.length < 4 || newPin !== confirmPin}>
                Update PIN
              </button>
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div className="st-danger-zone">
          <h3>Danger Zone</h3>
          <div className="st-danger-actions">
            <div className="st-danger-item">
              <div>
                <h4>Deactivate Account</h4>
                <p>Temporarily disable your account and stop all transactions.</p>
              </div>
              <button className="st-btn-danger" type="button">Deactivate</button>
            </div>
            <div className="st-danger-item">
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data.</p>
              </div>
              <button className="st-btn-danger" type="button">Delete</button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ─── Tab config ─────────────────────────────────────────────────── */
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',       icon: <UserSvg />   },
  { id: 'security',      label: 'Security',       icon: <KeySvg />    },
  { id: 'notifications', label: 'Notifications',  icon: <BellSvg />   },
  { id: 'preferences',   label: 'Preferences',    icon: <GlobeSvg />  },
  { id: 'pin',           label: 'Transfer PIN',   icon: <LockSvg />   },
];

/* ─── Page ───────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [active, setActive] = useState<Tab>('profile');

  const content: Record<Tab, React.ReactNode> = {
    profile:       <ProfileTab />,
    security:      <SecurityTab />,
    notifications: <NotificationsTab />,
    preferences:   <PreferencesTab />,
    pin:           <PinTab />,
  };

  return (
    <AppShell title="Settings" subtitle="Manage your account, preferences and security.">
      <div className="st-page">

        {/* Title */}
        <div className="st-page-header">
          <h1 className="st-page-title">Settings</h1>
          <p className="st-page-subtitle">Manage your account preferences and security.</p>
        </div>

        {/* Tabs */}
        <div className="st-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`st-tab${active === t.id ? ' st-tab--active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              <span className="st-tab__icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="st-panel">
          {content[active]}
        </div>

      </div>
    </AppShell>
  );
}
