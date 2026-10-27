import { useNavigate } from 'react-router';
import AppShell from '../components/AppShell';
import { SERVICES } from '../data/bills';

export default function BillsPage() {
  const navigate = useNavigate();

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
              onClick={() => navigate(service.route)}
            >
              <h3 className="bills-card__title">{service.name}</h3>
              <div className="bills-card__img-wrap">
                <img
                  src={service.image}
                  alt={service.name}
                  className="bills-card__img"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
              <div className="bills-card__pay-btn">Pay <span>›</span></div>
            </button>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
