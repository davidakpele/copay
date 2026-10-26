import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppShell from '../components/AppShell';

/* ─── Mock data ─────────────────────────────────────────────────── */
const USER = {
  fullName:   'Ada Okafor',
  email:      'ada.okafor@email.com',
  phone:      '+234 803 456 7890',
  dob:        'March 12, 1992',
  gender:     'Female',
  address:    '12 Victoria Island, Lagos',
  country:    'Nigeria',
  city:       'Lagos',
  customerId: '#COP-00284719',
  status:     'Active' as 'Active' | 'Suspended' | 'Pending',
  kycLevel:   2,
};

const KYC_DOCS = [
  { id: '1', type: 'Government Issued Passport',       verifiedOn: 'Oct 14, 2025', status: 'verified' },
  { id: '2', type: 'Proof of Address (Utility Bill)',   verifiedOn: 'Oct 15, 2025', status: 'verified' },
];

const LOGIN_HISTORY = [
  { id: '1', device: 'iPhone 15 Pro', browser: 'Chrome',  location: 'Lagos, NG',    time: '2 mins ago'  },
  { id: '2', device: 'MacBook Pro',   browser: 'Safari',  location: 'New York, US', time: '2 days ago'  },
  { id: '3', device: 'iPhone 15 Pro', browser: 'App',     location: 'London, UK',   time: '1 week ago'  },
];

/* ─── Icons (inline to avoid import sprawl) ─────────────────────── */
function UserSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function KeySvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M11.8 11.2L21 2M19 4l2 2M15 8l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function ShieldSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l7 4v5c0 5-3.5 9-7 10C8.5 20 5 16 5 11V6l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MonitorSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function PhoneSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>
  );
}
function FileSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function CheckSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function AlertSvg({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Modal ─────────────────────────────────────────────────────── */
function Modal({ title, body, icon, iconClass, actions, onClose }: {
  title: string; body: string; icon: React.ReactNode; iconClass: string;
  actions: React.ReactNode; onClose: () => void;
}) {
  return (
    <div className="up-modal-overlay" onClick={onClose}>
      <div className="up-modal" onClick={(e) => e.stopPropagation()}>
        <div className="up-modal__content">
          <div className={`up-modal__icon ${iconClass}`}>{icon}</div>
          <h3 className="up-modal__title">{title}</h3>
          <p className="up-modal__body">{body}</p>
          <div className="up-modal__actions">{actions}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const navigate = useNavigate();

  const [isEditing,         setIsEditing]         = useState(false);
  const [showDeactivate,    setShowDeactivate]     = useState(false);
  const [showResetPwd,      setShowResetPwd]       = useState(false);
  const [show2FA,           setShow2FA]            = useState(false);
  const [loadingDoc,        setLoadingDoc]         = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: USER.fullName.split(' ')[0],
    lastName:  USER.fullName.split(' ')[1] ?? '',
    email:     USER.email,
    phone:     USER.phone,
    gender:    USER.gender.toLowerCase(),
    dob:       '1992-03-12',
    address:   USER.address,
    country:   USER.country,
    city:      USER.city,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleViewDoc(id: string) {
    setLoadingDoc(id);
    setTimeout(() => setLoadingDoc(null), 1500);
  }

  const statusClass = USER.status.toLowerCase();

  return (
    <AppShell title="Profile" subtitle="Manage your personal information and preferences.">
      <div className="up-container">

        {/* ── Back ── */}
        <div className="up-header">
          <button className="up-back-btn" type="button" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>

        {/* ── Info card ── */}
        <div className="up-info-card">
          <div className="up-info-card__left">
            <div className="up-avatar">
              <svg viewBox="0 0 80 80" fill="none" width="80" height="80" aria-hidden="true">
                <circle cx="40" cy="40" r="40" fill="#e8e0d8"/>
                <circle cx="40" cy="30" r="14" fill="#c4a882"/>
                <ellipse cx="40" cy="68" rx="24" ry="16" fill="#c4a882"/>
              </svg>
            </div>
            <div className="up-info-card__basic">
              <div className="up-info-card__name-row">
                <h1 className="up-info-card__name">{USER.fullName}</h1>
                <span className={`up-status-badge up-status-badge--${statusClass}`}>{USER.status}</span>
                <span className="up-kyc-badge">
                  <CheckSvg /> KYC Level {USER.kycLevel}
                </span>
              </div>
              <p className="up-info-card__id">Customer ID: {USER.customerId}</p>
            </div>
          </div>
          <div className="up-info-card__actions">
            <button className="up-btn-secondary" type="button" onClick={() => setShowDeactivate(true)}>
              Request Deactivation
            </button>
            {!isEditing && (
              <button className="up-btn-primary" type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="up-content">

          {/* ── Main ── */}
          <div className="up-main">

            {/* Personal Information */}
            <div className="up-section">
              <div className="up-section__header">
                <UserSvg />
                <h2>{isEditing ? 'Edit Personal Information' : 'Personal Information'}</h2>
              </div>

              {isEditing ? (
                <>
                  <div className="up-form-grid">
                    {([
                      { name: 'firstName', label: 'First Name',    type: 'text'  },
                      { name: 'lastName',  label: 'Last Name',     type: 'text'  },
                      { name: 'email',     label: 'Email Address', type: 'email' },
                      { name: 'phone',     label: 'Phone Number',  type: 'tel'   },
                      { name: 'dob',       label: 'Date of Birth', type: 'date'  },
                      { name: 'address',   label: 'Address',       type: 'text'  },
                      { name: 'country',   label: 'Country',       type: 'text'  },
                      { name: 'city',      label: 'City',          type: 'text'  },
                    ] as { name: keyof typeof form; label: string; type: string }[]).map(({ name, label, type }) => (
                      <div key={name} className="up-form-group">
                        <label htmlFor={`up-${name}`}>{label}</label>
                        <input
                          id={`up-${name}`}
                          type={type}
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
                    <div className="up-form-group">
                      <label htmlFor="up-gender">Gender</label>
                      <select id="up-gender" name="gender" value={form.gender} onChange={handleChange} className="up-select">
                        <option value="">-- Select --</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="up-form-actions">
                    <button className="up-btn-ghost" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className="up-btn-primary" type="button" onClick={() => setIsEditing(false)}>Save Changes</button>
                  </div>
                </>
              ) : (
                <div className="up-info-grid">
                  {[
                    { label: 'Full Name',     value: USER.fullName   },
                    { label: 'Email',         value: USER.email      },
                    { label: 'Phone',         value: USER.phone      },
                    { label: 'Date of Birth', value: USER.dob        },
                    { label: 'Gender',        value: USER.gender     },
                    { label: 'Address',       value: USER.address    },
                    { label: 'Country',       value: USER.country    },
                    { label: 'City',          value: USER.city       },
                  ].map(({ label, value }) => (
                    <div key={label} className="up-info-item">
                      <label>{label}</label>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KYC Documents */}
            <div className="up-section">
              <div className="up-section__header">
                <FileSvg />
                <h2>KYC Documents</h2>
              </div>
              <div className="up-docs-list">
                {KYC_DOCS.map((doc) => (
                  <div key={doc.id} className="up-doc-item">
                    <div className="up-doc-item__icon"><FileSvg /></div>
                    <div className="up-doc-item__info">
                      <h3>{doc.type}</h3>
                      <p>Verified on {doc.verifiedOn}</p>
                    </div>
                    <button
                      className="up-btn-view"
                      type="button"
                      onClick={() => handleViewDoc(doc.id)}
                    >
                      {loadingDoc === doc.id ? 'Loading…' : 'View'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="up-sidebar">

            {/* Security */}
            <div className="up-sidebar-section">
              <h2 className="up-sidebar-section__title">Security</h2>
              <div className="up-security-actions">
                <button className="up-security-btn" type="button" onClick={() => setShowResetPwd(true)}>
                  <KeySvg />
                  Reset Password
                </button>
                <button className="up-security-btn" type="button" onClick={() => setShow2FA(true)}>
                  <ShieldSvg />
                  Enable 2FA
                </button>
                <button className="up-security-btn up-security-btn--danger" type="button" onClick={() => setShowDeactivate(true)}>
                  <AlertSvg size={20} />
                  Request Deactivation
                </button>
              </div>
            </div>

            {/* Login History */}
            <div className="up-sidebar-section">
              <h2 className="up-sidebar-section__title">Login History</h2>
              <div className="up-login-list">
                {LOGIN_HISTORY.map((h) => (
                  <div key={h.id} className="up-login-item">
                    <div className="up-login-item__icon">
                      {h.device.includes('iPhone') ? <PhoneSvg /> : <MonitorSvg />}
                    </div>
                    <div className="up-login-item__info">
                      <h4>{h.device} · {h.browser}</h4>
                      <p>{h.location} · {h.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* ── Deactivation modal ── */}
      {showDeactivate && (
        <Modal
          title="Request Deactivation"
          body="Are you sure you want to request account deactivation? This action will be reviewed by our team."
          icon={<AlertSvg />}
          iconClass="up-modal__icon--warning"
          onClose={() => setShowDeactivate(false)}
          actions={
            <>
              <button className="up-modal__btn up-modal__btn--ghost" type="button" onClick={() => setShowDeactivate(false)}>Cancel</button>
              <button className="up-modal__btn up-modal__btn--primary" type="button" onClick={() => setShowDeactivate(false)}>Confirm</button>
            </>
          }
        />
      )}

      {/* ── Reset password modal ── */}
      {showResetPwd && (
        <Modal
          title="Reset Password"
          body="A password reset link will be sent to ada.okafor@email.com. Check your inbox to continue."
          icon={<KeySvg />}
          iconClass="up-modal__icon--primary"
          onClose={() => setShowResetPwd(false)}
          actions={
            <>
              <button className="up-modal__btn up-modal__btn--ghost" type="button" onClick={() => setShowResetPwd(false)}>Cancel</button>
              <button className="up-modal__btn up-modal__btn--primary" type="button" onClick={() => setShowResetPwd(false)}>Send Link</button>
            </>
          }
        />
      )}

      {/* ── 2FA modal ── */}
      {show2FA && (
        <Modal
          title="Enable Two-Factor Authentication"
          body="2FA adds an extra layer of security to your account. You'll receive a code via SMS on every login."
          icon={<ShieldSvg />}
          iconClass="up-modal__icon--primary"
          onClose={() => setShow2FA(false)}
          actions={
            <>
              <button className="up-modal__btn up-modal__btn--ghost" type="button" onClick={() => setShow2FA(false)}>Cancel</button>
              <button className="up-modal__btn up-modal__btn--primary" type="button" onClick={() => setShow2FA(false)}>Enable</button>
            </>
          }
        />
      )}
    </AppShell>
  );
}
