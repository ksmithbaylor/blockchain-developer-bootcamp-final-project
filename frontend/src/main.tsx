import React from 'react';
import ReactDOM from 'react-dom';
import { Config, ChainId, DAppProvider } from '@usedapp/core';
import './index.css';
import { App } from './App';

const config: Config = {
  readOnlyChainId: ChainId.Ropsten,
  readOnlyUrls: {
    [ChainId.Ropsten]:
      'https://eth-ropsten.alchemyapi.io/v2/dmYmGTaVAU0yLeSBjyoFQ_0iaShRvjwD'
  }
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
