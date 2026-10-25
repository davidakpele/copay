import { useState, useEffect, useCallback } from 'react';
import AppShell from '../components/AppShell';
import { ExchangeIcon, ChevronDownIcon, CheckCircleIcon } from '../components/Icons';

// ─── Types ────────────────────────────────────────────────────────────────────

type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR' | 'USDT' | 'BTC';
type Step = 'form' | 'confirm' | 'processing' | 'success';

// ─── Static data ──────────────────────────────────────────────────────────────

interface CurrencyMeta {
  code: Currency;
  flag: string;
  name: string;
  symbol: string;
  balance: number;
}

const CURRENCIES: CurrencyMeta[] = [
  { code: 'NGN',  flag: '🇳🇬', name: 'Nigerian Naira',    symbol: '₦',  balance: 1_280_500 },
  { code: 'USD',  flag: '🇺🇸', name: 'US Dollar',         symbol: '$',  balance: 2_450    },
  { code: 'GBP',  flag: '🇬🇧', name: 'British Pound',     symbol: '£',  balance: 320      },
  { code: 'EUR',  flag: '🇪🇺', name: 'Euro',              symbol: '€',  balance: 410      },
  { code: 'USDT', flag: '🪙',  name: 'Tether (USDT)',     symbol: '₮',  balance: 500      },
  { code: 'BTC',  flag: '₿',   name: 'Bitcoin',           symbol: '₿',  balance: 0.012    },
];

/** Mid-market rates: 1 unit of key → value NGN (approximate demo values) */
const RATES_TO_NGN: Record<Currency, number> = {
  NGN:  1,
  USD:  1600,
  GBP:  2020,
  EUR:  1730,
  USDT: 1590,
  BTC:  104_000_000,
};

function getRate(from: Currency, to: Currency): number {
  return RATES_TO_NGN[from] / RATES_TO_NGN[to];
}

function fmt(symbol: string, amount: number, code: Currency): string {
  const dp = code === 'BTC' ? 6 : 2;
  return `${symbol}${amount.toLocaleString('en', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
}

function parseNum(raw: string): number {
  return parseFloat(raw.replace(/,/g, '')) || 0;
}

function fmtInput(raw: string): string {
  const clean = raw.replace(/[^0-9.]/g, '');
  const parts  = clean.split('.');
  parts[0]     = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 8)}` : parts[0];
}

// ─── Currency picker ──────────────────────────────────────────────────────────

function CurrencyPicker({
  selected, exclude, onSelect,
}: {
  selected: CurrencyMeta;
  exclude: Currency;
  onSelect: (c: CurrencyMeta) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ex-picker">
      <button
        className="ex-picker__btn"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="ex-picker__flag">{selected.flag}</span>
        <span className="ex-picker__code">{selected.code}</span>
        <ChevronDownIcon size={14} color="#666" />
      </button>

      {open && (
        <>
          <div className="ex-picker__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul className="ex-picker__dropdown" role="listbox" aria-label="Select currency">
            {CURRENCIES.filter((c) => c.code !== exclude).map((c) => (
              <li key={c.code} role="option" aria-selected={c.code === selected.code}>
                <button
                  className={`ex-picker__option${c.code === selected.code ? ' ex-picker__option--active' : ''}`}
                  type="button"
                  onClick={() => { onSelect(c); setOpen(false); }}
                >
                  <span className="ex-picker__flag">{c.flag}</span>
                  <span className="ex-picker__option-info">
                    <span className="ex-picker__option-code">{c.code}</span>
                    <span className="ex-picker__option-name">{c.name}</span>
                  </span>
                  <span className="ex-picker__option-bal">
                    {fmt(c.symbol, c.balance, c.code)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── Recent conversions (static demo) ────────────────────────────────────────

const RECENT = [
  { from: 'USD', to: 'NGN', fromAmt: '$200.00',    toAmt: '₦320,000.00',  date: 'Today, 09:14'      },
  { from: 'NGN', to: 'GBP', fromAmt: '₦500,000',   toAmt: '£247.52',      date: 'Yesterday, 17:30'  },
  { from: 'EUR', to: 'USD', fromAmt: '€150.00',     toAmt: '$163.58',      date: 'Jul 20, 11:05'     },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExchangePage() {
  const [step, setStep]   = useState<Step>('form');
  const [txnRef]          = useState(() => `EX${Date.now().toString().slice(-8)}`);

  const [fromCur, setFromCur] = useState<CurrencyMeta>(CURRENCIES.find((c) => c.code === 'USD')!);
  const [toCur,   setToCur]   = useState<CurrencyMeta>(CURRENCIES.find((c) => c.code === 'NGN')!);
  const [fromRaw, setFromRaw] = useState('');
  const [toRaw,   setToRaw]   = useState('');

  const rate       = getRate(fromCur.code, toCur.code);
  const fromAmount = parseNum(fromRaw);
  const toAmount   = parseNum(toRaw);

  // Keep toRaw in sync when fromRaw or currencies change
  useEffect(() => {
    if (fromAmount > 0) {
      setToRaw(fmtInput(String((fromAmount * rate).toFixed(toCur.code === 'BTC' ? 6 : 2))));
    } else {
      setToRaw('');
    }
  }, [fromRaw, fromCur, toCur, rate, fromAmount, toCur.code]);

  function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFromRaw(fmtInput(e.target.value));
  }

  function handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw    = fmtInput(e.target.value);
    const parsed = parseNum(raw);
    setToRaw(raw);
    if (parsed > 0) {
      setFromRaw(fmtInput(String((parsed / rate).toFixed(fromCur.code === 'BTC' ? 6 : 2))));
    } else {
      setFromRaw('');
    }
  }

  const handleSwap = useCallback(() => {
    setFromCur(toCur);
    setToCur(fromCur);
    setFromRaw(toRaw);
  }, [fromCur, toCur, toRaw]);

  function handleConfirm() {
    setStep('processing');
    setTimeout(() => setStep('success'), 2400);
  }

  function handleDone() {
    setStep('form');
    setFromRaw('');
    setToRaw('');
  }

  const fee        = fromAmount > 0 ? fromAmount * 0.005 : 0;
  const insufficient = fromAmount > fromCur.balance;
  const canProceed   = fromAmount > 0 && toAmount > 0 && !insufficient;

  const txnDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <AppShell title="Exchange" subtitle="Convert between your currencies instantly.">
      <div className="ex-page">

        {/* ── Confirm overlay ───────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div className="ex-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm exchange">
            <div className="ex-confirm">
              <h2 className="ex-confirm__title">Confirm Exchange</h2>
              <p className="ex-confirm__sub">Review before you proceed</p>

              <div className="ex-confirm__summary">
                <div className="ex-confirm__row">
                  <span>You send</span>
                  <strong>{fmt(fromCur.symbol, fromAmount, fromCur.code)} {fromCur.code}</strong>
                </div>
                <div className="ex-confirm__row">
                  <span>You receive</span>
                  <strong>{fmt(toCur.symbol, toAmount, toCur.code)} {toCur.code}</strong>
                </div>
                <div className="ex-confirm__row">
                  <span>Rate</span>
                  <span>1 {fromCur.code} = {rate.toLocaleString('en', { maximumFractionDigits: 6 })} {toCur.code}</span>
                </div>
                <div className="ex-confirm__row">
                  <span>Fee (0.5%)</span>
                  <span>{fmt(fromCur.symbol, fee, fromCur.code)}</span>
                </div>
                <div className="ex-confirm__divider" />
                <div className="ex-confirm__row ex-confirm__row--total">
                  <span>Total deducted</span>
                  <strong>{fmt(fromCur.symbol, fromAmount + fee, fromCur.code)}</strong>
                </div>
              </div>

              <div className="ex-confirm__actions">
                <button className="ex-confirm__cancel" type="button" onClick={() => setStep('form')}>
                  Cancel
                </button>
                <button className="ex-confirm__proceed" type="button" onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Processing overlay ────────────────────────────────────────── */}
        {step === 'processing' && (
          <div className="ex-confirm-overlay" role="status" aria-label="Processing exchange">
            <div className="ex-confirm ex-confirm--center">
              <span className="send-ring-loader" aria-hidden="true" />
              <p className="ex-processing-text">Processing exchange…</p>
            </div>
          </div>
        )}

        {/* ── Success overlay ───────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="ex-confirm-overlay" role="dialog" aria-modal="true" aria-label="Exchange successful">
            <div className="ex-confirm ex-confirm--center">
              <div className="ex-success__icon">
                <CheckCircleIcon size={64} color="#16a34a" />
              </div>
              <h2 className="ex-success__title">Exchange Successful!</h2>
              <p className="ex-success__msg">
                You exchanged <strong>{fmt(fromCur.symbol, fromAmount, fromCur.code)}</strong> to{' '}
                <strong>{fmt(toCur.symbol, toAmount, toCur.code)}</strong>.
              </p>

              <div className="ex-success__meta">
                <div className="ex-success__row"><span>From</span><span>{fromCur.code}</span></div>
                <div className="ex-success__row"><span>To</span><span>{toCur.code}</span></div>
                <div className="ex-success__row"><span>Rate</span><span>1 {fromCur.code} = {rate.toLocaleString('en', { maximumFractionDigits: 6 })} {toCur.code}</span></div>
                <div className="ex-success__row"><span>Fee</span><span>{fmt(fromCur.symbol, fee, fromCur.code)}</span></div>
                <div className="ex-success__row"><span>Reference</span><span>{txnRef}</span></div>
                <div className="ex-success__row"><span>Date</span><span>{txnDate}</span></div>
                <div className="ex-success__row"><span>Status</span><span className="ex-success__status">Completed</span></div>
              </div>

              <button className="ex-done-btn" type="button" onClick={handleDone}>Done</button>
            </div>
          </div>
        )}

        {/* ── Live rates strip ──────────────────────────────────────────── */}
        <div className="ex-rates-strip">
          <div className="ex-rates-scroll">
            {(['USD','GBP','EUR','USDT','BTC'] as Currency[]).map((code) => {
              const meta = CURRENCIES.find((c) => c.code === code)!;
              const rateToNgn = RATES_TO_NGN[code];
              return (
                <div className="ex-rate-chip" key={code}>
                  <span className="ex-rate-chip__pair">{meta.flag} {code}/NGN</span>
                  <span className="ex-rate-chip__val">₦{rateToNgn.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Converter card ────────────────────────────────────────────── */}
        <div className="ex-card">
          <div className="ex-card__header">
            <ExchangeIcon size={18} color="#111" />
            <span className="ex-card__title">Currency Exchange</span>
          </div>

          {/* From */}
          <div className="ex-field">
            <div className="ex-field__top">
              <span className="ex-field__label">You send</span>
              <span className="ex-field__bal">
                Balance: {fmt(fromCur.symbol, fromCur.balance, fromCur.code)}
              </span>
            </div>
            <div className={`ex-field__row${insufficient ? ' ex-field__row--error' : ''}`}>
              <CurrencyPicker selected={fromCur} exclude={toCur.code} onSelect={setFromCur} />
              <input
                className="ex-field__input"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={fromRaw}
                onChange={handleFromChange}
                aria-label={`Amount in ${fromCur.code}`}
              />
            </div>
            {insufficient && (
              <p className="ex-field__err">Insufficient {fromCur.code} balance</p>
            )}
          </div>

          {/* Swap button */}
          <div className="ex-swap-row">
            <div className="ex-swap-line" />
            <button
              className="ex-swap-btn"
              type="button"
              onClick={handleSwap}
              aria-label="Swap currencies"
            >
              <ExchangeIcon size={16} color="#fff" />
            </button>
            <div className="ex-swap-line" />
          </div>

          {/* To */}
          <div className="ex-field">
            <div className="ex-field__top">
              <span className="ex-field__label">You receive</span>
              <span className="ex-field__bal">
                Balance: {fmt(toCur.symbol, toCur.balance, toCur.code)}
              </span>
            </div>
            <div className="ex-field__row">
              <CurrencyPicker selected={toCur} exclude={fromCur.code} onSelect={setToCur} />
              <input
                className="ex-field__input"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={toRaw}
                onChange={handleToChange}
                aria-label={`Amount in ${toCur.code}`}
              />
            </div>
          </div>

          {/* Rate & fee summary */}
          {fromAmount > 0 && (
            <div className="ex-summary">
              <div className="ex-summary__row">
                <span>Rate</span>
                <span>1 {fromCur.code} = {rate.toLocaleString('en', { maximumFractionDigits: 6 })} {toCur.code}</span>
              </div>
              <div className="ex-summary__row">
                <span>Fee (0.5%)</span>
                <span>{fmt(fromCur.symbol, fee, fromCur.code)}</span>
              </div>
            </div>
          )}

          <button
            className="ex-cta"
            type="button"
            disabled={!canProceed}
            onClick={() => setStep('confirm')}
          >
            Preview Exchange
          </button>
        </div>

        {/* ── Recent conversions ────────────────────────────────────────── */}
        <div className="ex-recent">
          <h3 className="ex-recent__title">Recent Conversions</h3>
          <div className="ex-recent__list">
            {RECENT.map((r, i) => (
              <div className="ex-recent__item" key={i}>
                <div className="ex-recent__from-to">
                  <span className="ex-recent__badge">{r.from}</span>
                  <span className="ex-recent__arrow">→</span>
                  <span className="ex-recent__badge">{r.to}</span>
                </div>
                <div className="ex-recent__amounts">
                  <span className="ex-recent__from-amt">{r.fromAmt}</span>
                  <span className="ex-recent__to-amt">{r.toAmt}</span>
                </div>
                <span className="ex-recent__date">{r.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
