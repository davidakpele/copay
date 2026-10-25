import { useState, useRef, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { XIcon, CopayIcon, BankIcon, CheckCircleIcon, SpinnerIcon, ChevronRightIcon } from './Icons';

type SendOption = 'copay' | 'bank';
type Step = 'select' | 'form' | 'pin' | 'loading' | 'success';

const DEMO_BANKS = [
  'Access Bank', 'First Bank', 'GTBank', 'Zenith Bank', 'UBA',
  'Stanbic IBTC', 'Fidelity Bank', 'Union Bank', 'Polaris Bank',
  'Wema Bank', 'Sterling Bank', 'Heritage Bank', 'Providus Bank',
  'Kuda Bank', 'Opay', 'Palmpay', 'Moniepoint',
];

function formatWithCommas(raw: string): string {
  const digits = raw.replace(/[^0-9.]/g, '');
  const parts  = digits.split('.');
  parts[0]     = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : parts[0];
}

function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/,/g, '')) || 0;
}

function formatFinal(symbol: string, raw: string): string {
  const num = parseAmount(raw);
  return `${symbol}${num.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface PinInputProps {
  value: string;
  onChange: (v: string) => void;
}

function PinInput({ value, onChange }: PinInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (value[i]) {
        onChange(value.slice(0, i) + '' + value.slice(i + 1));
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
        onChange(value.slice(0, i - 1) + '' + value.slice(i));
      }
    }
  }

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    const next    = value.split('');
    next[i]       = char;
    const updated = next.join('').slice(0, 4);
    onChange(updated);
    if (i < 3) inputs.current[i + 1]?.focus();
  }

  return (
    <div className="pin-input-row">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          className={`pin-input-box${value[i] ? ' pin-input-box--filled' : ''}`}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          aria-label={`PIN digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

interface SendMoneyDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SendMoneyDrawer({ open, onClose }: SendMoneyDrawerProps) {
  const { activeWallet }  = useWallet();
  const currencySymbol    = activeWallet.symbol;
  const currencyCode      = activeWallet.currency;

  const [step, setStep]                       = useState<Step>('select');
  const [option, setOption]                   = useState<SendOption | null>(null);
  const [username, setUsername]               = useState('');
  const [usernameStatus, setUsernameStatus]   = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [resolvedName, setResolvedName]       = useState('');
  const [accountNumber, setAccountNumber]     = useState('');
  const [selectedBank, setSelectedBank]       = useState('');
  const [acctStatus, setAcctStatus]           = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [resolvedAcct, setResolvedAcct]       = useState('');
  const [amountRaw, setAmountRaw]             = useState('');
  const [pin, setPin]                         = useState('');
  const [txnRef]                              = useState(() => `TXN${Date.now().toString().slice(-8)}`);

  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const acctTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setStep('select');
    setOption(null);
    setUsername('');
    setUsernameStatus('idle');
    setResolvedName('');
    setAccountNumber('');
    setSelectedBank('');
    setAcctStatus('idle');
    setResolvedAcct('');
    setAmountRaw('');
    setPin('');
  }, []);

  useEffect(() => {
    if (!open) { setTimeout(reset, 300); }
  }, [open, reset]);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw     = e.target.value.replace(/[^0-9.]/g, '');
    const parts   = raw.split('.');
    const cleaned = parts.length > 1
      ? `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}`
      : parts[0];
    setAmountRaw(formatWithCommas(cleaned));
  }

  function handleUsernameBlur() {
    if (!username.trim()) return;
    setUsernameStatus('checking');
    usernameTimer.current = setTimeout(() => {
      if (username.toLowerCase() === 'invalid') {
        setUsernameStatus('invalid');
        setResolvedName('');
      } else {
        setUsernameStatus('valid');
        setResolvedName('Ada Okafor');
      }
    }, 1500);
  }

  function handleAcctBlur() {
    if (accountNumber.length < 10 || !selectedBank) return;
    setAcctStatus('checking');
    acctTimer.current = setTimeout(() => {
      setAcctStatus('valid');
      setResolvedAcct('John Adewale');
    }, 1500);
  }

  function handleProcess() { setStep('pin'); }

  function handleCompleteTransfer() {
    setStep('loading');
    setTimeout(() => setStep('success'), 2200);
  }

  function handleDone() { onClose(); }

  const amountNum       = parseAmount(amountRaw);
  const hasAmount       = amountNum > 0;
  const canProcessCopay = usernameStatus === 'valid' && hasAmount;
  const canProcessBank  = acctStatus === 'valid' && hasAmount;
  const canComplete     = pin.length === 4;

  const recipientDisplay = option === 'copay'
    ? resolvedName || username
    : resolvedAcct
      ? `${resolvedAcct} · ${accountNumber}`
      : accountNumber;

  const bankDisplay = option === 'bank' && selectedBank ? selectedBank : '';
  const amountDisplay = formatFinal(currencySymbol, amountRaw);

  const txnDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`send-drawer${open ? ' send-drawer--open' : ''}`} aria-label="Send Money" aria-hidden={!open}>

        {step === 'select' && (
          <>
            <div className="send-drawer__header">
              <div>
                <h2 className="send-drawer__title">Send Money</h2>
                <p className="send-drawer__subtitle">Choose how you want to send</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              <div className="send-options">
                <button className="send-option-card" type="button" onClick={() => { setOption('copay'); setStep('form'); }}>
                  <span className="send-option-card__icon send-option-card__icon--copay">
                    <CopayIcon size={20} color="#fff" />
                  </span>
                  <div className="send-option-card__text">
                    <span className="send-option-card__title">Copay to Copay</span>
                    <span className="send-option-card__sub">Send instantly to another Copay user</span>
                  </div>
                  <ChevronRightIcon size={18} color="#bbb" />
                </button>

                <button className="send-option-card" type="button" onClick={() => { setOption('bank'); setStep('form'); }}>
                  <span className="send-option-card__icon send-option-card__icon--bank">
                    <BankIcon size={20} color="#fff" />
                  </span>
                  <div className="send-option-card__text">
                    <span className="send-option-card__title">Copay to Other Bank</span>
                    <span className="send-option-card__sub">Transfer to any Nigerian bank account</span>
                  </div>
                  <ChevronRightIcon size={18} color="#bbb" />
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'form' && option === 'copay' && (
          <>
            <div className="send-drawer__header">
              <div>
                <button className="send-drawer__back" onClick={() => setStep('select')} type="button">← Back</button>
                <h2 className="send-drawer__title">Copay to Copay</h2>
                <p className="send-drawer__subtitle">Sending from your {currencyCode} wallet</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              <div className="send-form">
                <div className="send-field">
                  <label className="send-field__label">Recipient Username</label>
                  <div className={`send-field__input-wrap${usernameStatus === 'valid' ? ' send-field__input-wrap--valid' : usernameStatus === 'invalid' ? ' send-field__input-wrap--invalid' : ''}`}>
                    <input
                      className="send-field__input"
                      type="text"
                      placeholder="@username"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setUsernameStatus('idle'); setResolvedName(''); }}
                      onBlur={handleUsernameBlur}
                    />
                    {usernameStatus === 'checking' && <span className="send-field__status send-field__status--spin"><SpinnerIcon size={16} color="#888" /></span>}
                    {usernameStatus === 'valid'    && <span className="send-field__status send-field__status--ok">✓</span>}
                    {usernameStatus === 'invalid'  && <span className="send-field__status send-field__status--err">✗</span>}
                  </div>
                  {usernameStatus === 'valid'   && <p className="send-field__hint send-field__hint--ok">✓ {resolvedName}</p>}
                  {usernameStatus === 'invalid' && <p className="send-field__hint send-field__hint--err">Username not found</p>}
                </div>

                <div className="send-field">
                  <label className="send-field__label">Amount ({currencyCode})</label>
                  <div className="send-field__input-wrap">
                    <span className="send-field__prefix">{currencySymbol}</span>
                    <input
                      className="send-field__input send-field__input--prefixed"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amountRaw}
                      onChange={handleAmountChange}
                    />
                  </div>
                </div>

                <button className="send-btn-primary" type="button" disabled={!canProcessCopay} onClick={handleProcess}>
                  Process
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'form' && option === 'bank' && (
          <>
            <div className="send-drawer__header">
              <div>
                <button className="send-drawer__back" onClick={() => setStep('select')} type="button">← Back</button>
                <h2 className="send-drawer__title">Copay to Other Bank</h2>
                <p className="send-drawer__subtitle">Sending from your {currencyCode} wallet</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              <div className="send-form">
                <div className="send-field">
                  <label className="send-field__label">Account Number</label>
                  <div className={`send-field__input-wrap${acctStatus === 'valid' ? ' send-field__input-wrap--valid' : acctStatus === 'invalid' ? ' send-field__input-wrap--invalid' : ''}`}>
                    <input
                      className="send-field__input"
                      type="text"
                      inputMode="numeric"
                      placeholder="10-digit account number"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, '')); setAcctStatus('idle'); setResolvedAcct(''); }}
                      onBlur={handleAcctBlur}
                    />
                    {acctStatus === 'checking' && <span className="send-field__status send-field__status--spin"><SpinnerIcon size={16} color="#888" /></span>}
                    {acctStatus === 'valid'    && <span className="send-field__status send-field__status--ok">✓</span>}
                    {acctStatus === 'invalid'  && <span className="send-field__status send-field__status--err">✗</span>}
                  </div>
                  {acctStatus === 'valid'   && <p className="send-field__hint send-field__hint--ok">✓ {resolvedAcct}</p>}
                  {acctStatus === 'invalid' && <p className="send-field__hint send-field__hint--err">Account not found</p>}
                </div>

                <div className="send-field">
                  <label className="send-field__label">Choose Bank</label>
                  <select
                    className="send-field__select"
                    value={selectedBank}
                    onChange={(e) => { setSelectedBank(e.target.value); setAcctStatus('idle'); setResolvedAcct(''); }}
                  >
                    <option value="">Select a bank</option>
                    {DEMO_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="send-field">
                  <label className="send-field__label">Amount ({currencyCode})</label>
                  <div className="send-field__input-wrap">
                    <span className="send-field__prefix">{currencySymbol}</span>
                    <input
                      className="send-field__input send-field__input--prefixed"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amountRaw}
                      onChange={handleAmountChange}
                    />
                  </div>
                </div>

                <button className="send-btn-primary" type="button" disabled={!canProcessBank} onClick={handleProcess}>
                  Process
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'pin' && (
          <>
            <div className="send-drawer__header">
              <div>
                <button className="send-drawer__back" onClick={() => setStep('form')} type="button">← Back</button>
                <h2 className="send-drawer__title">Enter Transfer PIN</h2>
                <p className="send-drawer__subtitle">Confirm your 4-digit transfer PIN</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              <div className="send-pin-section">
                <div className="send-pin-summary">
                  <p className="send-pin-summary__label">Sending</p>
                  <p className="send-pin-summary__amount">{amountDisplay}</p>
                  <p className="send-pin-summary__to">To: <strong>{recipientDisplay}</strong></p>
                  {bankDisplay && <p className="send-pin-summary__bank">{bankDisplay}</p>}
                </div>
                <PinInput value={pin} onChange={setPin} />
                <button className="send-btn-primary" type="button" disabled={!canComplete} onClick={handleCompleteTransfer}>
                  Complete Transfer
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'loading' && (
          <div className="send-drawer__loading">
            <span className="send-ring-loader" aria-hidden="true" />
            <p className="send-drawer__loading-text">Processing transfer…</p>
          </div>
        )}

        {step === 'success' && (
          <div className="send-drawer__success">
            <div className="send-success__icon">
              <CheckCircleIcon size={64} color="#16a34a" />
            </div>
            <h2 className="send-success__title">Transfer Successful!</h2>
            <p className="send-success__msg">
              You sent <strong>{amountDisplay}</strong> to <strong>{recipientDisplay}</strong>.
            </p>
            <div className="send-success__meta">
              <div className="send-success__row">
                <span>Recipient</span>
                <span>{recipientDisplay}</span>
              </div>
              {bankDisplay && (
                <div className="send-success__row">
                  <span>Bank</span>
                  <span>{bankDisplay}</span>
                </div>
              )}
              {option === 'bank' && (
                <div className="send-success__row">
                  <span>Account No.</span>
                  <span>{accountNumber}</span>
                </div>
              )}
              <div className="send-success__row">
                <span>Amount</span>
                <span>{amountDisplay}</span>
              </div>
              <div className="send-success__row">
                <span>Currency</span>
                <span>{currencyCode}</span>
              </div>
              <div className="send-success__row">
                <span>Reference</span>
                <span>{txnRef}</span>
              </div>
              <div className="send-success__row">
                <span>Date & Time</span>
                <span>{txnDate}</span>
              </div>
              <div className="send-success__row">
                <span>Status</span>
                <span className="send-success__status">Completed</span>
              </div>
            </div>
            <button className="send-btn-primary" type="button" onClick={handleDone}>Done</button>
          </div>
        )}

      </aside>
    </>
  );
}
