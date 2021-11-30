import { useBlockNumber } from '@usedapp/core';
import styled from 'styled-components';
import { useStore } from '../store';

export function Main() {
  const clones = useStore(store => store.clones);
  const balances = useStore(store => store.balances);
  const block = useBlockNumber();

  return (
    <Container>
      <pre>{JSON.stringify({ block, clones, balances }, null, 2)}</pre>
    </Container>
  );
}

const Container = styled.main`
  margin: 0 auto;
  margin-top: 2rem;
  width: 60rem;
  max-width: calc(100vw - 2rem);
`;
