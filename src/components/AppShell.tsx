import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { NavItem } from '../types';
import Header from './Header';
import SideNav from './SideNav';
import DesktopTopBar from './DesktopTopBar';
import BottomNav from './BottomNav';
import NotificationDrawer from './NotificationDrawer';

const NOTIF_COUNT = 2;

const navRouteMap: Record<NavItem, string> = {
  home:         '/',
  transfers:    '/transfers',
  cards:        '/cards',
  wallets:      '/wallets',
  bills:        '/bills',
  transactions: '/transactions',
  settings:     '/settings',
  exchange:     '/exchange',
  refer:        '/',
  investments:  '/',
  support:      '/',
};

const routeNavMap: Record<string, NavItem> = {
  ...Object.fromEntries(Object.entries(navRouteMap).map(([k, v]) => [v, k as NavItem])),
  '/profile': 'settings',
};

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  rightPanel?: React.ReactNode;
}

export default function AppShell({ children, title, subtitle, rightPanel }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifOpen, setNotifOpen]         = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeNav: NavItem = routeNavMap[location.pathname] ?? 'home';

  function handleNavChange(tab: NavItem) {
    navigate(navRouteMap[tab]);
  }

  return (
    <>
      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />

      <div className="mobile-shell">
        <SideNav
          active={activeNav}
          onChange={handleNavChange}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <div className="app-shell__scroll">
          <Header
            notifCount={NOTIF_COUNT}
            onBellClick={() => setNotifOpen(true)}
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <div className="mobile-greeting">
            <div className="app-header__greeting">
              <span className="app-header__good-morning">Good morning,</span>
              <span className="app-header__name">Ada</span>
            </div>
          </div>
          <main className="app-main">{children}</main>
        </div>
        <BottomNav active={activeNav} onChange={handleNavChange} />
      </div>

      <div className="desktop-shell">
        <SideNav
          active={activeNav}
          onChange={handleNavChange}
          mobileOpen={false}
          onMobileClose={() => {}}
        />
        <div className="desktop-shell__center">
          <DesktopTopBar
            notifCount={NOTIF_COUNT}
            onBellClick={() => setNotifOpen(true)}
          />
          <div className="desktop-shell__body">
            {(title || subtitle) && (
              <div className="desktop-shell__greeting">
                {title    && <h1 className="desktop-greeting__title">{title}</h1>}
                {subtitle && <p  className="desktop-greeting__sub">{subtitle}</p>}
              </div>
            )}
            <div className="desktop-shell__scroll">
              <main className="app-main">{children}</main>
            </div>
          </div>
        </div>
        {rightPanel ?? <div className="desktop-shell__no-panel" />}
      </div>
    </>
  );
}
