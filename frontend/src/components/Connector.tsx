import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { haveAccounts, whichChain, initialize } from '../eth/connection';
import { getParentContract } from '../eth/contracts';

type Props = {
  onConnectionChange: (connected: boolean) => void;
};

export function Connector({ onConnectionChange }: Props) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  const walletInstalled = typeof window.ethereum !== 'undefined';
  const isOnRopsten = chainId === '0x3';

  const handleConnectClick = async () => {
    try {
      await initialize();
      setConnected(true);
    } catch (err) {
      console.error(err);
      setConnected(false);
    }
  };

  useEffect(() => {
    if (walletInstalled) {
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setConnected(accounts.length > 0);
      });

      haveAccounts()
        .then(setConnected)
        .then(() => whichChain())
        .then(setChainId)
        .then(() => {
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (isOnRopsten) {
      onConnectionChange(connected);
    }
  }, [connected, isOnRopsten]);

  if (!walletInstalled) {
    return <p>Please install an Ethereum browser wallet to use this dapp</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isOnRopsten) {
    return <p>Please switch to Ropsten.</p>;
  }

  if (connected) {
    return <p>Connected!</p>;
  }

  return <button onClick={handleConnectClick}>Connect</button>;
}
