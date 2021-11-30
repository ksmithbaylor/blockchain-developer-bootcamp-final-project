import { useState, useEffect, useMemo } from 'react';
import { Contract } from 'ethers';
import { Connector } from './components/Connector';
import { Main } from './components/Main';
import { getParentContract } from './eth/contracts';
import { AppContext } from './AppContext';

export function App() {
  const [connected, setConnected] = useState(false);
  const [parentContract, setParentContract] = useState<Contract | null>(null);

  const contextValue = useMemo(
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
    <>
      <Connector onConnectionChange={setConnected} />
      <AppContext.Provider value={contextValue}>
        {!connected || !parentContract ? null : <Main />}
      </AppContext.Provider>
    </>
  );
}
