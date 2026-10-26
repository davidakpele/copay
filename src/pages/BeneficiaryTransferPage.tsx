import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import AppShell from '../components/AppShell';
import { useWallet, wallets } from '../contexts/WalletContext';
import { beneficiaries, BANKS, initials, type Beneficiary } from './BeneficiaryPage';
import type { Wallet } from '../types';

const DAILY_LIMIT = 1_000_000;
const USED_AMOUNT = 0;

export default function BeneficiaryTransferPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefill   = (location.state as { beneficiary?: Beneficiary } | null)?.beneficiary;

  const { activeWallet, setActiveWallet } = useWallet();

  /* form state */
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(activeWallet);
  const [bankCode,        setBankCode]       = useState(prefill?.bankCode ?? '');
  const [account,         setAccount]        = useState(prefill?.account  ?? '');
  const [amount,          setAmount]         = useState('');
  const [narration,       setNarration]      = useState('');

  /* wallet modal */
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  /* processing / success */
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txnRef]    = useState(() => `TXN${Date.now().toString().slice(-8)}`);

  const resolvedName =
    prefill && bankCode === prefill.bankCode && account === prefill.account
      ? prefill.name.toUpperCase()
      : account.length === 10 ? 'ACCOUNT HOLDER' : '';

  const canProceed = selectedWallet && bankCode && account.length === 10 && parseFloat(amount) > 0;

  const frequent = beneficiaries.filter((b) => b.tab === 'Transfer').slice(0, 5);
  const usedPct  = Math.min((USED_AMOUNT / DAILY_LIMIT) * 100, 100);
  const selectedBank = BANKS.find((b) => b.code === bankCode);

  function pickBeneficiary(b: Beneficiary) {
    setBankCode(b.bankCode);
    setAccount(b.account);
  }

  function handleProceed() {
    if (!canProceed) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
    }, 1800);
  }

  function handleDone() {
    setShowSuccess(false);
    navigate('/beneficiaries');
  }

  function fmtBalance(w: Wallet) {
    return `${w.symbol}${w.balance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return (
    <AppShell>
      <div className="btr-page">

        {/* Back */}
        <button className="bnf-back" type="button" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <h1 className="bnf-title">Other Bank Transfers</h1>

        <div className="btr-layout">

          {/* ── Main form ── */}
          <div className="btr-main">
            <div className="btr-card">

              {/* Source account — wallet selector */}
              <div className="bnf-field">
                <label className="bnf-field__label">Source Account</label>
                <button
                  className="btr-wallet-btn"
                  type="button"
                  onClick={() => setWalletModalOpen(true)}
                >
                  <span className="btr-wallet-btn__flag">{selectedWallet.flag}</span>
                  <div className="btr-wallet-btn__info">
                    <span className="btr-wallet-btn__name">{selectedWallet.currency} Wallet</span>
                    <span className="btr-wallet-btn__balance">{fmtBalance(selectedWallet)}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Daily limit bar */}
              <div className="btr-limit">
                <div className="btr-limit__row">
                  <span className="btr-limit__label">
                    Daily Transaction Limit: {selectedWallet.symbol}{DAILY_LIMIT.toLocaleString()}.00
                  </span>
                  <button className="btr-upgrade-btn" type="button">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Upgrade now
                  </button>
                </div>
                <div className="btr-limit__bar-track">
                  <div className="btr-limit__bar-fill" style={{ width: `${usedPct}%` }} />
                </div>
                <div className="btr-limit__row btr-limit__row--bottom">
                  <span className="btr-limit__used">{selectedWallet.symbol}{USED_AMOUNT.toLocaleString()}.00 used</span>
                  <span className="btr-limit__max">{selectedWallet.symbol}{DAILY_LIMIT.toLocaleString()}.00</span>
                </div>
              </div>

              {/* Frequent beneficiaries */}
              <p className="btr-section-label">Frequent Beneficiaries</p>
              <div className="btr-freq">
                <button className="btr-freq-tile btr-freq-tile--viewall" type="button" onClick={() => navigate('/beneficiaries')}>
                  <div className="btr-freq-tile__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M8 12h8M12 8l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="btr-freq-tile__label">View all</span>
                </button>
                {frequent.map((b) => (
                  <button
                    key={b.id}
                    className={`btr-freq-tile${bankCode === b.bankCode && account === b.account ? ' btr-freq-tile--active' : ''}`}
                    type="button"
                    onClick={() => pickBeneficiary(b)}
                    onTouchEnd={(e) => { e.preventDefault(); pickBeneficiary(b); }}
                  >
                    <div className="btr-freq-tile__avatar">{initials(b.name)}</div>
                    <span className="btr-freq-tile__label">{b.name.split(' ')[1] ?? b.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Bank */}
              <div className="bnf-field">
                <label className="bnf-field__label">Bank</label>
                <div className="bnf-field__select-wrap">
                  <select
                    className="bnf-field__select"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                  >
                    <option value="" disabled>Select bank</option>
                    {BANKS.map((b) => (
                      <option key={b.code} value={b.code}>{b.label}</option>
                    ))}
                  </select>
                  {bankCode && (
                    <button
                      className="bnf-field__clear"
                      type="button"
                      aria-label="Clear bank"
                      onClick={() => { setBankCode(''); setAccount(''); }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                  <svg className="bnf-field__select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Account number */}
              <div className="bnf-field">
                <label className="bnf-field__label">Beneficiary account number</label>
                <input
                  className="bnf-field__input"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter account number"
                  value={account}
                  onChange={(e) => setAccount(e.target.value.replace(/\D/g, ''))}
                />
                {resolvedName && <p className="bnf-field__resolved">{resolvedName}</p>}
              </div>

              {/* Amount */}
              <div className="bnf-field">
                <label className="bnf-field__label">Amount ({selectedWallet.currency})</label>
                <div className="btr-amount-wrap">
                  <span className="btr-amount-wrap__symbol">{selectedWallet.symbol}</span>
                  <input
                    className="bnf-field__input btr-amount-input"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  />
                </div>
              </div>

              {/* Narration */}
              <div className="bnf-field">
                <label className="bnf-field__label">Narration (optional)</label>
                <input
                  className="bnf-field__input"
                  type="text"
                  placeholder="e.g. Rent payment"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                />
              </div>

              <button
                className="bnf-submit-btn"
                type="button"
                disabled={!canProceed || processing}
                onClick={handleProceed}
              >
                {processing
                  ? <><span className="btr-spinner" /> Processing…</>
                  : 'Proceed'}
              </button>
            </div>
          </div>

          {/* ── Info panel ── */}
          <aside className="btr-info-card">
            {/* Header */}
            <div className="btr-info-card__header">
              <div className="btr-info-card__header-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2l7 4v5c0 5-3.5 9-7 10C8.5 20 5 16 5 11V6l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="btr-info-card__header-title">Secure Transfer</span>
            </div>

            {/* Steps */}
            <div className="btr-info-card__steps">
              {[
                { icon: '🏦', title: 'Select Source',  desc: 'Choose which wallet to send from' },
                { icon: '👤', title: 'Enter Recipient', desc: 'Add bank and account details'     },
                { icon: '💸', title: 'Set Amount',      desc: 'Enter the transfer amount'        },
                { icon: '✅', title: 'Confirm & Send',  desc: 'Review and complete the transfer' },
              ].map((s, i) => (
                <div key={i} className="btr-info-card__step">
                  <div className="btr-info-card__step-icon">{s.icon}</div>
                  <div>
                    <p className="btr-info-card__step-title">{s.title}</p>
                    <p className="btr-info-card__step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="btr-info-card__note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Transfers are processed instantly. Funds reflect within minutes for most Nigerian banks.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Wallet selection modal ── */}
      {walletModalOpen && (
        <div
          className="btr-modal-overlay"
          onClick={() => setWalletModalOpen(false)}
        >
          <div className="btr-wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="btr-wallet-modal__header">
              <h3>Select Wallet</h3>
              <button
                className="btr-wallet-modal__close"
                type="button"
                onClick={() => setWalletModalOpen(false)}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="btr-wallet-modal__list">
              {wallets.map((w) => {
                const isSelected = w.currency === selectedWallet.currency;
                return (
                  <button
                    key={w.currency}
                    className={`btr-wallet-option${isSelected ? ' btr-wallet-option--selected' : ''}`}
                    type="button"
                    onClick={() => {
                      setSelectedWallet(w);
                      setActiveWallet(w);
                      setWalletModalOpen(false);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      setSelectedWallet(w);
                      setActiveWallet(w);
                      setWalletModalOpen(false);
                    }}
                  >
                    <div className="btr-wallet-option__icon">
                      <span className="btr-wallet-option__flag">{w.flag}</span>
                    </div>
                    <div className="btr-wallet-option__body">
                      <span className="btr-wallet-option__name">{w.currency} Wallet</span>
                      <span className="btr-wallet-option__balance">{fmtBalance(w)}</span>
                    </div>
                    {isSelected && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Success modal ── */}
      {showSuccess && (
        <div className="btr-modal-overlay">
          <div className="btr-success-modal">
            <div className="btr-success-modal__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="btr-success-modal__title">Transfer Successful!</h2>
            <p className="btr-success-modal__sub">
              Your transfer has been processed and is on its way.
            </p>
            <div className="btr-success-modal__meta">
              <div className="btr-success-modal__row">
                <span>Recipient</span>
                <span>{resolvedName || account}</span>
              </div>
              <div className="btr-success-modal__row">
                <span>Bank</span>
                <span>{selectedBank?.label.split(' - ')[1] ?? bankCode}</span>
              </div>
              <div className="btr-success-modal__row">
                <span>Account No.</span>
                <span>{account}</span>
              </div>
              <div className="btr-success-modal__row">
                <span>Amount</span>
                <span>{selectedWallet.symbol}{parseFloat(amount).toLocaleString('en', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="btr-success-modal__row">
                <span>Wallet</span>
                <span>{selectedWallet.currency}</span>
              </div>
              {narration && (
                <div className="btr-success-modal__row">
                  <span>Narration</span>
                  <span>{narration}</span>
                </div>
              )}
              <div className="btr-success-modal__row">
                <span>Reference</span>
                <span>{txnRef}</span>
              </div>
              <div className="btr-success-modal__row">
                <span>Status</span>
                <span className="btr-success-modal__status">Completed</span>
              </div>
            </div>
            <button className="bnf-submit-btn" type="button" onClick={handleDone}>
              Done
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
