import { SendIcon, ReceiveIcon, AirtimeIcon, LightningIcon } from './Icons';

interface Action {
  icon: React.ReactNode;
  label: string;
}

const actions: Action[] = [
  { icon: <SendIcon size={22} color="#fff" />, label: 'Send' },
  { icon: <ReceiveIcon size={22} color="#fff" />, label: 'Receive' },
  { icon: <AirtimeIcon size={22} color="#fff" />, label: 'Buy Airtime' },
  { icon: <LightningIcon size={22} color="#fff" />, label: 'Pay Bills' },
];

export default function QuickActions() {
  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button key={action.label} className="quick-actions__item" type="button">
          <span className="quick-actions__icon">{action.icon}</span>
          <span className="quick-actions__label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
