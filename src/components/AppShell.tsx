import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { NavItem } from '../types';
import Header from './Header';
import SideNav from './SideNav';
import DesktopTopBar from './DesktopTopBar';
import BottomNav from './BottomNav';
import NotificationDrawer from './NotificationDrawer';
import ServicesDrawer from './ServicesDrawer';
import PageLoader from './PageLoader';
import {
  HomeIcon,
  WalletIcon,
  TransferIcon,
  TransactionsIcon,
  ExchangeSideIcon,
  CardIcon,
  BillNavIcon,
  InvestmentsIcon,
  SupportNavIcon,
  SettingsIcon,
} from './Icons';

const NOTIF_COUNT = 2;

/** Compact inline nav shown on mobile, after the header, before the wallet card. */
const inlineNavItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  { id: 'home',         label: 'Home',         icon: <HomeIcon          size={16} color="currentColor" /> },
  { id: 'wallets',      label: 'Wallets',      icon: <WalletIcon        size={16} color="currentColor" /> },
  { id: 'transfers',    label: 'Transfers',    icon: <TransferIcon      size={16} color="currentColor" /> },
  { id: 'transactions', label: 'Transactions', icon: <TransactionsIcon  size={16} color="currentColor" /> },
  { id: 'exchange',     label: 'Exchange',     icon: <ExchangeSideIcon  size={16} color="currentColor" /> },
  { id: 'cards',        label: 'Cards',        icon: <CardIcon          size={16} color="currentColor" /> },
  { id: 'bills',        label: 'Bills',        icon: <BillNavIcon       size={16} color="currentColor" /> },
  { id: 'investments',  label: 'Investments',  icon: <InvestmentsIcon   size={16} color="currentColor" /> },
  { id: 'support',      label: 'Support',      icon: <SupportNavIcon    size={16} color="currentColor" /> },
  { id: 'settings',     label: 'Settings',     icon: <SettingsIcon      size={16} color="currentColor" /> },
];

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
  const [servicesOpen, setServicesOpen]   = useState(false);

  const activeNav: NavItem = routeNavMap[location.pathname] ?? 'home';

  function handleNavChange(tab: NavItem) {
    navigate(navRouteMap[tab]);
  }

  return (
    <>
      {/* Page loader: shows first on every route change for ~3s, then fades out. */}
      <PageLoader key={location.pathname} />

      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      <ServicesDrawer open={servicesOpen} onClose={() => setServicesOpen(false)} />

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
          <nav className="mobile-inline-nav" aria-label="Quick navigation">
            <div className="mobile-inline-nav__scroll">
              {inlineNavItems.map((item) => {
                const isActive = item.id === activeNav;
                return (
                  <button
                    key={item.id}
                    className={`mobile-inline-nav__item${isActive ? ' mobile-inline-nav__item--active' : ''}`}
                    onClick={() => handleNavChange(item.id)}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="mobile-inline-nav__icon">{item.icon}</span>
                    <span className="mobile-inline-nav__label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
          <main className="app-main">{children}</main>
        </div>
        <BottomNav
          active={activeNav}
          onChange={handleNavChange}
          onMoreClick={() => setServicesOpen(true)}
        />
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
