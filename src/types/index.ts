export type Currency = 'USD' | 'NGN' | 'GBP' | 'EUR';

export interface Wallet {
  currency: Currency;
  balance: number;
  isPrimary: boolean;
  flag: string;
  symbol: string;
  formatted: string;
}

export type TransactionType = 'received' | 'sent' | 'airtime' | 'bill';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  date: string;
  amount: string;
  isCredit: boolean;
}

export type NavItem = 'home' | 'transfers' | 'cards' | 'wallets' | 'bills' | 'transactions' | 'settings';

export type NotificationType = 'transfer' | 'bill' | 'airtime' | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
