import { useState, useEffect } from 'react';
import { utils } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { WideInput, NarrowInput } from './inputs';
import { TransactionStatus } from './TransactionStatus';
import { getCloneContract } from '../eth/contracts';

type Props = {
  clone: string;
};

export function AddParticipant({ clone }: Props) {
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
      <WideInput
        type="text"
        placeholder="new participant address"
        value={participant}
        onChange={e => setParticipant(e.target.value)}
      />
      <NarrowInput
        type="number"
        placeholder="initial grant amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <div>
        <Button onClick={handleAddParticipant}>Add</Button>
        <TransactionStatus state={state} />
      </div>
    </td>
  );
}
