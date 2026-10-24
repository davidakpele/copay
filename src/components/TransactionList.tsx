import type { Transaction } from '../types';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  AirtimeIcon,
  BillsIcon,
  ChevronRightIcon,
} from './Icons';

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    title: 'Money Received',
    subtitle: 'From John Adewale',
    date: 'Today, 10:24 AM',
    amount: '+ $500.00',
    isCredit: true,
  },
  {
    id: '2',
    type: 'sent',
    title: 'Money Sent',
    subtitle: 'To Chiciera Okafor',
    date: 'Yesterday, 4:32 PM',
    amount: '- $200.00',
    isCredit: false,
  },
  {
    id: '3',
    type: 'airtime',
    title: 'Airtime Purchase',
    subtitle: 'MTN - 0803 456 7890',
    date: 'Yesterday, 2:15 PM',
    amount: '- $10.00',
    isCredit: false,
  },
  {
    id: '4',
    type: 'bill',
    title: 'Bill Payment',
    subtitle: 'Electricity (AEDC)',
    date: 'Aug 21, 2025, 9:47 AM',
    amount: '- $50.00',
    isCredit: false,
  },
];

function TransactionIcon({ type }: { type: Transaction['type'] }) {
  const iconMap = {
    received: <ArrowDownLeftIcon size={18} color="#111" />,
    sent: <ArrowUpRightIcon size={18} color="#555" />,
    airtime: <AirtimeIcon size={18} color="#111" />,
    bill: <BillsIcon size={18} color="#555" />,
  };
  return (
    <span className={`txn-icon txn-icon--${type}`}>
      {iconMap[type]}
    </span>
  );
}

export default function TransactionList() {
  return (
    <section className="txn-section">
      <div className="txn-section__header">
        <h2 className="txn-section__title">Recent Transactions</h2>
        <button className="txn-section__see-all" type="button">
          See all
          <ChevronRightIcon size={15} color="#111" />
        </button>
      </div>

      <ul className="txn-list">
        {transactions.map((txn) => (
          <li key={txn.id} className="txn-item">
            <TransactionIcon type={txn.type} />
            <div className="txn-item__body">
              <p className="txn-item__title">{txn.title}</p>
              <p className="txn-item__sub">{txn.subtitle}</p>
              <p className="txn-item__date">{txn.date}</p>
            </div>
            <span className={`txn-item__amount${txn.isCredit ? ' txn-item__amount--credit' : ''}`}>
              {txn.amount}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
