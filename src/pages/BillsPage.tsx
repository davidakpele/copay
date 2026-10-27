import { useState } from 'react';
import AppShell from '../components/AppShell';
import {
  SERVICES,
  ACCOUNT_PLACEHOLDER,
  getProviders,
  type BillService,
  type Provider,
  type FilterId,
} from '../data/bills';

function BillModal({ service, onClose }: { service: BillService; onClose: () => void }) {
  const providers = getProviders(service.category);

  const [step,       setStep]       = useState<'provider' | 'form' | 'confirm' | 'success'>('provider');
  const [provider,   setProvider]   = useState<Provider | null>(null);
  const [accountNo,  setAccountNo]  = useState('');
  const [amount,     setAmount]     = useState('');
  const [processing, setProcessing] = useState(false);
  const [error,      setError]      = useState('');

  function handleProviderSelect(p: Provider) {
    setProvider(p);
    setStep('form');
  }

  function handleProceed() {
    setError('');
    if (!accountNo.trim()) { setError('Account / customer number is required.'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount.'); return; }
    setStep('confirm');
  }

  function handlePay() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep('success'); }, 1600);
  }

  const fmtAmt = (v: string) =>
    v ? `₦${parseFloat(v).toLocaleString('en', { minimumFractionDigits: 2 })}` : '₦0.00';

  const stepLabel: Record<string, string> = {
    provider: 'Select a provider',
    form:     provider?.name ?? '',
    confirm:  'Review your payment',
    success:  'Payment complete',
  };

  return (
    <div className="bills-modal-overlay" onClick={onClose}>
      <div className="bills-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">

        <div className="bills-modal__header">
          <div className="bills-modal__header-left">
            <div className={`bills-modal__header-icon bills-card--${service.color}`}>
              <img src={service.image} alt={service.name} className="bills-modal__header-img" />
            </div>
            <div>
              <h2 className="bills-modal__title">{service.name}</h2>
              <p className="bills-modal__subtitle">{stepLabel[step]}</p>
            </div>
          </div>
          <button className="bills-modal__close" type="button" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {step === 'provider' && (
          <div className="bills-modal__body">
            <p className="bills-modal__section-label">Choose provider</p>
            <div className="bills-providers-grid">
              {providers.map((p) => (
                <button key={p.id} type="button" className="bills-provider-btn"
                  onClick={() => handleProviderSelect(p)}>
                  <img src={p.logo} alt={p.name} className="bills-provider-btn__logo"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="bills-modal__body">
            {error && <p className="bills-modal__error">{error}</p>}

            {provider && (
              <div className="bills-modal__provider-row">
                <img src={provider.logo} alt={provider.name} className="bills-modal__provider-logo"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <span>{provider.name}</span>
                <button type="button" className="bills-modal__change-btn"
                  onClick={() => { setProvider(null); setStep('provider'); }}>
                  Change
                </button>
              </div>
            )}

            <div className="bills-modal__field">
              <label>Account / Customer Number</label>
              <input type="text" placeholder={ACCOUNT_PLACEHOLDER[service.category]}
                value={accountNo} onChange={(e) => setAccountNo(e.target.value)} autoFocus />
            </div>

            <div className="bills-modal__field">
              <label>Amount (₦)</label>
              <div className="bills-modal__amount-wrap">
                <span className="bills-modal__currency">₦</span>
                <input type="text" inputMode="decimal" placeholder="0.00"
                  value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} />
              </div>
            </div>

            <div className="bills-modal__quick-amounts">
              {['500','1000','2000','5000','10000'].map((v) => (
                <button key={v} type="button" className="bills-modal__quick-btn"
                  onClick={() => setAmount(v)}>
                  ₦{parseInt(v).toLocaleString()}
                </button>
              ))}
            </div>

            <button className="bills-modal__submit" type="button" onClick={handleProceed}>
              Proceed
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="bills-modal__body">
            <div className="bills-modal__summary">
              <div className="bills-modal__summary-row"><span>Service</span><strong>{service.name}</strong></div>
              <div className="bills-modal__summary-row"><span>Provider</span><strong>{provider?.name}</strong></div>
              <div className="bills-modal__summary-row"><span>Account No.</span><strong>{accountNo}</strong></div>
              <div className="bills-modal__summary-row"><span>Amount</span><strong>{fmtAmt(amount)}</strong></div>
              <div className="bills-modal__summary-divider" />
              <div className="bills-modal__summary-row bills-modal__summary-row--total">
                <span>Total</span><strong>{fmtAmt(amount)}</strong>
              </div>
            </div>
            <div className="bills-modal__confirm-actions">
              <button className="bills-modal__ghost-btn" type="button" onClick={() => setStep('form')}>Back</button>
              <button className="bills-modal__submit" type="button" disabled={processing} onClick={handlePay}>
                {processing ? <><span className="bills-modal__spinner" /> Processing…</> : 'Pay Now'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="bills-modal__body bills-modal__success">
            <div className="bills-modal__success-icon">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Payment Successful!</h3>
            <p>Your {service.name} payment of {fmtAmt(amount)} to {provider?.name} was processed successfully.</p>
            <div className="bills-modal__success-meta">
              <span>Account: {accountNo}</span>
              <span>Ref: TXN{Date.now().toString().slice(-8)}</span>
            </div>
            <button className="bills-modal__submit" type="button" onClick={onClose}>Done</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BillsPage() {
  const [activeService, setActiveService] = useState<BillService | null>(null);

  return (
    <AppShell title="Pay Bills" subtitle="Make bill payments easier than ever with Copay.">
      <div className="bills-page">

        <div className="bills-hero">
          <div className="bills-hero__text">
            <h1 className="bills-hero__title">Pay Bills</h1>
            <p className="bills-hero__sub">
              With just a few taps, handle all your bills swiftly and hassle-free.
              Say goodbye to stress and hello to convenience!
            </p>
          </div>
          <div className="bills-hero__graphic" aria-hidden="true">
            <img src="/assets/images/bills-hero.png" alt="" />
          </div>
        </div>

        <div className="bills-grid">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              type="button"
              className={`bills-card bills-card--${service.color}`}
              onClick={() => setActiveService(service)}
            >
              <h3 className="bills-card__title">{service.name}</h3>
              <div className="bills-card__img-wrap">
                <img src={service.image} alt={service.name} className="bills-card__img"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
              </div>
              <div className="bills-card__pay-btn">Pay <span>›</span></div>
            </button>
          ))}
        </div>

      </div>

      {activeService && (
        <BillModal service={activeService} onClose={() => setActiveService(null)} />
      )}
    </AppShell>
  );
}
