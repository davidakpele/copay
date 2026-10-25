import {
  XIcon,
  AirtimeIcon,
  DataBundleIcon,
  SendIcon,
  ReceiveIcon,
  ElectricityIcon,
  TvIcon,
  WifiIcon,
  WaterIcon,
  SchoolIcon,
  TaxIcon,
  GovernmentIcon,
  BettingIcon,
  GiftCardIcon,
  ExamPinIcon,
  FlightIcon,
  HotelIcon,
  InsuranceIcon,
  LoanPayIcon,
  LoanApplyIcon,
  SavingsIcon,
  InvestIcon,
  VirtualCardIcon,
  DebitCardIcon,
  QrCodeIcon,
  MerchantIcon,
  WithdrawIcon,
  DepositIcon,
  BankTransferIcon,
  ExchangeIcon,
  InternationalSendIcon,
  InternationalReceiveIcon,
  TransportIcon,
  RideIcon,
  FoodIcon,
  TicketIcon,
  StreamingIcon,
  GamingIcon,
  MedicalIcon,
  VehicleIcon,
  FineIcon,
  RentIcon,
  InsurancePremiumIcon,
  SavingsGoalIcon,
  AutoSaveIcon,
  SubscriptionIcon,
  RequestMoneyIcon,
  SplitBillIcon,
  ScheduleIcon,
  BulkPaymentIcon,
  SalaryIcon,
  PaymentLinkIcon,
  InvoiceIcon,
  BuyNowPayLaterIcon,
  CashbackIcon,
  ReferEarnIcon,
  TrackExpensesIcon,
  StatementIcon,
  ManageCardsIcon,
  OpenAccountIcon,
  UpgradeIcon,
  BvnIcon,
  NinIcon,
  BlockAccountIcon,
  FraudIcon,
  SupportIcon,
  AtmIcon,
  PosIcon,
  BankBranchIcon,
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

const categories: ServiceCategory[] = [
  {
    title: 'Top Up & Airtime',
    services: [
      { label: 'Buy Airtime',       icon: <AirtimeIcon           size={20} color="#fff" />, color: '#111' },
      { label: 'Buy Data Bundle',   icon: <DataBundleIcon        size={20} color="#fff" />, color: '#0ea5e9' },
    ],
  },
  {
    title: 'Send & Receive',
    services: [
      { label: 'Transfer Money',    icon: <SendIcon              size={20} color="#fff" />, color: '#111' },
      { label: 'Receive Money',     icon: <ReceiveIcon           size={20} color="#fff" />, color: '#16a34a' },
      { label: 'Request Money',     icon: <RequestMoneyIcon      size={20} color="#fff" />, color: '#7c3aed' },
      { label: 'Split Bills',       icon: <SplitBillIcon         size={20} color="#fff" />, color: '#ea580c' },
      { label: 'Schedule Transfer', icon: <ScheduleIcon          size={20} color="#fff" />, color: '#0284c7' },
      { label: 'Bulk Payments',     icon: <BulkPaymentIcon       size={20} color="#fff" />, color: '#374151' },
      { label: 'Pay Salaries',      icon: <SalaryIcon            size={20} color="#fff" />, color: '#15803d' },
    ],
  },
  {
    title: 'Pay Bills',
    services: [
      { label: 'Pay Electricity',   icon: <ElectricityIcon       size={20} color="#fff" />, color: '#f59e0b' },
      { label: 'Pay TV Sub',        icon: <TvIcon                size={20} color="#fff" />, color: '#8b5cf6' },
      { label: 'Pay Internet',      icon: <WifiIcon              size={20} color="#fff" />, color: '#0891b2' },
      { label: 'Pay Water',         icon: <WaterIcon             size={20} color="#fff" />, color: '#2563eb' },
      { label: 'Pay School Fees',   icon: <SchoolIcon            size={20} color="#fff" />, color: '#d97706' },
      { label: 'Pay Taxes',         icon: <TaxIcon               size={20} color="#fff" />, color: '#374151' },
      { label: 'Government Bills',  icon: <GovernmentIcon        size={20} color="#fff" />, color: '#1e40af' },
      { label: 'Pay Betting Wallet',icon: <BettingIcon           size={20} color="#fff" />, color: '#065f46' },
      { label: 'Medical Bills',     icon: <MedicalIcon           size={20} color="#fff" />, color: '#dc2626' },
      { label: 'Vehicle License',   icon: <VehicleIcon           size={20} color="#fff" />, color: '#92400e' },
      { label: 'Traffic Fines',     icon: <FineIcon              size={20} color="#fff" />, color: '#b91c1c' },
      { label: 'Pay Rent',          icon: <RentIcon              size={20} color="#fff" />, color: '#1d4ed8' },
      { label: 'Insurance Premium', icon: <InsurancePremiumIcon  size={20} color="#fff" />, color: '#0f766e' },
    ],
  },
  {
    title: 'Travel & Lifestyle',
    services: [
      { label: 'Book Flights',      icon: <FlightIcon            size={20} color="#fff" />, color: '#0369a1' },
      { label: 'Book Hotels',       icon: <HotelIcon             size={20} color="#fff" />, color: '#7e22ce' },
      { label: 'Transportation',    icon: <TransportIcon         size={20} color="#fff" />, color: '#0284c7' },
      { label: 'Ride-Hailing',      icon: <RideIcon              size={20} color="#fff" />, color: '#111' },
      { label: 'Food Delivery',     icon: <FoodIcon              size={20} color="#fff" />, color: '#ea580c' },
      { label: 'Event Tickets',     icon: <TicketIcon            size={20} color="#fff" />, color: '#9333ea' },
      { label: 'Streaming',         icon: <StreamingIcon         size={20} color="#fff" />, color: '#dc2626' },
      { label: 'Gaming Vouchers',   icon: <GamingIcon            size={20} color="#fff" />, color: '#059669' },
    ],
  },
  {
    title: 'Shopping & Vouchers',
    services: [
      { label: 'Buy Gift Cards',    icon: <GiftCardIcon          size={20} color="#fff" />, color: '#db2777' },
      { label: 'Buy Exam PIN',      icon: <ExamPinIcon           size={20} color="#fff" />, color: '#2563eb' },
      { label: 'Buy Now Pay Later', icon: <BuyNowPayLaterIcon    size={20} color="#fff" />, color: '#d97706' },
      { label: 'Earn Cashback',     icon: <CashbackIcon          size={20} color="#fff" />, color: '#16a34a' },
      { label: 'Refer & Earn',      icon: <ReferEarnIcon         size={20} color="#fff" />, color: '#7c3aed' },
    ],
  },
  {
    title: 'Finance & Investments',
    services: [
      { label: 'Buy Insurance',     icon: <InsuranceIcon         size={20} color="#fff" />, color: '#0f766e' },
      { label: 'Pay Loan',          icon: <LoanPayIcon           size={20} color="#fff" />, color: '#374151' },
      { label: 'Apply for Loan',    icon: <LoanApplyIcon         size={20} color="#fff" />, color: '#1d4ed8' },
      { label: 'Save Money',        icon: <SavingsIcon           size={20} color="#fff" />, color: '#15803d' },
      { label: 'Invest Money',      icon: <InvestIcon            size={20} color="#fff" />, color: '#b45309' },
      { label: 'Savings Goal',      icon: <SavingsGoalIcon       size={20} color="#fff" />, color: '#0891b2' },
      { label: 'Auto Savings',      icon: <AutoSaveIcon          size={20} color="#fff" />, color: '#6d28d9' },
      { label: 'Manage Subs',       icon: <SubscriptionIcon      size={20} color="#fff" />, color: '#111' },
    ],
  },
  {
    title: 'Cards & Payments',
    services: [
      { label: 'Virtual Card',      icon: <VirtualCardIcon       size={20} color="#fff" />, color: '#111' },
      { label: 'Request Debit Card',icon: <DebitCardIcon         size={20} color="#fff" />, color: '#374151' },
      { label: 'Pay with QR',       icon: <QrCodeIcon            size={20} color="#fff" />, color: '#0284c7' },
      { label: 'Pay Merchants',     icon: <MerchantIcon          size={20} color="#fff" />, color: '#b45309' },
      { label: 'Payment Links',     icon: <PaymentLinkIcon       size={20} color="#fff" />, color: '#7c3aed' },
      { label: 'Generate Invoice',  icon: <InvoiceIcon           size={20} color="#fff" />, color: '#059669' },
      { label: 'Manage Cards',      icon: <ManageCardsIcon       size={20} color="#fff" />, color: '#111' },
    ],
  },
  {
    title: 'Transfers & Exchange',
    services: [
      { label: 'Withdraw Money',    icon: <WithdrawIcon          size={20} color="#fff" />, color: '#374151' },
      { label: 'Deposit Money',     icon: <DepositIcon           size={20} color="#fff" />, color: '#16a34a' },
      { label: 'Bank Transfer',     icon: <BankTransferIcon      size={20} color="#fff" />, color: '#1d4ed8' },
      { label: 'Exchange Currency', icon: <ExchangeIcon          size={20} color="#fff" />, color: '#b45309' },
      { label: 'Send Intl',         icon: <InternationalSendIcon size={20} color="#fff" />, color: '#111' },
      { label: 'Receive Intl',      icon: <InternationalReceiveIcon size={20} color="#fff" />, color: '#0f766e' },
    ],
  },
  {
    title: 'Account & Tools',
    services: [
      { label: 'Track Expenses',    icon: <TrackExpensesIcon     size={20} color="#fff" />, color: '#0891b2' },
      { label: 'Account Statement', icon: <StatementIcon         size={20} color="#fff" />, color: '#374151' },
      { label: 'Open Account',      icon: <OpenAccountIcon       size={20} color="#fff" />, color: '#15803d' },
      { label: 'Upgrade Account',   icon: <UpgradeIcon           size={20} color="#fff" />, color: '#7c3aed' },
      { label: 'Verify BVN',        icon: <BvnIcon               size={20} color="#fff" />, color: '#1d4ed8' },
      { label: 'Verify NIN',        icon: <NinIcon               size={20} color="#fff" />, color: '#0369a1' },
      { label: 'Block Account',     icon: <BlockAccountIcon      size={20} color="#fff" />, color: '#dc2626' },
      { label: 'Report Fraud',      icon: <FraudIcon             size={20} color="#fff" />, color: '#b91c1c' },
      { label: 'Customer Support',  icon: <SupportIcon           size={20} color="#fff" />, color: '#111' },
      { label: 'Locate ATMs',       icon: <AtmIcon               size={20} color="#fff" />, color: '#374151' },
      { label: 'Locate POS',        icon: <PosIcon               size={20} color="#fff" />, color: '#374151' },
      { label: 'Bank Branches',     icon: <BankBranchIcon        size={20} color="#fff" />, color: '#1e40af' },
    ],
  },
];

interface ServicesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ServicesDrawer({ open, onClose }: ServicesDrawerProps) {
  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`services-drawer${open ? ' services-drawer--open' : ''}`}
        aria-label="All Services"
        aria-hidden={!open}
      >
        <div className="services-drawer__header">
          <div>
            <h2 className="services-drawer__title">All Services</h2>
            <p className="services-drawer__subtitle">Everything you can do with Copay</p>
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
          {categories.map((cat) => (
            <section key={cat.title} className="services-category">
              <h3 className="services-category__title">{cat.title}</h3>
              <div className="services-grid">
                {cat.services.map((service) => (
                  <button
                    key={service.label}
                    className="service-item"
                    type="button"
                  >
                    <span
                      className="service-item__icon"
                      style={{ background: service.color }}
                    >
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
