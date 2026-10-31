import { useState, useRef, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router';
import { XIcon, BankIcon, CheckCircleIcon, SpinnerIcon, ChevronRightIcon, MapPinIcon } from './Icons';
import { depositBankAccounts } from '../pages/DepositBankPage';

type SendOption = 'copay' | 'bank';
type Step = 'select' | 'bank-pick' | 'form' | 'pin' | 'loading' | 'success';

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
  const navigate          = useNavigate();
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
  const [savedBanks, setSavedBanks]           = useState(depositBankAccounts);
  const [banksLoading, setBanksLoading]       = useState(false);
  const [fromSavedBank, setFromSavedBank]     = useState(false);

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
    setFromSavedBank(false);
  }, []);

  useEffect(() => {
    if (!open) { setTimeout(reset, 300); }
    if (open)  { setSavedBanks([...depositBankAccounts]); }
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
        setResolvedName(username.startsWith('@') ? username : `@${username}`);
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

  function pickSavedBank(bank: typeof depositBankAccounts[number]) {
    setAccountNumber(bank.accountNumber);
    setSelectedBank(bank.bankName);
    setResolvedAcct(bank.accountName);
    setAcctStatus('valid');
    setFromSavedBank(true);
    setStep('form');
  }

  function enterBankPick() {
    setOption('bank');
    setStep('bank-pick');
    setBanksLoading(true);
    setTimeout(() => {
      setSavedBanks([...depositBankAccounts]);
      setBanksLoading(false);
    }, 3000);
  }

  function goToDepositBanks() {
    onClose();
    navigate('/deposit-banks');
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

  const bankDisplay   = option === 'bank' && selectedBank ? selectedBank : '';
  const amountDisplay = formatFinal(currencySymbol, amountRaw);

  const txnDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`send-drawer${open ? ' send-drawer--open' : ''}`} aria-label="Send Money" aria-hidden={!open}>

        {/* ── Step 1: choose method ── */}
        {step === 'select' && (
          <>
            <div className="send-select__topbar">
              <button className="send-select__prev-btn" onClick={onClose} type="button" aria-label="Close">
                <span className="send-select__prev-chevron">
                  <ChevronRightIcon size={16} color="#fff" />
                </span>
                <span>Previous</span>
              </button>
            </div>
            <div className="send-select__body">
              <div className="send-select__options">

                <button className="send-select__card" type="button" onClick={() => { setOption('copay'); setStep('form'); }}>
                  <span className="send-select__card-icon send-select__card-icon--copay">
                    <span className="send-select__card-symbol">{currencySymbol}</span>
                  </span>
                  <div className="send-select__card-text">
                    <span className="send-select__card-title">Send money to Copay User</span>
                    <span className="send-select__card-sub">Send money to a Copay user's wallet</span>
                  </div>
                  <span className="send-select__card-arrow">
                    <ChevronRightIcon size={16} color="#fff" />
                  </span>
                </button>

                <button className="send-select__card" type="button" onClick={enterBankPick}>
                  <span className="send-select__card-icon send-select__card-icon--bank">
                    <BankIcon size={22} color="#999" />
                  </span>
                  <div className="send-select__card-text">
                    <span className="send-select__card-title">Transfer to Bank Account</span>
                    <span className="send-select__card-sub">Withdraw to bank account of your choice</span>
                  </div>
                  <span className="send-select__card-arrow">
                    <ChevronRightIcon size={16} color="#fff" />
                  </span>
                </button>

              </div>

              <button className="send-select__atm-banner" type="button">
                <MapPinIcon size={20} color="#e8453c" />
                <span className="send-select__atm-text">Click here to find our nearby merchant or ATM</span>
                <ChevronRightIcon size={16} color="#fff" />
              </button>
            </div>
          </>
        )}

        {/* ── Step 2 (bank): pick saved deposit account ── */}
        {step === 'bank-pick' && (
          <>
            <div className="send-drawer__header">
              <div>
                <button className="send-drawer__back" onClick={() => setStep('select')} type="button">← Back</button>
                <h2 className="send-drawer__title">Copay to Other Bank</h2>
                <p className="send-drawer__subtitle">Select a saved account or use a different one</p>
              </div>
              <button className="send-drawer__close" onClick={onClose} type="button" aria-label="Close">
                <XIcon size={18} color="#555" />
              </button>
            </div>
            <div className="send-drawer__body">
              {banksLoading ? (
                <div className="send-bank-pick__spinner-wrap">
                  <span className="send-bank-pick__spinner" aria-label="Loading accounts" />
                  <p className="send-bank-pick__spinner-text">Fetching your accounts…</p>
                </div>
              ) : savedBanks.length > 0 ? (
                <>
                  <p className="send-bank-pick__label">Your deposit accounts</p>
                  <div className="send-bank-pick__list">
                    {savedBanks.map((bank) => (
                      <button
                        key={bank.id}
                        className="send-bank-pick__item"
                        type="button"
                        onClick={() => pickSavedBank(bank)}
                        onTouchEnd={(e) => { e.preventDefault(); pickSavedBank(bank); }}
                      >
                        <span className="send-bank-pick__icon">
                          <BankIcon size={18} color="#fff" />
                        </span>
                        <div className="send-bank-pick__info">
                          <span className="send-bank-pick__name">{bank.accountName}</span>
                          <span className="send-bank-pick__meta">{bank.bankName} · {bank.accountNumber}</span>
                        </div>
                        <ChevronRightIcon size={16} color="#bbb" />
                      </button>
                    ))}
                  </div>
                  <div className="send-bank-pick__divider"><span>or</span></div>
                </>
              ) : (
                <p className="send-bank-pick__empty">No saved deposit accounts found.</p>
              )}
              {!banksLoading && (
                <button
                  className="send-bank-pick__new-btn"
                  type="button"
                  onClick={goToDepositBanks}
                  onTouchEnd={(e) => { e.preventDefault(); goToDepositBanks(); }}
                >
                  + Use a different account
                </button>
              )}
            </div>
          </>
        )}

        {/* ── Step 3 copay: form ── */}
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
                      placeholder="Enter username or Copay ID"
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

        {/* ── Step 3 bank: form ── */}
        {step === 'form' && option === 'bank' && (
          <>
            <div className="send-drawer__header">
              <div>
                <button className="send-drawer__back" onClick={() => setStep('bank-pick')} type="button">← Back</button>
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
                  {fromSavedBank ? (
                    <div className="send-field__readonly">
                      <span>{accountNumber}</span>
                      {resolvedAcct && <span className="send-field__readonly-resolved">✓ {resolvedAcct}</span>}
                    </div>
                  ) : (
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
                  )}
                  {!fromSavedBank && acctStatus === 'valid'   && <p className="send-field__hint send-field__hint--ok">✓ {resolvedAcct}</p>}
                  {!fromSavedBank && acctStatus === 'invalid' && <p className="send-field__hint send-field__hint--err">Account not found</p>}
                </div>

                <div className="send-field">
                  <label className="send-field__label">Choose Bank</label>
                  {fromSavedBank ? (
                    <div className="send-field__readonly">
                      <span>{selectedBank}</span>
                    </div>
                  ) : (
                    <select
                      className="send-field__select"
                      value={selectedBank}
                      onChange={(e) => { setSelectedBank(e.target.value); setAcctStatus('idle'); setResolvedAcct(''); }}
                    >
                      <option value="">Select a bank</option>
                      {DEMO_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  )}
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

        {/* ── PIN ── */}
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

        {/* ── Loading ── */}
        {step === 'loading' && (
          <div className="send-drawer__loading">
            <span className="send-ring-loader" aria-hidden="true" />
            <p className="send-drawer__loading-text">Processing transfer…</p>
          </div>
        )}

        {/* ── Success ── */}
        {step === 'success' && (
          <div className="send-drawer__success">
            <div className="send-success__inner">
              <div className="send-success__icon">
                <CheckCircleIcon size={64} color="#16a34a" />
              </div>
              <h2 className="send-success__title">Transfer Successful!</h2>
              <p className="send-success__msg">
                You sent <strong>{amountDisplay}</strong> to <strong>{recipientDisplay}</strong>.
              </p>
              <div className="send-success__meta">
                <div className="send-success__row"><span>Recipient</span><span>{recipientDisplay}</span></div>
                {bankDisplay && <div className="send-success__row"><span>Bank</span><span>{bankDisplay}</span></div>}
                {option === 'bank' && <div className="send-success__row"><span>Account No.</span><span>{accountNumber}</span></div>}
                <div className="send-success__row"><span>Amount</span><span>{amountDisplay}</span></div>
                <div className="send-success__row"><span>Currency</span><span>{currencyCode}</span></div>
                <div className="send-success__row"><span>Reference</span><span>{txnRef}</span></div>
                <div className="send-success__row"><span>Date & Time</span><span>{txnDate}</span></div>
                <div className="send-success__row"><span>Status</span><span className="send-success__status">Completed</span></div>
              </div>
              <button className="send-btn-primary" type="button" onClick={handleDone}>Done</button>
            </div>
          </div>
        )}

      </aside>
    </>
  );
}
