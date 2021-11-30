import { useBlockNumber, useBlockMeta } from '@usedapp/core';
import styled from 'styled-components';
import { SyncInfo } from './SyncInfo';
import { useStore } from '../store';

export function Main() {
  const clones = useStore(store => store.clones);
  const balances = useStore(store => store.balances);

  return (
    <Container>
      <SyncInfo />
      <pre>{JSON.stringify({ clones, balances }, null, 2)}</pre>
    </Container>
  );
}

const Container = styled.main`
  margin: 0 auto;
  margin-top: 2rem;
  width: 60rem;
  max-width: calc(100vw - 2rem);
`;
