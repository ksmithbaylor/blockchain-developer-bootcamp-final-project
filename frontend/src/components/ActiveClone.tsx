import styled from 'styled-components';
import { utils } from 'ethers';
import { useToken, useTokenBalance } from '@usedapp/core';
import { Button } from './Button';
import { EtherscanLink } from './EtherscanLink';
import { Participants } from './Participants';
import { AddParticipant } from './AddParticipant';
import { useStore } from '../store';

export function ActiveClone() {
  const address = useStore(store => store.activeClone);
  const account = useStore(store => store.account);
  const actions = useStore(store => store.actions);
  const balance = useTokenBalance(address, account);
  const tokenInfo = useToken(address);

  if (!address || !tokenInfo || !balance) {
    return null;
  }

  const handleClose = () => {
    actions.selectClone(null);
  };

  const { name, symbol } = tokenInfo;

  return (
    <>
      <h2>Active Token</h2>
      <Container>
        <CloseButton onClick={handleClose}>Close</CloseButton>
        <Header>
          {name} / {symbol} (
          <EtherscanLink path={`/address/${address}`}>{address}</EtherscanLink>)
        </Header>
        <table>
          <tbody>
            <Row>
              <RowTitle>
                <b>Balance</b>:
              </RowTitle>
              <td>
                {utils.formatEther(balance)} {symbol}
              </td>
            </Row>
            <Row>
              <RowTitle>
                <b>Participants</b>:
              </RowTitle>
              <Participants address={address} />
            </Row>
            <Row>
              <RowTitle>
                <b>Add Participant</b>:
              </RowTitle>
              <AddParticipant clone={address} />
            </Row>
          </tbody>
        </table>
      </Container>
    </>
  );
}

const Container = styled.div`
  margin-top: 1rem;
  width: 100%;
  border: 1px solid var(--color-text-light);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-elevation-high);
  background: var(--color-bg-dark);
  padding: 0.75rem;
  position: relative;
`;

const Header = styled.h3`
  margin-bottom: 1rem;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
`;

const Row = styled.tr`
  &:not(:first-of-type) td {
    padding-top: 1rem;
  }
`;

const RowTitle = styled.td`
  padding-right: 1rem;
  vertical-align: top;
  width: 9rem;
`;
