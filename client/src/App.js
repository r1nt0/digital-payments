import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/login';
import SignupPage from './components/signup';
import UserWindow from './components/userwindow';
import CentralBank from './components/central-bank';
import BalanceWindow from './components/BalanceWindow';
import TransferWindow from './components/TransferWindow';
import ChequeWindow from './components/ChequeWindow';
import TransactionWindow from './components/TransactionWindow';
import Notificationwindow from './components/notificationwindow';
import Anotherpage from './components/anotherpage';
import UserPage from './components/UserPage';
import CurrencyPage from './components/CurrencyPage';
import DigitalCurrency from './components/DigitalCurrency';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user" element={<UserWindow />} />
        <Route path="/admin" element={<CentralBank />} />
        <Route path="/balance" element={<BalanceWindow />} />
        <Route path="/transfer" element={<TransferWindow />} />
        <Route path="/cheques" element={<ChequeWindow />} />
        <Route path="/transaction-history" element={<TransactionWindow />} />
        <Route path="/notifications" element={<Notificationwindow />} />
        <Route path="/another-page" component={<Anotherpage />} />
        <Route path="/user-page" component={<UserPage />} />
        <Route path="/currency-page" component={< CurrencyPage />} />
        <Route path="/digital-currency" component={< DigitalCurrency />} />
      </Routes>
    </Router>
  );
}

export default App;
