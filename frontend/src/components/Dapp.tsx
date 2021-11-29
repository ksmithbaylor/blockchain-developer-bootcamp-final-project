import { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { useDappContext } from '../DappContext';

export function Dapp() {
  const [info, setInfo] = useState<object | null>(null);
  const { parentContract } = useDappContext();

  useEffect(() => {
    if (parentContract) {
      getContractInfo(parentContract).then(setInfo);
    }
  }, [parentContract]);

  if (!info) {
    return null;
  }

  return <p>{JSON.stringify(info, null, 2)}</p>;
}

async function getContractInfo(parentContract: Contract) {
  const name = await parentContract.name();
  const symbol = await parentContract.symbol();
  const decimals = await parentContract.decimals();
  return { name, symbol, decimals };
}
