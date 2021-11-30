import { useState, useEffect } from 'react';
import { Contract, utils } from 'ethers';
import styled from 'styled-components';
import { useAppContext } from '../AppContext';
import { useEthers, useTokenBalance } from '@usedapp/core';

export function Main() {
  const [info, setInfo] = useState<object | null>(null);
  const { parentContract } = useAppContext();
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(parentContract?.address, account);
  const formattedBalance = !!tokenBalance
    ? utils.formatEther(tokenBalance)
    : undefined;

  useEffect(() => {
    if (parentContract) {
      getContractInfo(parentContract).then(setInfo);
    }
  }, [parentContract]);

  if (!info) {
    return null;
  }

  return (
    <Container>
      <pre>{JSON.stringify({ ...info, formattedBalance }, null, 2)}</pre>
    </Container>
  );
}

const Container = styled.main`
  margin: 0 auto;
  margin-top: 2rem;
  width: 60rem;
  max-width: calc(100vw - 2rem);
`;

async function getContractInfo(parentContract: Contract) {
  const name = await parentContract.name();
  const symbol = await parentContract.symbol();
  const decimals = await parentContract.decimals();
  return { name, symbol, decimals };
}
