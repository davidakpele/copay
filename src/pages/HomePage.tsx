import AppShell from '../components/AppShell';
import WalletCard from '../components/WalletCard';
import QuickActions from '../components/QuickActions';
import TransactionList from '../components/TransactionList';
import PromoBanner from '../components/PromoBanner';
import RightPanel from '../components/RightPanel';

export default function HomePage() {
  return (
    <AppShell
      title="Good morning, Ada"
      subtitle="Here's what's happening with your money today."
      rightPanel={<RightPanel />}
    >
      <WalletCard />
      <QuickActions />
      <TransactionList />
      <PromoBanner />
    </AppShell>
  );
}
