import { useState, useEffect, useMemo } from 'react';
import { Contract } from 'ethers';
import styled from 'styled-components';
import { Connector } from './components/Connector';
import { Dapp } from './components/Dapp';
import { getParentContract } from './eth/contracts';
import { DappContext } from './DappContext';

export function App() {
  const [count, setCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [parentContract, setParentContract] = useState<Contract | null>(null);

  const dappContext = useMemo(
    () => ({
      parentContract
    }),
    [parentContract]
  );

  useEffect(() => {
    if (connected) {
      setParentContract(getParentContract());
    } else {
      setParentContract(null);
    }
  }, [connected]);

  return (
    <Container>
      <Connector onConnectionChange={setConnected} />
      {!connected || !parentContract ? null : (
        <DappContext.Provider value={dappContext}>
          <Dapp />
        </DappContext.Provider>
      )}
    </Container>
  );
}

const Container = styled.div``;
