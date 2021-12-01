import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { EtherscanLink } from './EtherscanLink';
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
        <Button onClick={handleForfeit}>Forfeit</Button>{' '}
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
