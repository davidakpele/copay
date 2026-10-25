import { createContext, useContext, useState } from 'react';
import type { Wallet } from '../types';

export const wallets: Wallet[] = [
  { currency: 'USD', balance: 2450.0,    isPrimary: true,  flag: '🇺🇸', symbol: '$', formatted: '$2,450.00'      },
  { currency: 'NGN', balance: 1280500.0, isPrimary: false, flag: '🇳🇬', symbol: '₦', formatted: '₦1,280,500.00' },
  { currency: 'GBP', balance: 320.0,     isPrimary: false, flag: '🇬🇧', symbol: '£', formatted: '£320.00'        },
  { currency: 'EUR', balance: 410.0,     isPrimary: false, flag: '🇪🇺', symbol: '€', formatted: '€410.00'        },
];

interface WalletContextValue {
  activeWallet: Wallet;
  setActiveWallet: (w: Wallet) => void;
}

const WalletContext = createContext<WalletContextValue>({
  activeWallet: wallets[0],
  setActiveWallet: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [activeWallet, setActiveWallet] = useState<Wallet>(wallets[0]);
  return (
    <WalletContext.Provider value={{ activeWallet, setActiveWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
