import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { AddressInput, NumberInput } from './inputs';
import { EtherscanLink } from './EtherscanLink';
import { useStore } from '../store';

export function CreateClone() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [dirty, setDirty] = useState(false);
  const parentContract = useStore(store => store.parentContract);
  const account = useStore(store => store.account);
  const actions = useStore(store => store.actions);
  const { state, send } = useContractFunction(parentContract, 'clone', {
    transactionName: 'Clone'
  });

  const handleClone = () => {
    send(name, symbol, account);
  };

  useEffect(() => {
    if (!dirty && state.status === 'Success') {
      setName('');
      setSymbol('');
      setDirty(true);
      actions.refresh();
    } else if (state.status !== 'Success') {
      setDirty(false);
    }
  }, [dirty, state.status]);

  return (
    <Container>
      <h2 style={{ marginBottom: '1rem' }}>Create a token</h2>
      <AddressInput
        type="text"
        placeholder="name for the token"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <NumberInput
        type="text"
        placeholder="symbol for the token"
        value={symbol}
        onChange={e => setSymbol(e.target.value)}
      />
      <div>
        <Button onClick={handleClone}>Create</Button>{' '}
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
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 1rem;
`;
