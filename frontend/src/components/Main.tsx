import styled from 'styled-components';
import { SyncInfo } from './SyncInfo';
import { CloneTable } from './CloneTable';
import { ActiveClone } from './ActiveClone';

export function Main() {
  return (
    <Container>
      <SyncInfo />
      <CloneTable />
      <ActiveClone />
    </Container>
  );
}

const Container = styled.main`
  margin: 0 auto;
  margin-top: 2rem;
  width: 60rem;
  max-width: calc(100vw - 2rem);
`;
