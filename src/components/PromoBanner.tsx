import { GlobeIcon, ChevronRightIcon } from './Icons';

export default function PromoBanner() {
  return (
    <div className="promo-banner">
      <div className="promo-banner__content">
        <h3 className="promo-banner__title">Need to send money abroad?</h3>
        <p className="promo-banner__sub">
          Send to over 50 countries with great rates and low fees.
        </p>
        <button className="promo-banner__btn" type="button">
          Send International
          <ChevronRightIcon size={15} color="#fff" />
        </button>
      </div>
      <div className="promo-banner__graphic" aria-hidden="true">
        <GlobeIcon size={88} color="#1a1a1a" />
      </div>
    </div>
  );
}
