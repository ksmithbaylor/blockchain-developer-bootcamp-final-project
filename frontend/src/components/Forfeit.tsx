import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { TransactionStatus } from './TransactionStatus';
import { getCloneContract } from '../eth/contracts';

type Props = {
  clone: string;
};

export function Forfeit({ clone }: Props) {
  const cloneContract = getCloneContract(clone);
  const { state, send } = useContractFunction(cloneContract, 'forfeit', {
    transactionName: 'Forfeit'
  });

  const handleForfeit = () => {
    send();
  };

  return (
    <td>
      <div>
        <Button onClick={handleForfeit}>Forfeit</Button>
        <TransactionStatus state={state} />
      </div>
    </td>
  );
}
