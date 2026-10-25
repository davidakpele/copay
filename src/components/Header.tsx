import { useNavigate } from 'react-router';
import { BellIcon, SettingsIcon, MenuIcon } from './Icons';

interface HeaderProps {
  notifCount: number;
  onBellClick: () => void;
  onMenuClick: () => void;
}

export default function Header({ notifCount, onBellClick, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__user">
        <button
          className="app-header__menu-btn"
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <MenuIcon size={22} color="#111" />
        </button>

        <button
          className="app-header__avatar-btn"
          type="button"
          aria-label="View profile"
          onClick={() => navigate('/profile')}
        >
          <div className="app-header__avatar" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
              <circle cx="20" cy="20" r="20" fill="#e8e0d8" />
              <circle cx="20" cy="15" r="7" fill="#c4a882" />
              <ellipse cx="20" cy="34" rx="12" ry="8" fill="#c4a882" />
            </svg>
          </div>
        </button>
      </div>

      <div className="app-header__actions">
        <button
          className="app-header__icon-btn"
          type="button"
          aria-label={`Notifications${notifCount > 0 ? `, ${notifCount} unread` : ''}`}
          onClick={onBellClick}
        >
          <BellIcon size={22} color="#111" />
          {notifCount > 0 && (
            <span className="app-header__notif-badge" aria-hidden="true">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>
        <button
          className="app-header__icon-btn"
          type="button"
          aria-label="Settings"
          onClick={() => navigate('/settings')}
        >
          <SettingsIcon size={22} color="#111" />
        </button>
      </div>
    </header>
  );
}
