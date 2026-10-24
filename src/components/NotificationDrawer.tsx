import { useState } from 'react';
import type { Notification } from '../types';
import { XIcon, TrashIcon, BellIcon, TransferIcon, BillNavIcon, AirtimeIcon } from './Icons';

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'transfer',
    title: 'Money Received',
    message: 'You received $500.00 from John Adewale.',
    time: 'Today, 10:24 AM',
    read: false,
  },
  {
    id: '2',
    type: 'bill',
    title: 'Bill Payment Successful',
    message: 'Your electricity bill payment of $50.00 to AEDC was successful.',
    time: 'Aug 21, 9:47 AM',
    read: false,
  },
  {
    id: '3',
    type: 'airtime',
    title: 'Airtime Purchase',
    message: 'You purchased $10.00 airtime for MTN 0803 456 7890.',
    time: 'Yesterday, 2:15 PM',
    read: true,
  },
  {
    id: '4',
    type: 'transfer',
    title: 'Money Sent',
    message: 'You sent $200.00 to Chiciera Okafor successfully.',
    time: 'Yesterday, 4:32 PM',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    title: 'Security Alert',
    message: 'A new device logged into your account. If this wasn\'t you, contact support.',
    time: 'Aug 20, 8:00 AM',
    read: true,
  },
];

function NotifIcon({ type }: { type: Notification['type'] }) {
  const map = {
    transfer: <TransferIcon size={16} color="#fff" />,
    bill:     <BillNavIcon  size={16} color="#fff" />,
    airtime:  <AirtimeIcon  size={16} color="#fff" />,
    alert:    <BellIcon     size={16} color="#fff" />,
  };
  return (
    <span className={`notif-icon notif-icon--${type}`}>
      {map[type]}
    </span>
  );
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  function deleteNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`notif-drawer${open ? ' notif-drawer--open' : ''}`}
        aria-label="Notifications"
        aria-hidden={!open}
      >
        <div className="notif-drawer__header">
          <div className="notif-drawer__title-row">
            <h2 className="notif-drawer__title">Notifications</h2>
            {unreadCount > 0 && (
              <span className="notif-drawer__count">{unreadCount}</span>
            )}
          </div>
          <button className="notif-drawer__close" onClick={onClose} aria-label="Close notifications" type="button">
            <XIcon size={18} color="#555" />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="notif-drawer__actions">
            <button className="notif-drawer__action-btn" onClick={markAllRead} type="button">
              Mark all read
            </button>
            <button className="notif-drawer__action-btn notif-drawer__action-btn--danger" onClick={clearAll} type="button">
              Clear all
            </button>
          </div>
        )}

        <div className="notif-drawer__body">
          {notifications.length === 0 ? (
            <div className="notif-drawer__empty">
              <BellIcon size={36} color="#ccc" />
              <p>No notifications</p>
            </div>
          ) : (
            <ul className="notif-list">
              {notifications.map((n) => (
                <li key={n.id} className={`notif-item${n.read ? '' : ' notif-item--unread'}`}>
                  <NotifIcon type={n.type} />
                  <div className="notif-item__body">
                    <p className="notif-item__title">{n.title}</p>
                    <p className="notif-item__message">{n.message}</p>
                    <p className="notif-item__time">{n.time}</p>
                  </div>
                  <button
                    className="notif-item__delete"
                    onClick={() => deleteNotif(n.id)}
                    aria-label={`Delete notification: ${n.title}`}
                    type="button"
                  >
                    <TrashIcon size={14} color="#bbb" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
