import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { utils } from 'ethers';
import {
  useToken,
  useTokenBalance,
  useContractCall,
  useContractCalls,
  useContractFunction
} from '@usedapp/core';
import { Button } from './Button';
import { AddressInput, NumberInput } from './inputs';
import { EtherscanLink } from './EtherscanLink';
import { useStore } from '../store';
import { getCloneContract } from '../eth/contracts';

export function ActiveClone() {
  const parentContract = useStore(store => store.parentContract);
  const address = useStore(store => store.activeClone);
  const account = useStore(store => store.account);
  const actions = useStore(store => store.actions);
  const tokenInfo = useToken(address);
  const balance = useTokenBalance(address, account);
  const abi = parentContract?.interface;
  const [participants]: [string[]] =
    // @ts-ignore
    (useContractCall({ abi, address, method: 'participants', args: [] }) as [
      string[]
    ]) ?? [[]];
  const balances = useContractCalls(
    // @ts-ignore
    participants.map(participant => ({
      abi,
      address,
      method: 'balanceOf',
      args: [participant]
    }))
  );

  if (!address || !tokenInfo || !balance || !balances || !participants) {
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
              <td>
                {participants.map((participant, i) => (
                  <div key={participant}>
                    <EtherscanLink path={`/address/${participant}`}>
                      {participant}
                    </EtherscanLink>{' '}
                    {balances && balances[i]
                      ? '(' +
                        utils.formatEther(balances[i]?.[0]) +
                        ' ' +
                        symbol +
                        ')'
                      : null}
                  </div>
                ))}
              </td>
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

type AddParticipantProps = {
  clone: string;
};

function AddParticipant({ clone }: AddParticipantProps) {
  const [participant, setParticipant] = useState('');
  const [amount, setAmount] = useState('');
  const [dirty, setDirty] = useState(false);
  const cloneContract = getCloneContract(clone);
  const { state, send } = useContractFunction(cloneContract, 'addParticipant', {
    transactionName: 'Add Participant'
  });

  const handleAddParticipant = () => {
    send(participant, utils.parseEther(amount));
  };

  useEffect(() => {
    if (!dirty && state.status === 'Success') {
      setParticipant('');
      setAmount('');
      setDirty(true);
    } else if (state.status !== 'Success') {
      setDirty(false);
    }
  }, [dirty, state.status]);

  return (
    <td>
      <AddressInput
        type="text"
        placeholder="address"
        value={participant}
        onChange={e => setParticipant(e.target.value)}
      />
      <NumberInput
        type="number"
        placeholder="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <div>
        <Button onClick={handleAddParticipant}>Add</Button>{' '}
        {state.status === 'None' || state.status === 'Success' ? null : (
          <>
            ({state.status}{' '}
            <EtherscanLink path={`/tx/${state.transaction?.hash}`}>
              {state.transaction?.hash}
            </EtherscanLink>
            )
          </>
        )}
      </div>
    </td>
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
  padding-bottom: 0.5rem;
`;

const RowTitle = styled.td`
  padding-right: 1rem;
  vertical-align: top;
  width: 9rem;
`;
