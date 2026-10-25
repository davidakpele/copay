import { useState } from 'react';
import { SendIcon, DepositNavIcon, ExchangeNavIcon, MoreIcon } from './Icons';
import ServicesDrawer from './ServicesDrawer';
import SendMoneyDrawer from './SendMoneyDrawer';

interface Action {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function QuickActions() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [sendOpen, setSendOpen]         = useState(false);

  const actions: Action[] = [
    { icon: <SendIcon        size={22} color="#fff" />, label: 'Send',     onClick: () => setSendOpen(true)      },
    { icon: <DepositNavIcon  size={22} color="#fff" />, label: 'Deposit'                                         },
    { icon: <ExchangeNavIcon size={22} color="#fff" />, label: 'Exchange'                                        },
    { icon: <MoreIcon        size={22} color="#fff" />, label: 'More',     onClick: () => setServicesOpen(true)  },
  ];

  return (
    <>
      <ServicesDrawer  open={servicesOpen} onClose={() => setServicesOpen(false)} />
      <SendMoneyDrawer open={sendOpen}     onClose={() => setSendOpen(false)}     />

      <div className="quick-actions">
        {actions.map((action) => (
          <button
            key={action.label}
            className="quick-actions__item"
            type="button"
            onClick={action.onClick}
          >
            <span className="quick-actions__icon">{action.icon}</span>
            <span className="quick-actions__label">{action.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
