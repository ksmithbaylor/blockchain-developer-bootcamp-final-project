import { EtherscanLink } from './EtherscanLink';

type Props = {
  state: {
    status: string;
    transaction?: {
      hash: string;
    };
  };
};

export function TransactionStatus({ state: { status, transaction } }: Props) {
  return status === 'None' || status === 'Success' ? null : (
    <span style={{ marginLeft: '2rem' }}>
      {status}... (
      <EtherscanLink path={`/tx/${transaction?.hash}`} variable>
        Transaction
      </EtherscanLink>
      )
    </span>
  );
}
