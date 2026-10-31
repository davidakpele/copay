import { useNavigate } from 'react-router';
import { BellIcon, SettingsIcon, MenuIcon, UserIcon } from './Icons';

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
          <MenuIcon size={22} color="currentColor" />
        </button>

        <button
          className="app-header__avatar-btn"
          type="button"
          aria-label="View profile"
          onClick={() => navigate('/profile')}
        >
          <div className="app-header__avatar" aria-hidden="true">
            <UserIcon size={20} color="currentColor" />
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
          <BellIcon size={22} color="currentColor" />
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
          <SettingsIcon size={22} color="currentColor" />
        </button>
      </div>
    </header>
  );
}
