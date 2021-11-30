import { useBlockNumber, useBlockMeta } from '@usedapp/core';
import styled from 'styled-components';
import { SyncInfo } from './SyncInfo';
import { CloneTable } from './CloneTable';
import { useStore } from '../store';

export function Main() {
  const clones = useStore(store => store.clones);

  return (
    <Container>
      <SyncInfo />
      {clones.length > 0 ? (
        <>
          <h2>
            Revenue Tokens <Small>(Click to select)</Small>
          </h2>
          <CloneTable />
        </>
      ) : null}
    </Container>
  );
}

const Container = styled.main`
  margin: 0 auto;
  margin-top: 2rem;
  width: 60rem;
  max-width: calc(100vw - 2rem);
`;

const Small = styled.span`
  font-size: 1rem;
  font-weight: normal;
  display: inline-block;
  margin-left: 0.5em;
`;
