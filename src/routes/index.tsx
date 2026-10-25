import { Routes, Route } from 'react-router';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import ExchangePage from '../pages/ExchangePage';
import TransactionsPage from '../pages/TransactionsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"             element={<HomePage />}          />
      <Route path="/profile"      element={<ProfilePage />}       />
      <Route path="/settings"     element={<SettingsPage />}      />
      <Route path="/exchange"     element={<ExchangePage />}      />
      <Route path="/transactions" element={<TransactionsPage />}  />
      <Route path="/transfers"    element={<HomePage />}          />
      <Route path="/cards"        element={<HomePage />}          />
      <Route path="/wallets"      element={<HomePage />}          />
      <Route path="/bills"        element={<HomePage />}          />
      <Route path="*"             element={<HomePage />}          />
    </Routes>
  );
}
