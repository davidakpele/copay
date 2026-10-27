import { useState } from 'react';
import BillFormShell from '../../components/BillFormShell';
import { NETWORKS, AIRTIME_PROVIDERS } from '../../data/bills';

const DATA_BUNDLES: Record<string, { label: string; value: string; price: number }[]> = {
  mtn: [
    { label: '1GB – 1 Day',   value: '1gb_1d',   price: 300   },
    { label: '2GB – 2 Days',  value: '2gb_2d',   price: 500   },
    { label: '5GB – 7 Days',  value: '5gb_7d',   price: 1500  },
    { label: '10GB – 30 Days',value: '10gb_30d',  price: 3000  },
    { label: '20GB – 30 Days',value: '20gb_30d',  price: 5000  },
    { label: '50GB – 30 Days',value: '50gb_30d',  price: 10000 },
  ],
  airtel: [
    { label: '750MB – 1 Day', value: '750mb_1d',  price: 300   },
    { label: '1.5GB – 1 Day', value: '1_5gb_1d',  price: 500   },
    { label: '6GB – 7 Days',  value: '6gb_7d',    price: 1500  },
    { label: '12GB – 30 Days',value: '12gb_30d',  price: 3000  },
    { label: '24GB – 30 Days',value: '24gb_30d',  price: 5000  },
  ],
  glo: [
    { label: '1GB – 1 Day',   value: '1gb_1d',    price: 300   },
    { label: '3.2GB – 2 Days',value: '3_2gb_2d',  price: 500   },
    { label: '7.5GB – 7 Days',value: '7_5gb_7d',  price: 1500  },
    { label: '15GB – 30 Days',value: '15gb_30d',  price: 3000  },
  ],
  '9mobile': [
    { label: '1GB – 30 Days',  value: '1gb_30d',   price: 1000  },
    { label: '2.5GB – 30 Days',value: '2_5gb_30d', price: 2000  },
    { label: '5GB – 30 Days',  value: '5gb_30d',   price: 3500  },
  ],
  smile: [
    { label: '3GB – 7 Days',   value: '3gb_7d',    price: 1000  },
    { label: '10GB – 30 Days', value: '10gb_30d',  price: 3000  },
    { label: '25GB – 30 Days', value: '25gb_30d',  price: 6000  },
  ],
};

export default function DataPage() {
  const [selectedNetwork,  setSelectedNetwork]  = useState(NETWORKS[0]);
  const [networkOpen,      setNetworkOpen]      = useState(false);
  const [networkSearch,    setNetworkSearch]    = useState('');
  const [phone,            setPhone]            = useState('');
  const [selectedBundle,   setSelectedBundle]   = useState<string | null>(null);
  const [submitting,       setSubmitting]       = useState(false);
  const [done,             setDone]             = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const bundles = DATA_BUNDLES[selectedNetwork.id] ?? [];
  const bundle  = bundles.find((b) => b.value === selectedBundle);

  function handleProviderSelect(id: string) {
    setSelectedProvider(id);
    const n = NETWORKS.find((x) => x.id === id);
    if (n) { setSelectedNetwork(n); setSelectedBundle(null); }
  }

  function handleSubmit() {
    if (!phone || !selectedBundle) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1600);
  }

  const filteredNetworks = NETWORKS.filter((n) =>
    n.name.toLowerCase().includes(networkSearch.toLowerCase())
  );

  if (done) {
    return (
      <BillFormShell title="Buy Data Bundle" bannerImage="/assets/images/airtime-bills.png">
        <div className="bfs-success">
          <div className="bfs-success__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Data Bundle Purchased!</h3>
          <p>{bundle?.label} sent to {phone} ({selectedNetwork.name}).</p>
          <p className="bfs-success__ref">Ref: TXN{Date.now().toString().slice(-8)}</p>
          <button className="bfs-submit-btn" type="button" onClick={() => { setDone(false); setPhone(''); setSelectedBundle(null); }}>
            Buy Again
          </button>
        </div>
      </BillFormShell>
    );
  }

  return (
    <BillFormShell
      title="Buy Data Bundle"
      bannerImage="/assets/images/airtime-bills.png"
      providers={AIRTIME_PROVIDERS}
      selectedProvider={selectedProvider}
      onProviderSelect={handleProviderSelect}
    >
      <div className="bfs-field">
        <label>Select Network</label>
        <div className="bfs-select-box" onClick={() => setNetworkOpen(true)}>
          <span className="bfs-network-pill" style={{ background: selectedNetwork.bg, color: selectedNetwork.color }}>
            {selectedNetwork.abbr}
          </span>
          <span className="bfs-select-box__name">{selectedNetwork.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="bfs-field">
        <label>Phone Number</label>
        <input className="bfs-input" type="tel" inputMode="numeric" placeholder="e.g. 08012345678"
          value={phone} maxLength={11} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
      </div>

      <div className="bfs-field">
        <label>Select Bundle</label>
        <div className="bfs-bundle-grid">
          {bundles.map((b) => (
            <button key={b.value} type="button"
              className={`bfs-bundle-btn${selectedBundle === b.value ? ' bfs-bundle-btn--active' : ''}`}
              onClick={() => setSelectedBundle(b.value)}>
              <span className="bfs-bundle-btn__label">{b.label}</span>
              <span className="bfs-bundle-btn__price">₦{b.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
      <button className="bfs-submit-btn" type="button" disabled={!phone || !selectedBundle || submitting} onClick={handleSubmit}>
        {submitting ? <><span className="bfs-spinner" /> Processing…</> : 'Buy Data Bundle'}
      </button>

      {networkOpen && (
        <div className="bfs-modal-overlay" onClick={() => setNetworkOpen(false)}>
          <div className="bfs-picker-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Network</h3>
            <input className="bfs-picker-search" type="search" placeholder="Search…"
              value={networkSearch} onChange={(e) => setNetworkSearch(e.target.value)} autoFocus />
            <div className="bfs-picker-list">
              {filteredNetworks.map((n) => (
                <button key={n.id} type="button" className="bfs-picker-item"
                  onClick={() => { setSelectedNetwork(n); setSelectedBundle(null); setNetworkOpen(false); setNetworkSearch(''); }}>
                  <span className="bfs-network-pill" style={{ background: n.bg, color: n.color }}>{n.abbr}</span>
                  <span className="bfs-picker-item__name">{n.name}</span>
                  {selectedNetwork.id === n.id && (
                    <span className="bfs-picker-item__check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </BillFormShell>
  );
}
