import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { NavItem } from '../types';
import {
  HomeIcon,
  TransferIcon,
  CardIcon,
  WalletIcon,
  BillNavIcon,
  TransactionsIcon,
  SettingsIcon,
  ExchangeSideIcon,
  ReferIcon,
  InvestmentsIcon,
  SupportNavIcon,
  LogoutNavIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
} from './Icons';

interface SubItem {
  id: string;
  label: string;
  route: string;
}

interface NavTab {
  id: NavItem | 'logout';
  label: string;
  icon: React.ReactNode;
  route?: string;
  children?: SubItem[];
  isLogout?: boolean;
}

interface NavSection {
  group?: string;
  items: NavTab[];
}

const navSections: NavSection[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: <HomeIcon size={17} color="currentColor" />, route: '/' },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      {
        id: 'wallets',
        label: 'Wallets',
        icon: <WalletIcon size={17} color="currentColor" />,
        children: [
          { id: 'wal-accounts',   label: 'Accounts',           route: '/wallets'   },
          { id: 'wal-statements', label: 'Account Statements', route: '/wallets'   },
          { id: 'wal-beneficiary',label: 'Beneficiary',        route: '/wallets'   },
          { id: 'wal-deposit',    label: 'Deposit Banks',      route: '/wallets'   },
        ],
      },
      {
        id: 'transfers',
        label: 'Transfers',
        icon: <TransferIcon size={17} color="currentColor" />,
        children: [
          { id: 'txn-copay', label: 'Copay Account', route: '/transfers' },
          { id: 'txn-banks', label: 'Other Banks',   route: '/transfers' },
        ],
      },
      { id: 'transactions', label: 'Transactions', icon: <TransactionsIcon size={17} color="currentColor" />, route: '/transactions' },
      { id: 'exchange',     label: 'Exchange',     icon: <ExchangeSideIcon size={17} color="currentColor" />, route: '/exchange'     },
    ],
  },
  {
    group: 'PAYMENTS',
    items: [
      { id: 'cards', label: 'Cards', icon: <CardIcon    size={17} color="currentColor" />, route: '/cards' },
      { id: 'bills', label: 'Bills', icon: <BillNavIcon size={17} color="currentColor" />, route: '/bills' },
      { id: 'refer', label: 'Refer and Earn', icon: <ReferIcon size={17} color="currentColor" />, route: '/' },
    ],
  },
  {
    group: 'INVESTMENTS',
    items: [
      { id: 'investments', label: 'Investments', icon: <InvestmentsIcon size={17} color="currentColor" />, route: '/' },
    ],
  },
  {
    group: 'SETTINGS',
    items: [
      { id: 'support', label: 'Support', icon: <SupportNavIcon size={17} color="currentColor" />, route: '/' },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={17} color="currentColor" />,
        children: [
          { id: 'set-profile',       label: 'Profile',       route: '/profile'                      },
          { id: 'set-app',           label: 'App',           route: '/settings?tab=app'             },
          { id: 'set-notifications', label: 'Notifications', route: '/settings?tab=notifications'   },
          { id: 'set-wallet',        label: 'Wallet',        route: '/settings?tab=wallet'          },
        ],
      },
      { id: 'logout', label: 'Logout', icon: <LogoutNavIcon size={17} color="#e5403a" />, route: '/', isLogout: true },
    ],
  },
];

const navRouteMap: Partial<Record<NavItem, string>> = {
  home: '/', wallets: '/wallets', transfers: '/transfers', transactions: '/transactions',
  exchange: '/exchange', cards: '/cards', bills: '/bills', settings: '/settings',
};

interface SideNavProps {
  active: NavItem;
  onChange: (tab: NavItem) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function SideNav({ active, onChange, mobileOpen, onMobileClose }: SideNavProps) {
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  function toggleSubMenu(id: string) {
    setOpenSubMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleTabClick(tab: NavTab) {
    if (tab.isLogout) { navigate('/'); onMobileClose(); return; }
    if (tab.children) { toggleSubMenu(tab.id); return; }
    if (tab.id !== 'logout') onChange(tab.id as NavItem);
    navigate(tab.route ?? navRouteMap[tab.id as NavItem] ?? '/');
    onMobileClose();
  }

  function handleSubItemClick(child: SubItem) {
    navigate(child.route);
    onMobileClose();
  }

  return (
    <>
      {mobileOpen && (
        <div className="side-nav-overlay" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside className={`side-nav${mobileOpen ? ' side-nav--open' : ''}`}>
        <div className="side-nav__logo">
          <span className="side-nav__logo-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.15" />
              <path d="M6 8h12M6 12h8M6 16h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="side-nav__logo-text">Copay</span>
          <button className="side-nav__mobile-close" onClick={onMobileClose} type="button" aria-label="Close menu">
            <XIcon size={18} color="#888" />
          </button>
        </div>

        <nav className="side-nav__menu" aria-label="Primary navigation">
          {navSections.map((section, si) => (
            <div key={si} className="side-nav__section">
              {section.group && (
                <p className="side-nav__section-label">{section.group}</p>
              )}

              {section.items.map((tab) => {
                const isActive = tab.id === active;
                const isOpen   = openSubMenus[tab.id];

                return (
                  <div key={tab.id} className="side-nav__group">
                    <button
                      className={`side-nav__item${isActive ? ' side-nav__item--active' : ''}${tab.isLogout ? ' side-nav__item--logout' : ''}`}
                      onClick={() => handleTabClick(tab)}
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      aria-expanded={tab.children ? isOpen : undefined}
                    >
                      <span className="side-nav__item-icon">{tab.icon}</span>
                      <span className="side-nav__item-label">{tab.label}</span>
                      {tab.children && (
                        <span className="side-nav__item-arrow">
                          {isOpen
                            ? <ChevronUpIcon   size={13} color="#666" />
                            : <ChevronDownIcon size={13} color="#666" />
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
                              onClick={() => handleSubItemClick(child)}
                            >
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
