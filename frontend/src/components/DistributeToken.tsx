import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { EtherscanLink } from './EtherscanLink';
import { getCloneContract } from '../eth/contracts';

type Props = {
  clone: string;
  token: string;
  children: React.ReactNode;
};

export function DistributeToken({ clone, token, children }: Props) {
  const cloneContract = getCloneContract(clone);
  const { state, send } = useContractFunction(
    cloneContract,
    'distributeToken',
    {
      transactionName: 'Distribute token'
    }
  );

  const handleDistributeToken = () => {
    send(token);
  };

  return (
    <>
      <Button style={{ marginRight: '1rem' }} onClick={handleDistributeToken}>
        Distribute
      </Button>
      {children}
      {state.status === 'None' || state.status === 'Success' ? null : (
        <span style={{ marginLeft: '2rem' }}>
          {state.status}... (
          <EtherscanLink path={`/tx/${state.transaction?.hash}`} variable>
            Transaction
          </EtherscanLink>
          )
        </span>
      )}
    </>
  );
}
