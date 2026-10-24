import { useState } from 'react';
import type { NavItem } from '../types';
import Header from '../components/Header';
import WalletCard from '../components/WalletCard';
import QuickActions from '../components/QuickActions';
import TransactionList from '../components/TransactionList';
import PromoBanner from '../components/PromoBanner';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';
import RightPanel from '../components/RightPanel';
import DesktopTopBar from '../components/DesktopTopBar';
import NotificationDrawer from '../components/NotificationDrawer';

const NOTIF_COUNT = 2;

function MainContent() {
  return (
    <main className="app-main">
      <WalletCard />
      <QuickActions />
      <TransactionList />
      <PromoBanner />
    </main>
  );
}

export default function HomePage() {
  const [activeNav, setActiveNav]       = useState<NavItem>('home');
  const [notifOpen, setNotifOpen]       = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

      <div className="mobile-shell">
        <SideNav
          active={activeNav}
          onChange={setActiveNav}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <div className="app-shell__scroll">
          <Header
            notifCount={NOTIF_COUNT}
            onBellClick={() => setNotifOpen(true)}
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <MainContent />
        </div>
        <BottomNav active={activeNav} onChange={setActiveNav} />
      </div>

      <div className="desktop-shell">
        <SideNav
          active={activeNav}
          onChange={setActiveNav}
          mobileOpen={false}
          onMobileClose={() => {}}
        />
        <div className="desktop-shell__center">
          <DesktopTopBar
            notifCount={NOTIF_COUNT}
            onBellClick={() => setNotifOpen(true)}
          />
          <div className="desktop-shell__body">
            <div className="desktop-shell__greeting">
              <h1 className="desktop-greeting__title">Good morning, Ada</h1>
              <p className="desktop-greeting__sub">Here's what's happening with your money today.</p>
            </div>
            <div className="desktop-shell__scroll">
              <MainContent />
            </div>
          </div>
        </div>
        <RightPanel />
      </div>
    </>
  );
}
