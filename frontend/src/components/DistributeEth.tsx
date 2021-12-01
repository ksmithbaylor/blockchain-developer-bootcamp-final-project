import { useContractFunction } from '@usedapp/core';
import { Button } from './Button';
import { TransactionStatus } from './TransactionStatus';
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
      <TransactionStatus state={state} />
    </>
  );
}
