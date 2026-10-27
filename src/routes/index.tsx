import { Routes, Route } from 'react-router';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import ExchangePage from '../pages/ExchangePage';
import TransactionsPage from '../pages/TransactionsPage';
import BeneficiaryPage from '../pages/BeneficiaryPage';
import BeneficiaryTransferPage from '../pages/BeneficiaryTransferPage';
import DepositBankPage from '../pages/DepositBankPage';
import WalletPage from '../pages/WalletPage';
import BillsPage from '../pages/BillsPage';
import AirtimePage from '../pages/bills/AirtimePage';
import DataPage from '../pages/bills/DataPage';
import CableTVPage from '../pages/bills/CableTVPage';
import ElectricityPage from '../pages/bills/ElectricityPage';
import BettingPage from '../pages/bills/BettingPage';
import ShoppingPage from '../pages/bills/ShoppingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"               element={<HomePage />}         />
      <Route path="/profile"        element={<ProfilePage />}      />
      <Route path="/settings"       element={<SettingsPage />}     />
      <Route path="/exchange"       element={<ExchangePage />}     />
      <Route path="/transactions"   element={<TransactionsPage />} />
      <Route path="/beneficiaries"       element={<BeneficiaryPage />}         />
      <Route path="/beneficiary-transfer" element={<BeneficiaryTransferPage />}  />
      <Route path="/deposit-banks"        element={<DepositBankPage />}          />
      <Route path="/wallets"              element={<WalletPage />}               />
      <Route path="/bills"                element={<BillsPage />}                />
      <Route path="/bills/airtime"        element={<AirtimePage />}              />
      <Route path="/bills/data"           element={<DataPage />}                 />
      <Route path="/bills/cable-tv"       element={<CableTVPage />}              />
      <Route path="/bills/electricity"    element={<ElectricityPage />}          />
      <Route path="/bills/betting"        element={<BettingPage />}              />
      <Route path="/bills/shopping"       element={<ShoppingPage />}             />
      <Route path="*"               element={<HomePage />}         />
    </Routes>
  );
}
