import { useState } from 'react';
import type { NavItem } from '../types';
import {
  HomeIcon,
  TransferIcon,
  CardIcon,
  WalletIcon,
  BillNavIcon,
  TransactionsIcon,
  SettingsIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeIcon,
  XIcon,
} from './Icons';

interface SubItem {
  id: string;
  label: string;
}

interface NavTab {
  id: NavItem;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  children?: SubItem[];
}

const tabs: NavTab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (a) => <HomeIcon size={18} color={a ? '#fff' : '#888'} />,
  },
  {
    id: 'transfers',
    label: 'Transfers',
    icon: (a) => <TransferIcon size={18} color={a ? '#fff' : '#888'} />,
    children: [
      { id: 'txn-copay', label: 'Copay Account' },
      { id: 'txn-banks', label: 'Other Banks' },
    ],
  },
  {
    id: 'cards',
    label: 'Cards',
    icon: (a) => <CardIcon size={18} color={a ? '#fff' : '#888'} />,
  },
  {
    id: 'wallets',
    label: 'Wallets',
    icon: (a) => <WalletIcon size={18} color={a ? '#fff' : '#888'} />,
  },
  {
    id: 'bills',
    label: 'Bills',
    icon: (a) => <BillNavIcon size={18} color={a ? '#fff' : '#888'} />,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: (a) => <TransactionsIcon size={18} color={a ? '#fff' : '#888'} />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (a) => <SettingsIcon size={18} color={a ? '#fff' : '#888'} />,
    children: [
      { id: 'set-profile',       label: 'Profile' },
      { id: 'set-app',           label: 'App' },
      { id: 'set-notifications', label: 'Notifications' },
      { id: 'set-wallet',        label: 'Wallet' },
    ],
  },
];

interface SideNavProps {
  active: NavItem;
  onChange: (tab: NavItem) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function SideNav({ active, onChange, mobileOpen, onMobileClose }: SideNavProps) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  function toggleSubMenu(id: string) {
    setOpenSubMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleTabClick(tab: NavTab) {
    if (tab.children) {
      toggleSubMenu(tab.id);
    } else {
      onChange(tab.id);
      onMobileClose();
    }
  }

  const navContent = (
    <>
      <div className="side-nav__logo">
        <span className="side-nav__logo-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.15" />
            <path d="M6 8h12M6 12h8M6 16h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="side-nav__logo-text">Copay</span>
        <button
          className="side-nav__mobile-close"
          onClick={onMobileClose}
          type="button"
          aria-label="Close menu"
        >
          <XIcon size={18} color="#888" />
        </button>
      </div>

      <nav className="side-nav__menu" aria-label="Primary navigation">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const isOpen = openSubMenus[tab.id];

          return (
            <div key={tab.id} className="side-nav__group">
              <button
                className={`side-nav__item${isActive ? ' side-nav__item--active' : ''}`}
                onClick={() => handleTabClick(tab)}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={tab.children ? isOpen : undefined}
              >
                <span className="side-nav__item-icon">{tab.icon(isActive)}</span>
                <span className="side-nav__item-label">{tab.label}</span>
                {tab.children && (
                  <span className="side-nav__item-arrow">
                    {isOpen
                      ? <ChevronUpIcon size={14} color="#666" />
                      : <ChevronDownIcon size={14} color="#666" />
                    }
                  </span>
                )}
              </button>

              {tab.children && isOpen && (
                <ul className="side-nav__submenu">
                  {tab.children.map((child) => (
                    <li key={child.id}>
                      <button
                        className="side-nav__subitem"
                        type="button"
                        onClick={() => {
                          onChange(tab.id);
                          onMobileClose();
                        }}
                      >
                        <span className="side-nav__subitem-dot" aria-hidden="true" />
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="side-nav__promo">
        <div className="side-nav__promo-icon" aria-hidden="true">
          <GlobeIcon size={32} color="rgba(255,255,255,0.4)" />
        </div>
        <p className="side-nav__promo-title">Need to send money abroad?</p>
        <p className="side-nav__promo-sub">Fast, secure and low fees in over 50 countries.</p>
        <button className="side-nav__promo-btn" type="button">
          Send International
          <ChevronRightIcon size={13} color="#111" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div className="side-nav-overlay" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside className={`side-nav${mobileOpen ? ' side-nav--open' : ''}`}>
        {navContent}
      </aside>
    </>
  );
}
