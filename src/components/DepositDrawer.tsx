import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useWallet } from '../contexts/WalletContext';
import { XIcon, BankIcon, CheckCircleIcon, ChevronRightIcon } from './Icons';
import { depositBankAccounts } from '../pages/DepositBankPage';

/* ─── Types ─────────────────────────────────────────────────────── */
type Method = 'bank' | 'card' | 'ussd';
type Step   = 'select' | 'bank-loading' | 'bank-pick' | 'bank-details' | 'card' | 'ussd';

/* ─── Icons ─────────────────────────────────────────────────────── */
function CardIcon2({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8"/>
      <path d="M2 10h20" stroke={color} strokeWidth="1.8"/>
      <path d="M6 15h4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function PhoneIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 3.5h3l1.2 4-2 1.2a13 13 0 0 0 5.6 5.6l1.2-2 4 1.2v3a1.5 1.5 0 0 1-1.6 1.5C11.5 21 3 12.5 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l7 4v5c0 5-3.5 9-7 10C8.5 20 5 16 5 11V6l7-4z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CopyIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke={color} strokeWidth="1.8"/>
      <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function AlertIcon({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
      <path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────── */
function formatWithCommas(raw: string): string {
  const clean = raw.replace(/[^0-9.]/g, '');
  const parts = clean.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : parts[0];
}

function parseNum(v: string) { return parseFloat(v.replace(/,/g, '')) || 0; }

const QUICK_AMOUNTS = ['50,000', '100,000', '200,000', '500,000', '1,000,000'];

/* ─── Props ─────────────────────────────────────────────────────── */
interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function DepositDrawer({ open, onClose }: DepositDrawerProps) {
  const navigate             = useNavigate();
  const { activeWallet }     = useWallet();
  const symbol               = activeWallet.symbol;
  const currencyCode         = activeWallet.currency;

  const [step,          setStep]          = useState<Step>('select');
  const [savedBanks,    setSavedBanks]    = useState(depositBankAccounts);
  const [selectedBank,  setSelectedBank]  = useState<typeof depositBankAccounts[number] | null>(null);
  const [search,        setSearch]        = useState('');
  const [amount,        setAmount]        = useState('');
  const [rawAmount,     setRawAmount]     = useState('');
  const [amountError,   setAmountError]   = useState('');
  const [copiedKey,     setCopiedKey]     = useState<string | null>(null);
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [showSuccess,   setShowSuccess]   = useState(false);
  const [showFail,      setShowFail]      = useState(false);
  const [method,        setMethod]        = useState<Method>('bank');

  const reset = useCallback(() => {
    setStep('select');
    setSelectedBank(null);
    setSearch('');
    setAmount('');
    setRawAmount('');
    setAmountError('');
    setCopiedKey(null);
    setIsProcessing(false);
    setShowSuccess(false);
    setShowFail(false);
  }, []);

  useEffect(() => { if (!open) setTimeout(reset, 300); }, [open, reset]);

  /* ── filtered banks ── */
  const filteredBanks = savedBanks.filter((b) => {
    const q = search.toLowerCase();
    return b.bankName.toLowerCase().includes(q) ||
      b.accountName.toLowerCase().includes(q) ||
      b.accountNumber.includes(q);
  });

  /* ── amount handlers ── */
  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setRawAmount(raw);
    setAmount(formatWithCommas(raw));
    if (amountError) setAmountError('');
  }

  function handleQuick(val: string) {
    setRawAmount(val.replace(/,/g, ''));
    setAmount(val);
    if (amountError) setAmountError('');
  }

  function validateAmount(): boolean {
    const n = parseNum(rawAmount);
    if (!rawAmount) { setAmountError('Please enter an amount'); return false; }
    if (n <= 0)     { setAmountError('Enter a valid amount greater than 0'); return false; }
    if (n < 100)    { setAmountError('Minimum deposit is ₦100'); return false; }
    return true;
  }

  /* ── copy ── */
  async function handleCopy(key: string, value: string) {
    try { await navigator.clipboard.writeText(value); } catch {}
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
  }

  /* ── enter bank step with loading ── */
  function enterBankPick() {
    setMethod('bank');
    setStep('bank-loading');
    setTimeout(() => {
      setSavedBanks([...depositBankAccounts]);
      setStep('bank-pick');
    }, 1500);
  }

  /* ── submit ── */
  function handleDeposit() {
    if (!validateAmount()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  }

  /* ── back ── */
  function handleBack() {
    if (step === 'bank-details') { setStep('bank-pick'); setAmount(''); setRawAmount(''); setAmountError(''); }
    else { setStep('select'); setSelectedBank(null); setAmount(''); setRawAmount(''); setAmountError(''); setSearch(''); }
  }

  const cardFee    = rawAmount ? (parseNum(rawAmount) * 0.015).toFixed(2) : '0.00';
  const cardTotal  = rawAmount ? formatWithCommas((parseNum(rawAmount) * 1.015).toFixed(2)) : '0.00';
  const ussdCode   = `*737*50*${rawAmount || 'AMOUNT'}#`;
  const isFormStep = ['bank-details', 'card', 'ussd'].includes(step);

  const stepTitle: Record<Step, string> = {
    'select':       'Fund Your Wallet',
    'bank-loading': 'Select Bank Account',
    'bank-pick':    'Select Bank Account',
    'bank-details': 'Bank Transfer',
    'card':         'Debit Card',
    'ussd':         'USSD Deposit',
  };

  const stepSub: Record<Step, string> = {
    'select':       'Choose your preferred deposit method',
    'bank-loading': 'Choose which account to fund',
    'bank-pick':    'Choose which account to fund',
    'bank-details': 'Transfer to your saved account',
    'card':         'Top up instantly using your card',
    'ussd':         'Dial a code to deposit from your bank',
  };

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`send-drawer${open ? ' send-drawer--open' : ''}`} aria-label="Deposit" aria-hidden={!open}>

        {/* ── Header ── */}
        <div className="send-drawer__header">
          <div>
            {step !== 'select' && (
              <button className="send-drawer__back" type="button" onClick={handleBack}>← Back</button>
            )}
            <h2 className="send-drawer__title">{stepTitle[step]}</h2>
            <p className="send-drawer__subtitle">{stepSub[step]}</p>
          </div>
          <button className="send-drawer__close" type="button" onClick={onClose} aria-label="Close">
            <XIcon size={18} color="#555" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="dep-drawer__body">

          {/* Step: select method */}
          {step === 'select' && (
            <div className="send-options">
              <button className="send-option-card" type="button" onClick={enterBankPick}>
                <span className="send-option-card__icon send-option-card__icon--bank">
                  <BankIcon size={20} color="#fff" />
                </span>
                <div className="send-option-card__text">
                  <span className="send-option-card__title">Bank Deposit</span>
                  <span className="send-option-card__sub">Deposit via your saved account</span>
                </div>
                <ChevronRightIcon size={18} color="#bbb" />
              </button>

              <button className="send-option-card" type="button" onClick={() => { setMethod('card'); setStep('card'); }}>
                <span className="send-option-card__icon dep-icon--card">
                  <CardIcon2 size={20} color="#fff" />
                </span>
                <div className="send-option-card__text">
                  <span className="send-option-card__title">Debit Card</span>
                  <span className="send-option-card__sub">Top up instantly using your card</span>
                </div>
                <ChevronRightIcon size={18} color="#bbb" />
              </button>

              <button className="send-option-card" type="button" onClick={() => { setMethod('ussd'); setStep('ussd'); }}>
                <span className="send-option-card__icon dep-icon--ussd">
                  <PhoneIcon size={20} color="#fff" />
                </span>
                <div className="send-option-card__text">
                  <span className="send-option-card__title">USSD</span>
                  <span className="send-option-card__sub">Dial a code to deposit from your bank</span>
                </div>
                <ChevronRightIcon size={18} color="#bbb" />
              </button>
            </div>
          )}

          {/* Step: bank loading */}
          {step === 'bank-loading' && (
            <div className="dep-spinner-wrap">
              <span className="dep-spinner" aria-label="Loading accounts" />
              <p className="dep-spinner-text">Fetching your accounts…</p>
            </div>
          )}

          {/* Step: bank pick */}
          {step === 'bank-pick' && (
            <>
              {/* Search */}
              <div className="dep-search-wrap">
                <svg className="dep-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" stroke="#aaa" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  className="dep-search-input"
                  type="search"
                  placeholder="Search bank name, account name or number…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Bank list */}
              <div className="dep-bank-list">
                {filteredBanks.length > 0 ? filteredBanks.map((bank) => {
                  const isSelected = selectedBank?.id === bank.id;
                  return (
                    <button
                      key={bank.id}
                      className={`dep-bank-item${isSelected ? ' dep-bank-item--selected' : ''}`}
                      type="button"
                      onClick={() => { setSelectedBank(bank); setStep('bank-details'); }}
                      onTouchEnd={(e) => { e.preventDefault(); setSelectedBank(bank); setStep('bank-details'); }}
                    >
                      <div className="dep-bank-item__icon">
                        {isSelected
                          ? <CheckCircleIcon size={20} color="#16a34a" />
                          : <BankIcon size={20} color="#666" />}
                      </div>
                      <div className="dep-bank-item__body">
                        <span className="dep-bank-item__name">{bank.bankName}</span>
                        <span className="dep-bank-item__holder">{bank.accountName}</span>
                        <span className="dep-bank-item__number">{bank.accountNumber}</span>
                      </div>
                      <span className="dep-bank-item__badge">
                        <ShieldIcon size={12} color="#16a34a" /> verified
                      </span>
                    </button>
                  );
                }) : (
                  <div className="dep-empty">
                    <BankIcon size={40} color="#ccc" />
                    <p className="dep-empty__title">No bank accounts found</p>
                    <button
                      className="dep-empty__btn"
                      type="button"
                      onClick={() => { onClose(); navigate('/deposit-banks'); }}
                    >
                      Add new bank
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step: bank details + amount */}
          {step === 'bank-details' && selectedBank && (
            <>
              <div className="dep-info-card">
                <div className="dep-info-card__header">
                  <ShieldIcon size={16} color="var(--color-ink)" />
                  <span>Bank Transfer Details</span>
                </div>
                {[
                  { key: 'bank',    label: 'Bank Name',       value: selectedBank.bankName },
                  { key: 'number',  label: 'Account Number',  value: selectedBank.accountNumber },
                  { key: 'holder',  label: 'Account Name',    value: selectedBank.accountName },
                ].map((row) => (
                  <div key={row.key} className="dep-detail-row">
                    <div className="dep-detail-row__icon"><BankIcon size={14} color="#888" /></div>
                    <div className="dep-detail-row__body">
                      <span className="dep-detail-row__label">{row.label}</span>
                      <div className="dep-detail-row__value-wrap">
                        <span className="dep-detail-row__value">{row.value}</span>
                        <button
                          className={`dep-copy-btn${copiedKey === row.key ? ' dep-copy-btn--copied' : ''}`}
                          type="button"
                          onClick={() => handleCopy(row.key, row.value)}
                          aria-label={`Copy ${row.label}`}
                        >
                          {copiedKey === row.key
                            ? <><CheckCircleIcon size={13} color="#15803d" /> Copied</>
                            : <><CopyIcon size={13} color="currentColor" /> Copy</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <AmountSection
                symbol={symbol}
                amount={amount}
                amountError={amountError}
                isProcessing={isProcessing}
                onChange={handleAmountChange}
                onQuick={handleQuick}
              />

              <div className="dep-summary">
                <div className="dep-summary__row">
                  <span>Amount</span>
                  <span>{symbol}{amount || '0.00'}</span>
                </div>
                <div className="dep-summary__divider" />
                <div className="dep-summary__row dep-summary__row--total">
                  <span>Total to Deposit</span>
                  <span>{symbol}{amount || '0.00'}</span>
                </div>
              </div>
            </>
          )}

          {/* Step: card */}
          {step === 'card' && (
            <>
              <div className="dep-info-card">
                <div className="dep-info-card__header">
                  <CardIcon2 size={16} color="var(--color-ink)" />
                  <span>Card Payment</span>
                </div>
                <p className="dep-info-card__text">
                  Enter the amount you want to deposit. You'll be redirected to complete the card payment securely.
                </p>
              </div>

              <AmountSection
                symbol={symbol}
                amount={amount}
                amountError={amountError}
                isProcessing={isProcessing}
                onChange={handleAmountChange}
                onQuick={handleQuick}
              />

              <div className="dep-summary">
                <div className="dep-summary__row">
                  <span>Amount</span>
                  <span>{symbol}{amount || '0.00'}</span>
                </div>
                <div className="dep-summary__row">
                  <span>Card Processing Fee (1.5%)</span>
                  <span>{symbol}{cardFee}</span>
                </div>
                <div className="dep-summary__divider" />
                <div className="dep-summary__row dep-summary__row--total">
                  <span>Total to Pay</span>
                  <span>{symbol}{cardTotal}</span>
                </div>
              </div>
            </>
          )}

          {/* Step: USSD */}
          {step === 'ussd' && (
            <>
              <div className="dep-info-card">
                <div className="dep-info-card__header">
                  <PhoneIcon size={16} color="var(--color-ink)" />
                  <span>USSD Deposit</span>
                </div>
                <p className="dep-info-card__text">
                  Dial the USSD code from your registered phone number to complete this deposit.
                </p>
                <div className="dep-ussd-box">
                  <span className="dep-ussd-box__label">USSD Code</span>
                  <div className="dep-ussd-box__row">
                    <span className="dep-ussd-box__code">{ussdCode}</span>
                    <button
                      className={`dep-copy-btn${copiedKey === 'ussd' ? ' dep-copy-btn--copied' : ''}`}
                      type="button"
                      onClick={() => handleCopy('ussd', ussdCode)}
                    >
                      {copiedKey === 'ussd'
                        ? <><CheckCircleIcon size={13} color="#15803d" /> Copied</>
                        : <><CopyIcon size={13} color="currentColor" /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>

              <AmountSection
                symbol={symbol}
                amount={amount}
                amountError={amountError}
                isProcessing={isProcessing}
                onChange={handleAmountChange}
                onQuick={handleQuick}
              />

              <div className="dep-summary">
                <div className="dep-summary__row">
                  <span>Amount</span>
                  <span>{symbol}{amount || '0.00'}</span>
                </div>
                <div className="dep-summary__divider" />
                <div className="dep-summary__row dep-summary__row--total">
                  <span>Total to Deposit</span>
                  <span>{symbol}{amount || '0.00'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer (form steps only) ── */}
        {isFormStep && (
          <div className="dep-footer">
            <div className="dep-footer__btns">
              <button className="dep-footer__back-btn" type="button" onClick={handleBack} disabled={isProcessing}>
                Back
              </button>
              <button className="dep-footer__confirm-btn" type="button" onClick={handleDeposit} disabled={isProcessing}>
                {isProcessing ? (
                  <><span className="dep-footer__spinner" /> Processing…</>
                ) : (
                  <><ShieldIcon size={15} color="#fff" /> Complete</>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ── Success Modal ── */}
      {showSuccess && (
        <>
          <div className="dep-modal-overlay" onClick={() => { setShowSuccess(false); onClose(); }} />
          <div className="dep-modal">
            <div className="dep-modal__content">
              <div className="dep-modal__icon dep-modal__icon--success">
                <CheckCircleIcon size={48} color="#16a34a" />
              </div>
              <h3 className="dep-modal__title">Deposit Successful!</h3>
              <p className="dep-modal__msg">
                Your deposit of {symbol}{amount} has been processed. The funds will reflect in your wallet shortly.
              </p>
              <div className="dep-modal__details">
                <div className="dep-modal__detail-row">
                  <span>Amount</span><span>{symbol}{amount}</span>
                </div>
                <div className="dep-modal__detail-row">
                  <span>Method</span>
                  <span>{method === 'bank' ? 'Bank Deposit' : method === 'card' ? 'Debit Card' : 'USSD'}</span>
                </div>
                <div className="dep-modal__detail-row">
                  <span>Currency</span><span>{currencyCode}</span>
                </div>
              </div>
              <button className="dep-modal__btn dep-modal__btn--primary" type="button"
                onClick={() => { setShowSuccess(false); onClose(); }}>
                Done
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Failure Modal ── */}
      {showFail && (
        <>
          <div className="dep-modal-overlay" onClick={() => setShowFail(false)} />
          <div className="dep-modal">
            <div className="dep-modal__content">
              <div className="dep-modal__icon dep-modal__icon--fail">
                <AlertIcon size={48} color="#e5403a" />
              </div>
              <h3 className="dep-modal__title">Deposit Failed</h3>
              <p className="dep-modal__msg">We couldn't process your deposit. Please try again.</p>
              <div className="dep-modal__actions">
                <button className="dep-modal__btn dep-modal__btn--ghost" type="button" onClick={() => setShowFail(false)}>
                  Cancel
                </button>
                <button className="dep-modal__btn dep-modal__btn--primary" type="button"
                  onClick={() => { setShowFail(false); handleDeposit(); }}>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ─── Shared AmountSection ───────────────────────────────────────── */
function AmountSection({
  symbol, amount, amountError, isProcessing, onChange, onQuick,
}: {
  symbol: string;
  amount: string;
  amountError: string;
  isProcessing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuick: (val: string) => void;
}) {
  return (
    <div className="dep-amount-section">
      <label className="dep-amount-section__label">Enter Amount</label>
      <div className={`dep-amount-wrap${amountError ? ' dep-amount-wrap--error' : ''}`}>
        <span className="dep-amount-wrap__symbol">{symbol}</span>
        <input
          className="dep-amount-input"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={onChange}
          disabled={isProcessing}
        />
      </div>
      {amountError && <span className="dep-amount-error">{amountError}</span>}
      <div className="dep-quick-amounts">
        {QUICK_AMOUNTS.map((v) => (
          <button key={v} className="dep-quick-btn" type="button" onClick={() => onQuick(v)} disabled={isProcessing}>
            {symbol}{v}
          </button>
        ))}
      </div>
    </div>
  );
}
