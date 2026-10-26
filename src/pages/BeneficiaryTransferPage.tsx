import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import AppShell from '../components/AppShell';
import { beneficiaries, BANKS, initials, type Beneficiary } from './BeneficiaryPage';

const SOURCE_ACCOUNTS = [
  { id: 'ngn', label: 'NGN Wallet — ₦ 245,300.00' },
  { id: 'usd', label: 'USD Wallet — $ 1,204.50'   },
];

const DAILY_LIMIT  = 1_000_000;
const USED_AMOUNT  = 0;

export default function BeneficiaryTransferPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const prefill    = (location.state as { beneficiary?: Beneficiary } | null)?.beneficiary;

  const [source,       setSource]       = useState('');
  const [bankCode,     setBankCode]     = useState(prefill?.bankCode ?? '');
  const [account,      setAccount]      = useState(prefill?.account  ?? '');
  const [narration,    setNarration]    = useState('');
  const [amount,       setAmount]       = useState('');
  const [showBankDrop, setShowBankDrop] = useState(false);
  const bankRef = useRef<HTMLDivElement>(null);

  const resolvedBank  = BANKS.find((b) => b.code === bankCode);
  const resolvedName  = prefill && bankCode === prefill.bankCode && account === prefill.account
    ? prefill.name.toUpperCase()
    : account.length === 10 ? 'ACCOUNT HOLDER' : '';

  const canProceed = source && bankCode && account.length === 10 && amount;

  /* frequent beneficiaries for Transfer tab */
  const frequent = beneficiaries.filter((b) => b.tab === 'Transfer').slice(0, 5);

  function pickBeneficiary(b: Beneficiary) {
    setBankCode(b.bankCode);
    setAccount(b.account);
  }

  const usedPct = Math.min((USED_AMOUNT / DAILY_LIMIT) * 100, 100);

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
          {/* ── Left / main form ── */}
          <div className="btr-main">

            {/* Source account */}
            <div className="btr-card">
              <div className="bnf-field">
                <div className="bnf-field__select-wrap">
                  <select
                    className="bnf-field__select bnf-field__select--placeholder"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="" disabled>Source account</option>
                    {SOURCE_ACCOUNTS.map((a) => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                  <svg className="bnf-field__select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Daily limit bar */}
              <div className="btr-limit">
                <div className="btr-limit__row">
                  <span className="btr-limit__label">Daily Transaction Limit: ₦{DAILY_LIMIT.toLocaleString()}.00</span>
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
                  <span className="btr-limit__used">₦{USED_AMOUNT.toLocaleString()}.00 used</span>
                  <span className="btr-limit__max">₦{DAILY_LIMIT.toLocaleString()}.00</span>
                </div>
              </div>

              {/* Frequent beneficiaries */}
              <p className="btr-section-label">Frequent Beneficiaries</p>
              <div className="btr-freq">
                {/* View all tile */}
                <button className="btr-freq-tile btr-freq-tile--viewall" type="button" onClick={() => navigate('/beneficiaries')}>
                  <div className="btr-freq-tile__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M8 12h8M12 8l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="btr-freq-tile__label">View all</span>
                </button>

                {/* Beneficiary tiles */}
                {frequent.map((b) => (
                  <button
                    key={b.id}
                    className={`btr-freq-tile${bankCode === b.bankCode && account === b.account ? ' btr-freq-tile--active' : ''}`}
                    type="button"
                    onClick={() => pickBeneficiary(b)}
                  >
                    <div className="btr-freq-tile__avatar">{initials(b.name)}</div>
                    <span className="btr-freq-tile__label">{b.name.split(' ')[1] ?? b.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Bank selector */}
              <div className="bnf-field" ref={bankRef}>
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
                <label className="bnf-field__label">Amount (₦)</label>
                <input
                  className="bnf-field__input"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                />
              </div>

              {/* Narration */}
              <div className="bnf-field">
                <label className="bnf-field__label">Narration</label>
                <input
                  className="bnf-field__input"
                  type="text"
                  placeholder="Narration"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                />
              </div>

              <button
                className="bnf-submit-btn"
                type="button"
                disabled={!canProceed}
              >
                Proceed
              </button>
            </div>
          </div>

          {/* ── Right info panel ── */}
          <aside className="btr-info-card">
            <div className="btr-info-card__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="#555" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="btr-info-card__text">
              Dear Customer, a token is required to complete this transaction. Don't have a token? Please call our Contact Center on{' '}
              <a className="btr-info-card__link" href="tel:02012802500">0201 280 2500</a>, send an email to{' '}
              <a className="btr-info-card__link" href="mailto:contactcenter@accessbankplc.com">contactcenter@accessbankplc.com</a>{' '}
              or visit an Access Bank branch near you to request for one.
            </p>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
