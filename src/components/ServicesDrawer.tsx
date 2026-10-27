import type { NavItem } from '../types';
import { HomeIcon, TransferIcon, CardIcon, BillNavIcon, MoreIcon } from './Icons';

interface NavTab {
  id: NavItem;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const tabs: NavTab[] = [
  { id: 'home',      label: 'Home',      icon: (a) => <HomeIcon     size={22} color={a ? '#111' : '#999'} /> },
  { id: 'transfers', label: 'Transfers', icon: (a) => <TransferIcon size={22} color={a ? '#111' : '#999'} /> },
  { id: 'cards',     label: 'Cards',     icon: (a) => <CardIcon     size={22} color={a ? '#111' : '#999'} /> },
  { id: 'bills',     label: 'Bills',     icon: (a) => <BillNavIcon  size={22} color={a ? '#111' : '#999'} /> },
  { id: 'settings',  label: 'More',      icon: (a) => <MoreIcon     size={22} color={a ? '#111' : '#999'} /> },
];

interface BottomNavProps {
  active: NavItem;
  onChange: (tab: NavItem) => void;
  onMoreClick: () => void;
  onBillsClick: () => void;
}

export default function BottomNav({ active, onChange, onMoreClick, onBillsClick }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const isMore = tab.label === 'More';
        const isBills = tab.id === 'bills';
        return (
          <button
            key={tab.id}
            className={`bottom-nav__tab${isActive ? ' bottom-nav__tab--active' : ''}`}
            onClick={() => {
              if (isMore) {
                onMoreClick();
                return;
              }
              if (isBills) {
                onBillsClick();
                return;
              }
              onChange(tab.id);
            }}
            type="button"
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bottom-nav__icon">{tab.icon(isActive)}</span>
            <span className="bottom-nav__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
