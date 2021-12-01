import { useState, useEffect } from 'react';
import { utils } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { AddressInput, NumberInput } from './inputs';
import { EtherscanLink } from './EtherscanLink';
import { getCloneContract } from '../eth/contracts';

type Props = {
  clone: string;
};

export function Transfer({ clone }: Props) {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [dirty, setDirty] = useState(false);
  const cloneContract = getCloneContract(clone);
  const { state, send } = useContractFunction(cloneContract, 'transfer', {
    transactionName: 'Transfer'
  });

  const handleTransfer = () => {
    send(receiver, utils.parseEther(amount));
  };

  useEffect(() => {
    if (!dirty && state.status === 'Success') {
      setReceiver('');
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
        placeholder="receiving address"
        value={receiver}
        onChange={e => setReceiver(e.target.value)}
      />
      <NumberInput
        type="number"
        placeholder="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <div>
        <Button onClick={handleTransfer}>Transfer</Button>{' '}
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
