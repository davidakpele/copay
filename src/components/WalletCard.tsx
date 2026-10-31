import { useRef, useEffect, useState } from 'react';
import { useWallet, wallets } from '../contexts/WalletContext';
import type { Wallet } from '../types';
import {
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
  ChevronRightIcon,
} from './Icons';

const flagMap: Record<string, string> = {
  USD: '🇺🇸',
  NGN: '🇳🇬',
  GBP: '🇬🇧',
  EUR: '🇪🇺',
};

export default function WalletCard() {
  const { activeWallet, setActiveWallet } = useWallet();
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const currencyBtnRef = useRef<HTMLDivElement>(null);
  const wrapperRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectWallet(wallet: Wallet) {
    setActiveWallet(wallet);
    setDropdownOpen(false);
  }

  return (
    <div className="wallet-card-wrapper" ref={wrapperRef}>
      <div className="wallet-card">
        <div className="wallet-card__top">
          <div className="wallet-card__currency-anchor" ref={currencyBtnRef}>
            <button
              className="wallet-card__currency-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="wallet-card__flag">{flagMap[activeWallet.currency]}</span>
              <span>{activeWallet.currency}</span>
              <ChevronDownIcon size={13} color="#fff" />
            </button>

            {dropdownOpen && (
              <div className="wallet-dropdown" role="listbox" aria-label="Select wallet">
                <p className="wallet-dropdown__title">Select Wallet</p>

                {wallets.map((w) => (
                  <button
                    key={w.currency}
                    className={`wallet-dropdown__item${activeWallet.currency === w.currency ? ' wallet-dropdown__item--active' : ''}`}
                    onClick={() => selectWallet(w)}
                    role="option"
                    aria-selected={activeWallet.currency === w.currency}
                  >
                    <span className="wallet-dropdown__flag">{w.flag}</span>
                    <div className="wallet-dropdown__info">
                      <span className="wallet-dropdown__currency">{w.currency}</span>
                      {w.isPrimary && <span className="wallet-dropdown__badge">Primary</span>}
                    </div>
                    <span className="wallet-dropdown__check">
                      {activeWallet.currency === w.currency ? (
                        <CheckIcon size={14} color="#fff" />
                      ) : (
                        <span className="wallet-dropdown__radio" />
                      )}
                    </span>
                  </button>
                ))}

                <button className="wallet-dropdown__add">
                  <span className="wallet-dropdown__add-icon">
                    <PlusIcon size={14} color="#111" />
                  </span>
                  <span>Add Wallet</span>
                  <ChevronRightIcon size={14} color="#888" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="wallet-card__balance" aria-live="polite">
          {balanceVisible ? activeWallet.formatted : '*****'}
        </div>

        <div className="wallet-card__bottom">
          <button
            className="wallet-card__eye-btn"
            type="button"
            aria-label={balanceVisible ? 'Hide balance' : 'Show balance'}
            onClick={() => setBalanceVisible((v) => !v)}
          >
            {balanceVisible
              ? <EyeIcon size={14} color="rgba(255,255,255,0.7)" />
              : <EyeOffIcon size={14} color="rgba(255,255,255,0.7)" />
            }
          </button>
          <span className="wallet-card__balance-label">Available balance</span>
        </div>
      </div>
    </div>
  );
}
