import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppShell from '../components/AppShell';

/* ─── Types ─────────────────────────────────────────────────────── */
interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  addedDate: string;
}

/* ─── Mock data ──────────────────────────────────────────────────── */
const BANK_OPTIONS = [
  { code: 'ECO', label: 'Ecobank Plc' },
  { code: 'ACC', label: 'Access Bank' },
  { code: 'UBN', label: 'Union Bank' },
  { code: 'FBN', label: 'First Bank of Nigeria' },
  { code: 'GTB', label: 'GTBank' },
  { code: 'ZEN', label: 'Zenith Bank' },
  { code: 'UBA', label: 'United Bank for Africa' },
  { code: 'STB', label: 'Stanbic IBTC Bank' },
  { code: 'FID', label: 'Fidelity Bank' },
  { code: 'POL', label: 'Polaris Bank' },
];

const MOCK_ACCOUNT_NAMES: Record<string, string> = {
  '123456891': 'KIM BECKY',
  '123456892': 'CHRISTIAN DAVID',
  '123456893': 'WILLIAMS JAMES',
  '123456894': 'MAGDALENE EIGBOJIE',
  '123456895': 'CHINEDU OBI',
};

export let depositBankAccounts: BankAccount[] = [
  { id: '1', bankName: 'Access Bank',  bankCode: 'ACC', accountNumber: '1234567891', accountName: 'KIM BECKY',       currency: 'NGN', addedDate: '2024-11-01' },
  { id: '2', bankName: 'Union Bank',   bankCode: 'UBN', accountNumber: '1234567892', accountName: 'CHRISTIAN DAVID',       currency: 'NGN', addedDate: '2024-12-15' },
];

/* ─── Bank icon SVG ──────────────────────────────────────────────── */
function BankIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67" width="26" height="26" aria-hidden="true">
      <path d="M7.722 57.657a.75.75 0 0 0-.75.75V64.5c0 .414.336.75.75.75h51.556a.75.75 0 0 0 .75-.75v-6.093a.75.75 0 0 0-.75-.75h-4.325V27.442h4.325a.75.75 0 0 0 .75-.75v-5.35a.75.75 0 0 0-.75-.75h-.187L33.94 1.899a.75.75 0 0 0-.895 0L7.91 20.593h-.187a.75.75 0 0 0-.75.75v5.349c0 .414.336.75.75.75h4.325v30.215H7.722zm50.806 6.093H8.472v-4.593h50.056v4.593zM24.214 27.442v30.215h-5.761V27.442h5.761zm12.167 0v30.215H30.62V27.442h5.761zm12.166 0v30.215h-5.761V27.442h5.761zm-7.261 30.215H37.88V27.442h3.405v30.215zm-12.166 0h-3.406V27.442h3.406v30.215zm24.333 0h-3.406V27.442h3.406v30.215zM33.493 3.435l23.083 17.158H10.423l23.07-17.158zM8.474 22.098h50.055v3.844H8.472v-3.844zm5.074 5.344h3.406v30.215h-3.406V27.442z" fill="currentColor"/>
    </svg>
  );
}

/* ─── Delete Modal ───────────────────────────────────────────────── */
function DeleteModal({ count, onConfirm, onCancel }: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="db-backdrop">
      <div className="db-modal">
        <div className="db-modal__icon db-modal__icon--danger">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="db-modal__title">Delete Account{count > 1 ? 's' : ''}</h2>
        <p className="db-modal__body">
          Are you sure you want to delete {count > 1 ? `${count} bank accounts` : 'this bank account'}? This cannot be undone.
        </p>
        <div className="db-modal__actions">
          <button className="db-modal__btn db-modal__btn--ghost" type="button" onClick={onCancel}>Cancel</button>
          <button className="db-modal__btn db-modal__btn--danger" type="button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Success Modal ──────────────────────────────────────────────── */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="db-backdrop">
      <div className="db-modal db-modal--success">
        <div className="db-modal__icon db-modal__icon--success">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="db-modal__title">Bank Account Added!</h2>
        <p className="db-modal__body">Your bank account has been linked successfully.</p>
        <button className="db-modal__btn db-modal__btn--primary db-modal__btn--full" type="button" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function DepositBankPage() {
  const navigate = useNavigate();

  /* bank list state */
  const [banks,           setBanks]           = useState<BankAccount[]>(depositBankAccounts);
  const [selectedIds,     setSelectedIds]     = useState<Set<string>>(new Set());

  /* form state */
  const [showForm,        setShowForm]        = useState(false);
  const [bankCode,        setBankCode]        = useState('');
  const [accountNumber,   setAccountNumber]   = useState('');
  const [accountName,     setAccountName]     = useState('');
  const [verified,        setVerified]        = useState(false);
  const [verifying,       setVerifying]       = useState(false);

  /* modal state */
  const [deleteIds,       setDeleteIds]       = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccess,     setShowSuccess]     = useState(false);

  /* ── form helpers ── */
  const selectedBank = BANK_OPTIONS.find(b => b.code === bankCode);

  function resetForm() {
    setBankCode(''); setAccountNumber(''); setAccountName('');
    setVerified(false); setVerifying(false); setShowForm(false);
  }

  function handleVerify() {
    if (!bankCode) return;
    if (accountNumber.length !== 10) return;
    setVerifying(true);
    setTimeout(() => {
      const name = MOCK_ACCOUNT_NAMES[accountNumber] ?? 'ACCOUNT HOLDER NAME';
      setAccountName(name);
      setVerified(true);
      setVerifying(false);
    }, 900);
  }

  function handleAddBank() {
    if (!verified || !selectedBank) return;
    if (banks.length >= 5) return;
    const newBank: BankAccount = {
      id: crypto.randomUUID(),
      bankName: selectedBank.label,
      bankCode,
      accountNumber,
      accountName,
      currency: 'NGN',
      addedDate: new Date().toISOString().split('T')[0],
    };
    setBanks(prev => [...prev, newBank]);
    depositBankAccounts = [...depositBankAccounts, newBank];
    setShowSuccess(true);
    resetForm();
  }

  /* ── checkbox / delete ── */
  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function requestDelete(ids: Set<string>) {
    setDeleteIds(ids);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    setBanks(prev => prev.filter(b => !deleteIds.has(b.id)));
    depositBankAccounts = depositBankAccounts.filter(b => !deleteIds.has(b.id));
    setSelectedIds(new Set());
    setDeleteIds(new Set());
    setShowDeleteModal(false);
  }

  const canSearch = bankCode && accountNumber.length === 10;

  return (
    <AppShell>
      <div className="db-page">

        {/* Back */}
        <button className="bnf-back" type="button" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Page header */}
        <div className="db-header">
          <div>
            <h1 className="db-header__title">Deposit Accounts</h1>
            <p className="db-header__sub">Manage the bank accounts where your deposits are made.</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="db-info-banner">
          <svg className="db-info-banner__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="db-info-banner__text">
            <strong>NOTE:</strong> Accounts added here are solely for deposits and not for withdrawals. Make sure it is your own account and the account name matches.
          </p>
        </div>

        {/* Two-column grid */}
        <div className="db-grid">

          {/* ── Left: Add bank card ── */}
          <div className="db-card">
            {!showForm ? (
              <>
                <h2 className="db-card__title">Deposit Bank Account</h2>
                <p className="db-card__sub">Deposit your funds into your bank account.</p>
                <button
                  className="db-add-placeholder"
                  type="button"
                  onClick={() => setShowForm(true)}
                  disabled={banks.length >= 5}
                >
                  <span className="db-add-placeholder__plus">+</span>
                  <span className="db-add-placeholder__title">Add New Bank Account</span>
                  <span className="db-add-placeholder__hint">Click to add a new bank account</span>
                  <span className="db-add-placeholder__count">{banks.length}/5 banks added</span>
                </button>
              </>
            ) : (
              <div className="db-form">
                <div className="db-form__header">
                  <h2 className="db-card__title">Add New Bank Account</h2>
                  <button className="db-form__cancel" type="button" onClick={resetForm}>Cancel</button>
                </div>

                {!verified ? (
                  <>
                    {/* Bank select */}
                    <div className="bnf-field">
                      <label className="bnf-field__label">Select Your Bank</label>
                      <div className="bnf-field__select-wrap">
                        <select
                          className="bnf-field__select"
                          value={bankCode}
                          onChange={e => { setBankCode(e.target.value); setAccountName(''); }}
                        >
                          <option value="" disabled>Select Bank...</option>
                          {BANK_OPTIONS.map(b => (
                            <option key={b.code} value={b.code}>{b.label}</option>
                          ))}
                        </select>
                        <svg className="bnf-field__select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Account number */}
                    <div className="bnf-field">
                      <label className="bnf-field__label">Account Number</label>
                      <input
                        className="bnf-field__input"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter account number"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <button
                      className="bnf-submit-btn"
                      type="button"
                      disabled={!canSearch || verifying}
                      onClick={handleVerify}
                    >
                      {verifying ? 'Verifying...' : 'Search'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Verified bank display */}
                    <div className="db-verified-card">
                      <div className="db-verified-card__icon">
                        <BankIcon />
                      </div>
                      <div className="db-verified-card__body">
                        <span className="db-verified-card__bank">{selectedBank?.label}</span>
                        <div className="db-verified-card__row">
                          <span className="db-verified-card__name">{accountName}</span>
                          <span className="db-verified-card__badge">verified</span>
                        </div>
                        <span className="db-verified-card__number">{accountNumber}</span>
                      </div>
                      <div className="db-verified-card__check">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    <button className="bnf-submit-btn" type="button" onClick={handleAddBank}>
                      Add Bank Details
                    </button>
                    <button className="db-form__back-link" type="button" onClick={() => { setVerified(false); setAccountName(''); }}>
                      ← Change account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Linked accounts card ── */}
          <div className="db-card">
            <div className="db-list-header">
              <div>
                <h2 className="db-card__title">Your Linked Bank Accounts</h2>
              </div>
              <div className="db-list-header__right">
                <span className="db-count-badge">{banks.length}/5 linked</span>
                {selectedIds.size > 0 && (
                  <button
                    className="db-bulk-delete-btn"
                    type="button"
                    onClick={() => requestDelete(selectedIds)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete ({selectedIds.size})
                  </button>
                )}
              </div>
            </div>

            {banks.length === 0 ? (
              <div className="db-empty">
                <p className="db-empty__title">No bank accounts added yet</p>
                <p className="db-empty__sub">Add your first bank account using the form</p>
              </div>
            ) : (
              <div className="db-bank-list">
                {banks.map(bank => {
                  const isChecked = selectedIds.has(bank.id);
                  return (
                    <div
                      key={bank.id}
                      className={`db-bank-item${isChecked ? ' db-bank-item--selected' : ''}`}
                    >
                      {/* Checkbox */}
                      <button
                        className={`db-checkbox${isChecked ? ' db-checkbox--checked' : ''}`}
                        type="button"
                        aria-label="Select"
                        onClick={e => toggleSelect(bank.id, e)}
                        onTouchEnd={e => { e.preventDefault(); toggleSelect(bank.id, e as unknown as React.MouseEvent); }}
                      >
                        {isChecked && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>

                      {/* Delete icon (visible on hover, only when nothing selected) */}
                      {selectedIds.size === 0 && (
                        <button
                          className="db-delete-icon"
                          type="button"
                          aria-label="Delete"
                          onClick={e => { e.stopPropagation(); requestDelete(new Set([bank.id])); }}
                          onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); requestDelete(new Set([bank.id])); }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}

                      {/* Bank icon */}
                      <div className="db-bank-item__icon">
                        <BankIcon />
                      </div>

                      {/* Info */}
                      <div className="db-bank-item__body">
                        <span className="db-bank-item__bank-name">{bank.bankName}</span>
                        <span className="db-bank-item__account-name">{bank.accountName}</span>
                        <span className="db-bank-item__number">{bank.accountNumber}</span>
                      </div>

                      {/* Currency badge */}
                      <span className="db-bank-item__currency">{bank.currency}</span>
                    </div>
                  );
                })}

                <p className="db-list-footer">
                  You can link up to 5 bank accounts for deposits.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          count={deleteIds.size}
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteModal(false); setDeleteIds(new Set()); }}
        />
      )}

      {showSuccess && (
        <SuccessModal onClose={() => setShowSuccess(false)} />
      )}
    </AppShell>
  );
}
