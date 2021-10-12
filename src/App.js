
import { Route } from 'react-router-dom';

import './scss/Fonts.scss';
import './scss/App.scss';

import useMetaMask from "./hooks/useMetaMask";
import useTransactionFloater from './hooks/useTransactionFloater';
import TransactionFloaters from './components/TransactionFloaters';

import Breeding from './pages/Breeding';
import Header from './components/Header';
import { useState } from 'react';


function App() {
  const userWallet = useMetaMask();
  const { transactionHandlers, transactions } = useTransactionFloater();

  const [activeView, setActiveView] = useState('');

  <Header userWallet={userWallet} />

  return (
    <div className="App">

      <Header userWallet={userWallet} />

      <Route path="/breeding">
        <Breeding userWallet={userWallet} handlers={{ transactionHandlers }} />
      </Route>

      <Route path="/">
      </Route>

      <TransactionFloaters transactions={transactions} transactionHandlers={transactionHandlers} />

    </div>
  );
}

export default App;
