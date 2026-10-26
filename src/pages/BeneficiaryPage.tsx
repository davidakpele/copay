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

/* ─── Shared data (exported for transfer page) ─────────────────── */
export const BANKS = [
  { code: 'ECO', label: 'ECOB - Ecobank Plc' },
  { code: 'ACC', label: 'ACC - Access Bank' },
  { code: 'UBN', label: 'UBN - Union Bank' },
  { code: 'FBN', label: 'FBN - First Bank of Nigeria' },
  { code: 'GTB', label: 'GTB - Guaranty Trust Bank' },
  { code: 'ZEN', label: 'ZEN - Zenith Bank' },
  { code: 'UBA', label: 'UBA - United Bank for Africa' },
  { code: 'STB', label: 'STB - Stanbic IBTC Bank' },
];

export let beneficiaries: Beneficiary[] = [
  { id: '1', name: 'Aisha Bello', bank: 'EcoBank Plc', bankCode: 'ECO', account: '1234567891', tab: 'Transfer' },
  { id: '2', name: 'Chinedu Okafor', bank: 'Access Bank', bankCode: 'ACC', account: '1234567891', tab: 'Transfer' },
  { id: '3', name: 'Grace Adebayo', bank: 'Union Bank', bankCode: 'UBN', account: '1234567891', tab: 'Transfer' },
  { id: '4', name: 'Kelechi Okafor', bank: 'First Bank of Nigeria', bankCode: 'FBN', account: '1234567891', tab: 'Transfer' },
  { id: '5', name: 'Daniel Nnamdi', bank: 'GTBank', bankCode: 'GTB', account: '1234567891', tab: 'Transfer' },
  { id: '6', name: 'Sarah Eze', bank: 'Zenith Bank', bankCode: 'ZEN', account: '1234567891', tab: 'FCY' },
  { id: '7', name: 'Musa Ibrahim', bank: 'UBA', bankCode: 'UBA', account: '1234567891', tab: 'Bill payments' },
  { id: '8', name: 'Tosin Adeyemi', bank: 'Stanbic IBTC', bankCode: 'STB', account: '1234567891', tab: 'Bill payments' },
];

const TABS: Tab[] = ['Transfer', 'FCY', 'Bill payments'];

/* ─── Helpers ───────────────────────────────────────────────────── */
export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function groupByLetter(list: Beneficiary[]) {
  const map: Record<string, Beneficiary[]> = {};
  for (const b of list) {
    const letter = b.name.split(' ').at(1)?.[0]?.toUpperCase() ?? b.name[0]?.toUpperCase() ?? '#';
    (map[letter] ??= []).push(b);
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function BeneficiaryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Transfer');
  const [beneficiaryList, setBeneficiaryList] = useState<Beneficiary[]>(beneficiaries);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Beneficiary | null>(null);

  const filtered = useMemo(() => {
    return beneficiaryList.filter((b) => {
      const matchesTab = activeTab === 'Transfer' ? b.tab === 'Transfer' : b.tab === activeTab;
      const matchesQuery = b.name.toLowerCase().includes(query.toLowerCase()) || b.account.includes(query);
      return matchesTab && matchesQuery;
    });
  }, [activeTab, beneficiaryList, query]);

  const grouped = groupByLetter(filtered);

  function handleDelete(item: Beneficiary) {
    setBeneficiaryList((list) => list.filter((b) => b.id !== item.id));
    setExpandedId(null);
  }

  function handleTransfer(item: Beneficiary) {
    navigate('/beneficiary-transfer', { state: { beneficiary: item } });
  }

  function handleSaveEdit() {
    if (!editTarget) return;
    setBeneficiaryList((list) =>
      list.map((b) => (b.id === editTarget.id ? { ...b, ...editTarget } : b))
    );
    setEditTarget(null);
    setExpandedId(null);
  }

  return (
    <AppShell>
      <div className="bnf-page">
        <div className="bnf-header">
          <div>
            <p className="bnf-eyebrow">Partners</p>
            <h1 className="bnf-title">Beneficiaries</h1>
          </div>
          <button type="button" className="bnf-add-btn" onClick={() => setEditTarget({
            id: Date.now().toString(),
            name: '',
            bank: 'EcoBank Plc',
            bankCode: 'ECO',
            account: '1234567891',
            tab: activeTab,
          })}>
            + Add beneficiary
          </button>
        </div>

        <div className="bnf-toolbar">
          <div className="bnf-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`bnf-tab${activeTab === tab ? ' bnf-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <label className="bnf-search">
            <span>Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or account"
            />
          </label>
        </div>

        <div className="bnf-list">
          {grouped.length === 0 ? (
            <div className="bnf-empty">No beneficiaries found.</div>
          ) : (
            grouped.map(([letter, items]) => (
              <div key={letter} className="bnf-group">
                <div className="bnf-group__label">{letter}</div>
                {items.map((b) => (
                  <div key={b.id} className={`bnf-card${expandedId === b.id ? ' bnf-card--expanded' : ''}`}>
                    <div className="bnf-row" onClick={() => setExpandedId((id) => (id === b.id ? null : b.id))}>
                      <div className="bnf-user">
                        <span className="bnf-avatar">{initials(b.name)}</span>
                        <div>
                          <p className="bnf-name">{b.name}</p>
                          <p className="bnf-meta">{b.bank}</p>
                        </div>
                      </div>

                      <div className="bnf-account-box">
                        <span className="bnf-account-label">Account</span>
                        <span className="bnf-account">{b.account}</span>
                      </div>
                    </div>

                    {expandedId === b.id && (
                      <div className="bnf-actions">
                        <button type="button" onClick={() => { setEditTarget({ ...b }); setExpandedId(null); }}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(b)}>
                          Delete
                        </button>
                        <button type="button" onClick={() => handleTransfer(b)}>
                          Transfer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {editTarget && (
          <div className="bnf-modal-overlay" onClick={() => setEditTarget(null)}>
            <div className="bnf-modal" onClick={(e) => e.stopPropagation()}>
              <h3>{editTarget.id ? 'Edit beneficiary' : 'New beneficiary'}</h3>
              <div className="bnf-form-grid">
                <label>
                  Full name
                  <input
                    value={editTarget.name}
                    onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })}
                  />
                </label>
                <label>
                  Bank
                  <select
                    value={editTarget.bankCode}
                    onChange={(e) => {
                      const selected = BANKS.find((bank) => bank.code === e.target.value);
                      setEditTarget({
                        ...editTarget,
                        bankCode: selected?.code ?? 'ECO',
                        bank: selected?.label.split(' - ')[1] ?? 'EcoBank Plc',
                      });
                    }}
                  >
                    {BANKS.map((bank) => (
                      <option key={bank.code} value={bank.code}>{bank.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Account number
                  <input
                    value={editTarget.account}
                    onChange={(e) => setEditTarget({ ...editTarget, account: e.target.value })}
                  />
                </label>
                <label>
                  Category
                  <select
                    value={editTarget.tab}
                    onChange={(e) => setEditTarget({ ...editTarget, tab: e.target.value as Tab })}
                  >
                    {TABS.map((tab) => (
                      <option key={tab} value={tab}>{tab}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="bnf-modal-actions">
                <button type="button" className="bnf-cancel" onClick={() => setEditTarget(null)}>Cancel</button>
                <button type="button" className="bnf-save" onClick={handleSaveEdit}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
