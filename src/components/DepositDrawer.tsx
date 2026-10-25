import { useState, useEffect, useCallback } from 'react';
import { XIcon, BankIcon, CheckCircleIcon, ChevronRightIcon } from './Icons';

type Step = 'select' | 'transfer' | 'opay-form' | 'opay-connecting' | 'opay-success';

/** Static demo deposit account details shown for the bank-transfer option. */
const DEPOSIT_ACCOUNT = {
  accountNumber: '0123456789',
  bankName: 'Copay Microfinance Bank',
  accountName: 'David Ade',
};

const COUNTDOWN_SECONDS = 30 * 60;

function formatTime(total: number): string {
  const m = Math.max(0, Math.floor(total / 60));
  const s = Math.max(0, total % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function CopyIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5h3l1.2 4-2 1.2a13 13 0 0 0 5.6 5.6l1.2-2 4 1.2v3a1.5 1.5 0 0 1-1.6 1.5C11.5 21 3 12.5 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function DepositDrawer({ open, onClose }: DepositDrawerProps) {
  const [step, setStep] = useState<Step>('select');
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [opayNumber, setOpayNumber] = useState('');

  const reset = useCallback(() => {
    setStep('select');
    setSecondsLeft(COUNTDOWN_SECONDS);
    setCopiedKey(null);
    setOpayNumber('');
  }, []);

  useEffect(() => {
    if (!open) setTimeout(reset, 300);
  }, [open, reset]);

  // 30-minute countdown, ticks only while the transfer step is showing.
  useEffect(() => {
    if (step !== 'transfer' || secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, secondsLeft]);

  // OPay: "initiating connection" -> success after 2s.
  useEffect(() => {
    if (step !== 'opay-connecting') return;
    const t = setTimeout(() => setStep('opay-success'), 2000);
    return () => clearTimeout(t);
  }, [step]);

  function startTransfer() {
    setSecondsLeft(COUNTDOWN_SECONDS);
    setStep('transfer');
  }

  async function handleCopy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard may be unavailable in some contexts; still show feedback.
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
  }

  const expired = secondsLeft <= 0;
  const opayValid = opayNumber.replace(/\D/g, '').length >= 10;

  const detailCards = [
    { key: 'accountNumber', label: 'Account Number', value: DEPOSIT_ACCOUNT.accountNumber },
    { key: 'bankName',      label: 'Bank Name',      value: DEPOSIT_ACCOUNT.bankName },
    { key: 'accountName',   label: 'Account Name',   value: DEPOSIT_ACCOUNT.accountName },
  ];

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`send-drawer${open ? ' send-drawer--open' : ''}`} aria-label="Deposit" aria-hidden={!open}>

        {step === 'select' && (
          <>
            <div className="send-drawer__header">
              <div>
                <h2 className="send-drawer__title">Deposit</h2>
                <p className="send-drawer__subtitle">Choose how to fund your wallet</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              <div className="send-options">
                <button className="send-option-card" type="button" onClick={startTransfer}>
                  <span className="send-option-card__icon send-option-card__icon--bank">
                    <BankIcon size={20} color="#fff" />
                  </span>
                  <div className="send-option-card__text">
                    <span className="send-option-card__title">Bank Transfer</span>
                    <span className="send-option-card__sub">Transfer from your bank account</span>
                  </div>
                  <ChevronRightIcon size={18} color="#bbb" />
                </button>

                <button className="send-option-card" type="button" onClick={() => setStep('opay-form')}>
                  <span className="send-option-card__icon send-option-card__icon--copay">
                    <PhoneIcon size={20} color="#fff" />
                  </span>
                  <div className="send-option-card__text">
                    <span className="send-option-card__title">OPay</span>
                    <span className="send-option-card__sub">Deposit from your OPay account</span>
                  </div>
                  <ChevronRightIcon size={18} color="#bbb" />
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'transfer' && (
          <>
            <div className="send-drawer__header">
              <div>
                <button className="send-drawer__back" onClick={() => setStep('select')} type="button">← Back</button>
                <h2 className="send-drawer__title">Bank Transfer</h2>
                <p className="send-drawer__subtitle">Transfer to this account to fund your wallet</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              <div className="deposit-details">
                {detailCards.map((card) => {
                  const copied = copiedKey === card.key;
                  return (
                    <div className="deposit-detail-card" key={card.key}>
                      <div className="deposit-detail-card__main">
                        <span className="deposit-detail-card__label">{card.label}</span>
                        <span className="deposit-detail-card__value">{card.value}</span>
                      </div>
                      <button
                        className={`deposit-detail-card__copy${copied ? ' deposit-detail-card__copy--copied' : ''}`}
                        type="button"
                        onClick={() => handleCopy(card.key, card.value)}
                        aria-label={`Copy ${card.label}`}
                      >
                        {copied ? 'Copied' : 'Copy'}
                        {copied
                          ? <CheckCircleIcon size={14} color="#15803d" />
                          : <CopyIcon size={14} color="currentColor" />}
                      </button>
                    </div>
                  );
                })}
                <p className="deposit-info">
                  Use the details above to make a transfer from your bank app. Your wallet is credited automatically once the payment is received.
                </p>
              </div>

              <div className={`deposit-countdown${expired ? ' deposit-countdown--expired' : ''}`}>
                <span className="deposit-countdown__label">
                  {expired ? 'Session expired' : 'Session expires in'}
                </span>
                <span className="deposit-countdown__time">
                  {expired ? '00:00' : formatTime(secondsLeft)}
                </span>
                {expired && (
                  <button className="deposit-countdown__refresh" type="button" onClick={startTransfer}>
                    Generate new details
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {step === 'opay-form' && (
          <>
            <div className="send-drawer__header">
              <div>
                <button className="send-drawer__back" onClick={() => setStep('select')} type="button">← Back</button>
                <h2 className="send-drawer__title">OPay</h2>
                <p className="send-drawer__subtitle">Enter your OPay account number</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              <div className="send-form">
                <div className="send-field">
                  <label className="send-field__label">OPay Account Number</label>
                  <div className="send-field__input-wrap">
                    <input
                      className="send-field__input"
                      type="tel"
                      inputMode="numeric"
                      placeholder="08012345678"
                      maxLength={11}
                      value={opayNumber}
                      onChange={(e) => setOpayNumber(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                  <p className="send-field__hint">The telephone number linked to your OPay account.</p>
                </div>
                <button className="send-btn-primary" type="button" disabled={!opayValid} onClick={() => setStep('opay-connecting')}>
                  Continue
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'opay-connecting' && (
          <div className="send-drawer__loading">
            <span className="send-ring-loader" aria-hidden="true" />
            <p className="send-drawer__loading-text">Initiating connection to OPay…</p>
          </div>
        )}

        {step === 'opay-success' && (
          <div className="send-drawer__success">
            <div className="send-success__inner">
              <div className="send-success__icon">
                <CheckCircleIcon size={64} color="#16a34a" />
              </div>
              <h2 className="send-success__title">Connection Successful!</h2>
              <p className="send-success__msg">
                Your OPay account has been linked. You can now deposit from OPay to your Copay wallet.
              </p>
              <button className="send-btn-primary" type="button" onClick={onClose}>Done</button>
            </div>
          </div>
        )}

      </aside>
    </>
  );
}
