import {
  XIcon,
  ElectricityIcon,
  TvIcon,
  WifiIcon,
  WaterIcon,
  SchoolIcon,
  TaxIcon,
  GovernmentIcon,
  BettingIcon,
  MedicalIcon,
  VehicleIcon,
  FineIcon,
  RentIcon,
  InsurancePremiumIcon,
} from './Icons';

interface Service {
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface ServiceCategory {
  title: string;
  services: Service[];
}

const billServices: ServiceCategory[] = [
  {
    title: 'Pay Bills',
    services: [
      { label: 'Pay Electricity', icon: <ElectricityIcon size={20} color="#fff" />, color: '#f59e0b' },
      { label: 'Pay TV Sub', icon: <TvIcon size={20} color="#fff" />, color: '#8b5cf6' },
      { label: 'Pay Internet', icon: <WifiIcon size={20} color="#fff" />, color: '#0891b2' },
      { label: 'Pay Water', icon: <WaterIcon size={20} color="#fff" />, color: '#2563eb' },
      { label: 'Pay School Fees', icon: <SchoolIcon size={20} color="#fff" />, color: '#d97706' },
      { label: 'Pay Taxes', icon: <TaxIcon size={20} color="#fff" />, color: '#374151' },
      { label: 'Government Bills', icon: <GovernmentIcon size={20} color="#fff" />, color: '#1e40af' },
      { label: 'Pay Betting Wallet', icon: <BettingIcon size={20} color="#fff" />, color: '#065f46' },
      { label: 'Medical Bills', icon: <MedicalIcon size={20} color="#fff" />, color: '#dc2626' },
      { label: 'Vehicle License', icon: <VehicleIcon size={20} color="#fff" />, color: '#92400e' },
      { label: 'Traffic Fines', icon: <FineIcon size={20} color="#fff" />, color: '#b91c1c' },
      { label: 'Pay Rent', icon: <RentIcon size={20} color="#fff" />, color: '#1d4ed8' },
      { label: 'Insurance Premium', icon: <InsurancePremiumIcon size={20} color="#fff" />, color: '#0f766e' },
    ],
  },
];

const allServices: ServiceCategory[] = [
  {
    title: 'Pay Bills',
    services: [
      { label: 'Pay Electricity', icon: <ElectricityIcon size={20} color="#fff" />, color: '#f59e0b' },
      { label: 'Pay TV Sub', icon: <TvIcon size={20} color="#fff" />, color: '#8b5cf6' },
      { label: 'Pay Internet', icon: <WifiIcon size={20} color="#fff" />, color: '#0891b2' },
      { label: 'Pay Water', icon: <WaterIcon size={20} color="#fff" />, color: '#2563eb' },
      { label: 'Pay School Fees', icon: <SchoolIcon size={20} color="#fff" />, color: '#d97706' },
      { label: 'Pay Taxes', icon: <TaxIcon size={20} color="#fff" />, color: '#374151' },
      { label: 'Government Bills', icon: <GovernmentIcon size={20} color="#fff" />, color: '#1e40af' },
      { label: 'Pay Betting Wallet', icon: <BettingIcon size={20} color="#fff" />, color: '#065f46' },
      { label: 'Medical Bills', icon: <MedicalIcon size={20} color="#fff" />, color: '#dc2626' },
      { label: 'Vehicle License', icon: <VehicleIcon size={20} color="#fff" />, color: '#92400e' },
      { label: 'Traffic Fines', icon: <FineIcon size={20} color="#fff" />, color: '#b91c1c' },
      { label: 'Pay Rent', icon: <RentIcon size={20} color="#fff" />, color: '#1d4ed8' },
      { label: 'Insurance Premium', icon: <InsurancePremiumIcon size={20} color="#fff" />, color: '#0f766e' },
    ],
  },
];

type ServicesView = 'all' | 'bills';

interface ServicesDrawerProps {
  open: boolean;
  onClose: () => void;
  view?: ServicesView;
}

export default function ServicesDrawer({ open, onClose, view = 'all' }: ServicesDrawerProps) {
  const visibleCategories = view === 'bills' ? billServices : allServices;
  const title = view === 'bills' ? 'Pay Bills' : 'All Services';
  const subtitle = view === 'bills'
    ? 'Bills and utility payments available in Copay'
    : 'Everything you can do with Copay';

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`services-drawer${open ? ' services-drawer--open' : ''}`}
        aria-label={title}
        aria-hidden={!open}
      >
        <div className="services-drawer__header">
          <div>
            <h2 className="services-drawer__title">{title}</h2>
            <p className="services-drawer__subtitle">{subtitle}</p>
          </div>
          <button
            className="services-drawer__close"
            onClick={onClose}
            aria-label="Close services"
            type="button"
          >
            <XIcon size={18} color="#555" />
          </button>
        </div>

        <div className="services-drawer__body">
          {visibleCategories.map((cat) => (
            <section key={cat.title} className="services-category">
              <h3 className="services-category__title">{cat.title}</h3>
              <div className="services-grid">
                {cat.services.map((service) => (
                  <button key={service.label} className="service-item" type="button">
                    <span className="service-item__icon" style={{ background: service.color }}>
                      {service.icon}
                    </span>
                    <span className="service-item__label">{service.label}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}
