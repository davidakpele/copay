import AppShell from '../components/AppShell';
import { VerifiedIcon, UserIcon, BellIcon, CardIcon, WalletIcon, ChevronRightIcon } from '../components/Icons';

const stats = [
  { label: 'Total Sent',     value: '$12,400' },
  { label: 'Total Received', value: '$31,800' },
  { label: 'Transactions',   value: '284'     },
  { label: 'Active Wallets', value: '4'       },
];

const infoFields = [
  { label: 'Full Name',     value: 'Ada Okafor'          },
  { label: 'Email',         value: 'ada.okafor@email.com' },
  { label: 'Phone',         value: '+234 803 456 7890'    },
  { label: 'Date of Birth', value: 'March 12, 1992'       },
  { label: 'Country',       value: 'Nigeria'               },
  { label: 'Currency',      value: 'USD (Primary)'         },
];

const quickLinks = [
  { icon: <WalletIcon size={18} color="#555" />, label: 'Manage Wallets',       sub: 'View and switch currencies'     },
  { icon: <CardIcon   size={18} color="#555" />, label: 'Linked Cards',          sub: '2 cards connected'              },
  { icon: <BellIcon   size={18} color="#555" />, label: 'Notification Settings', sub: 'Manage your alert preferences' },
  { icon: <UserIcon   size={18} color="#555" />, label: 'KYC Verification',      sub: 'Identity verified'              },
];

export default function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="Manage your personal information and preferences.">
      <div className="profile-page">

        <div className="profile-hero">
          <div className="profile-hero__avatar-wrap">
            <div className="profile-hero__avatar" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                <circle cx="40" cy="40" r="40" fill="#e8e0d8" />
                <circle cx="40" cy="30" r="14" fill="#c4a882" />
                <ellipse cx="40" cy="68" rx="24" ry="16" fill="#c4a882" />
              </svg>
            </div>
            <button className="profile-hero__avatar-edit" type="button" aria-label="Change photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="profile-hero__info">
            <div className="profile-hero__name-row">
              <h2 className="profile-hero__name">Ada Okafor</h2>
              <span className="profile-hero__verified">
                <VerifiedIcon size={13} color="#3b82f6" />
                Verified
              </span>
            </div>
            <p className="profile-hero__email">ada.okafor@email.com</p>
            <p className="profile-hero__id">Account ID: COP-00284719</p>
          </div>
          <button className="profile-hero__edit-btn" type="button">Edit Profile</button>
        </div>

        <div className="profile-stats">
          {stats.map((s) => (
            <div key={s.label} className="profile-stat">
              <p className="profile-stat__value">{s.value}</p>
              <p className="profile-stat__label">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="profile-section">
          <div className="profile-section__header">
            <h3 className="profile-section__title">Personal Information</h3>
            <button className="profile-section__edit" type="button">Edit</button>
          </div>
          <div className="profile-fields">
            {infoFields.map((f) => (
              <div key={f.label} className="profile-field">
                <span className="profile-field__label">{f.label}</span>
                <span className="profile-field__value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3 className="profile-section__title">Account</h3>
          <ul className="profile-links">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <button className="profile-link-item" type="button">
                  <span className="profile-link-item__icon">{item.icon}</span>
                  <div className="profile-link-item__body">
                    <span className="profile-link-item__label">{item.label}</span>
                    <span className="profile-link-item__sub">{item.sub}</span>
                  </div>
                  <ChevronRightIcon size={16} color="#ccc" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="profile-danger-zone">
          <h3 className="profile-section__title">Danger Zone</h3>
          <div className="profile-danger-zone__actions">
            <button className="profile-danger-btn profile-danger-btn--outline" type="button">
              Deactivate Account
            </button>
            <button className="profile-danger-btn profile-danger-btn--fill" type="button">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
