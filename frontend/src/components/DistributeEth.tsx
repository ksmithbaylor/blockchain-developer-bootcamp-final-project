import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { EtherscanLink } from './EtherscanLink';
import { getCloneContract } from '../eth/contracts';

type Props = {
  clone: string;
  children: React.ReactNode;
};

export function DistributeEth({ clone, children }: Props) {
  const cloneContract = getCloneContract(clone);
  const { state, send } = useContractFunction(cloneContract, 'distributeEth', {
    transactionName: 'Distribute ether'
  });

  const handleDistributeEth = () => {
    send();
  };

  return (
    <>
      <Button style={{ marginRight: '1rem' }} onClick={handleDistributeEth}>
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
