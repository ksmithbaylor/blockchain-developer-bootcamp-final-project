import styled from 'styled-components';
import { SyncInfo } from './SyncInfo';
import { CloneTable } from './CloneTable';
import { ActiveClone } from './ActiveClone';
import { useStore } from '../store';

export function Main() {
  const activeClone = useStore(store => store.activeClone);

  return (
    <Container>
      <SyncInfo />
      <CloneTable />
      {activeClone ? <ActiveClone /> : null}
    </Container>
  );
}

const Container = styled.main`
  margin: 0 auto;
  margin-top: 2rem;
  width: 60rem;
  max-width: calc(100vw - 2rem);
`;
