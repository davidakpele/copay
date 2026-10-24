import { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, VerifiedIcon, UserIcon, SettingsIcon, LogoutIcon } from './Icons';

interface DesktopTopBarProps {
  notifCount: number;
  onBellClick: () => void;
}

export default function DesktopTopBar({ notifCount, onBellClick }: DesktopTopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="desktop-topbar">
      <div className="desktop-topbar__search">
        <SearchIcon size={16} color="#aaa" />
        <input
          className="desktop-topbar__input"
          type="search"
          placeholder="Search for transactions, contacts, or services..."
          aria-label="Search"
        />
      </div>

      <div className="desktop-topbar__right">
        <button
          className="desktop-topbar__bell"
          type="button"
          aria-label={`Notifications${notifCount > 0 ? `, ${notifCount} unread` : ''}`}
          onClick={onBellClick}
        >
          <BellIcon size={20} color="#555" />
          {notifCount > 0 && (
            <span className="topbar-bell__badge" aria-hidden="true">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        <div className="desktop-topbar__profile-wrap" ref={profileRef}>
          <button
            className="desktop-topbar__profile"
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <div className="desktop-topbar__avatar" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none" width="34" height="34">
                <circle cx="20" cy="20" r="20" fill="#e8e0d8" />
                <circle cx="20" cy="15" r="7" fill="#c4a882" />
                <ellipse cx="20" cy="34" rx="12" ry="8" fill="#c4a882" />
              </svg>
            </div>
            <div className="desktop-topbar__user">
              <span className="desktop-topbar__name">Ada Okafor</span>
              <span className="desktop-topbar__badge">
                <VerifiedIcon size={11} color="#3b82f6" />
                Verified Account
              </span>
            </div>
            <ChevronDownIcon size={15} color="#888" />
          </button>

          {profileOpen && (
            <div className="profile-dropdown" role="menu">
              <button className="profile-dropdown__item" role="menuitem" type="button" onClick={() => setProfileOpen(false)}>
                <UserIcon size={16} color="#555" />
                <span>Profile</span>
              </button>
              <button className="profile-dropdown__item" role="menuitem" type="button" onClick={() => setProfileOpen(false)}>
                <SettingsIcon size={16} color="#555" />
                <span>Settings</span>
              </button>
              <div className="profile-dropdown__divider" />
              <button className="profile-dropdown__item profile-dropdown__item--danger" role="menuitem" type="button" onClick={() => setProfileOpen(false)}>
                <LogoutIcon size={16} color="#e5403a" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
