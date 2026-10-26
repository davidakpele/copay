import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import AppShell from '../components/AppShell';

/* ─── Types ─────────────────────────────────────────────────────── */
type Tab = 'Transfer' | 'FCY' | 'Bill payments';

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  bankCode: string;
  account: string;
  tab: Tab;
}

/* ─── Shared data (exported for transfer page) ───────────────────── */
export const BANKS = [
  { code: 'ECO', label: 'ECO - Ecobank Plc' },
  { code: 'ACC', label: 'ACC - Access Bank' },
  { code: 'UBN', label: 'UBN - Union Bank' },
  { code: 'FBN', label: 'FBN - First Bank of Nigeria' },
  { code: 'GTB', label: 'GTB - GTBank' },
  { code: 'ZEN', label: 'ZEN - Zenith Bank' },
  { code: 'UBA', label: 'UBA - United Bank for Africa' },
  { code: 'STB', label: 'STB - Stanbic IBTC Bank' },
];

export let beneficiaries: Beneficiary[] = [
  { id: '1', name: 'Magdalene Eigbojie', bank: 'Ecobank Plc',           bankCode: 'ECO', account: '4963061459', tab: 'Transfer' },
  { id: '2', name: 'Akpele Becky',       bank: 'Access Bank',           bankCode: 'ACC', account: '0045324223', tab: 'Transfer' },
  { id: '3', name: 'Akpele David',       bank: 'Union Bank',            bankCode: 'UBN', account: '0094436229', tab: 'Transfer' },
  { id: '4', name: 'Akpele James',       bank: 'First Bank of Nigeria', bankCode: 'FBN', account: '3067601698', tab: 'Transfer' },
  { id: '5', name: 'Chinedu Obi',        bank: 'GTBank',                bankCode: 'GTB', account: '0112345678', tab: 'Transfer' },
  { id: '6', name: 'Amara Nwosu',        bank: 'Zenith Bank',           bankCode: 'ZEN', account: '2234567890', tab: 'FCY'      },
  { id: '7', name: 'Tunde Adeyemi',      bank: 'DSTV',                  bankCode: 'DST', account: '7894561230', tab: 'Bill payments' },
  { id: '8', name: 'Folake Bello',       bank: 'IKEDC',                 bankCode: 'IKE', account: '1122334455', tab: 'Bill payments' },
];

const TABS: Tab[] = ['Transfer', 'FCY', 'Bill payments'];

/* ─── Helpers ────────────────────────────────────────────────────── */
export function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function groupByLetter(list: Beneficiary[]) {
  const map: Record<string, Beneficiary[]> = {};
  for (const b of list) {
    const letter = (b.name.split(' ')[1]?.[0] ?? b.name[0]).toUpperCase();
    if (!map[letter]) map[letter] = [];
    map[letter].push(b);
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ name }: { name: string }) {
  return <div className="bnf-avatar" aria-hidden="true">{initials(name)}</div>;
}

/* ─── Delete Confirm Modal ──────────────────────────────────────── */
function DeleteModal({
  beneficiary,
  onConfirm,
  onCancel,
}: {
  beneficiary: Beneficiary;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bnf-modal-backdrop" role="dialog" aria-modal="true" aria-label="Delete beneficiary">
      <div className="bnf-modal">
        <div className="bnf-modal__icon-wrap bnf-modal__icon-wrap--danger">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" stroke="#e5403a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#e5403a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v6M14 11v6" stroke="#e5403a" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 6V4h6v2" stroke="#e5403a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="bnf-modal__title">Delete Beneficiary</h2>
        <p className="bnf-modal__body">
          Are you sure you want to delete <strong>{beneficiary.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="bnf-modal__actions">
          <button className="bnf-modal__btn bnf-modal__btn--ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="bnf-modal__btn bnf-modal__btn--danger" type="button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Modal ─────────────────────────────────────────────────── */
function EditModal({
  beneficiary,
  onSave,
  onClose,
}: {
  beneficiary: Beneficiary;
  onSave: (updated: Beneficiary) => void;
  onClose: () => void;
}) {
  const [bankCode, setBankCode] = useState(beneficiary.bankCode);
  const [account,  setAccount]  = useState(beneficiary.account);
  const [nickname, setNickname] = useState(beneficiary.name.toUpperCase());
  const resolvedBank = BANKS.find((b) => b.code === bankCode);

  function handleSave() {
    onSave({
      ...beneficiary,
      bankCode,
      bank: resolvedBank?.label.split(' - ')[1] ?? beneficiary.bank,
      account,
      name: nickname,
    });
  }

  return (
    <div className="bnf-modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit beneficiary">
      <div className="bnf-modal bnf-modal--form">
        <div className="bnf-modal__header">
          <h2 className="bnf-modal__title">Edit beneficiary</h2>
          <button className="bnf-modal__close" type="button" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
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
              {BANKS.map((b) => (
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
          <label className="bnf-field__label">Account number</label>
          <input
            className="bnf-field__input"
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={account}
            onChange={(e) => setAccount(e.target.value.replace(/\D/g, ''))}
          />
          <p className="bnf-field__resolved">{nickname}</p>
        </div>

        {/* Nickname */}
        <div className="bnf-field">
          <label className="bnf-field__label">Nickname</label>
          <input
            className="bnf-field__input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <button className="bnf-submit-btn" type="button" onClick={handleSave}>
          Save update
        </button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function BeneficiaryPage() {
  const navigate = useNavigate();
  const [activeTab,    setActiveTab]    = useState<Tab>('Transfer');
  const [search,       setSearch]       = useState('');
  const [list,         setList]         = useState<Beneficiary[]>(beneficiaries);
  const [expandedId,   setExpandedId]   = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);
  const [editTarget,   setEditTarget]   = useState<Beneficiary | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(
      (b) =>
        b.tab === activeTab &&
        (b.name.toLowerCase().includes(q) ||
          b.bank.toLowerCase().includes(q) ||
          b.account.includes(q)),
    );
  }, [list, activeTab, search]);

  const groups = useMemo(() => groupByLetter(filtered), [filtered]);

  function handleDelete(b: Beneficiary) {
    setExpandedId(null);
    setDeleteTarget(b);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const updated = list.filter((b) => b.id !== deleteTarget.id);
    setList(updated);
    beneficiaries = updated;
    setDeleteTarget(null);
  }

  function handleSaveEdit(updated: Beneficiary) {
    const next = list.map((b) => (b.id === updated.id ? updated : b));
    setList(next);
    beneficiaries = next;
    setEditTarget(null);
  }

  function handleTransfer(b: Beneficiary) {
    navigate('/beneficiary-transfer', { state: { beneficiary: b } });
  }

  return (
    <AppShell>
      <div className="bnf-page">

        {/* Back */}
        <button className="bnf-back" type="button" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <h1 className="bnf-title">Beneficiaries</h1>

        {/* Tabs */}
        <div className="bnf-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={tab === activeTab}
              className={`bnf-tab${tab === activeTab ? ' bnf-tab--active' : ''}`}
              type="button"
              onClick={() => { setActiveTab(tab); setSearch(''); setExpandedId(null); }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bnf-toolbar">
          <label className="bnf-search">
            <svg className="bnf-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8" stroke="#aaa" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className="bnf-search__input"
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button className="bnf-add-btn" type="button">Add beneficiary</button>
        </div>

        {/* List */}
        {groups.length === 0 ? (
          <div className="bnf-empty">No beneficiaries found.</div>
        ) : (
          <div className="bnf-list">
            {groups.map(([letter, items]) => (
              <div key={letter} className="bnf-group">
                {items.map((b, idx) => {
                  const isExpanded = expandedId === b.id;
                  return (
                    <div key={b.id} className={`bnf-item-wrap${idx !== 0 ? ' bnf-item-wrap--bordered' : ''}`}>
                      {/* Main row */}
                      <button
                        className={`bnf-item${isExpanded ? ' bnf-item--expanded' : ''}`}
                        type="button"
                        onClick={() => toggleExpand(b.id)}
                        aria-expanded={isExpanded}
                      >
                        <Avatar name={b.name} />
                        <div className="bnf-item__body">
                          <p className="bnf-item__name">{b.name}</p>
                          <p className="bnf-item__sub">{b.bank} - {b.account}</p>
                        </div>
                        {idx === 0 && (
                          <div className="bnf-group-letter" aria-hidden="true">{letter}</div>
                        )}
                      </button>

                      {/* Action row */}
                      {isExpanded && (
                        <div className="bnf-actions">
                          <button
                            className="bnf-action-btn bnf-action-btn--delete"
                            type="button"
                            onClick={() => handleDelete(b)}
                            onTouchEnd={(e) => { e.preventDefault(); handleDelete(b); }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete
                          </button>

                          <button
                            className="bnf-action-btn bnf-action-btn--edit"
                            type="button"
                            onClick={() => { setEditTarget(b); setExpandedId(null); }}
                            onTouchEnd={(e) => { e.preventDefault(); setEditTarget(b); setExpandedId(null); }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>

                          <button
                            className="bnf-action-btn bnf-action-btn--transfer"
                            type="button"
                            onClick={() => handleTransfer(b)}
                            onTouchEnd={(e) => { e.preventDefault(); handleTransfer(b); }}
                          >
                            Transfer
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          beneficiary={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditModal
          beneficiary={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
    </AppShell>
  );
}
