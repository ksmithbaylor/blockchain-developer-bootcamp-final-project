import { useState, useEffect } from 'react';
import { useBlockNumber, useBlockMeta } from '@usedapp/core';
import useInterval from 'react-useinterval';
import { EtherscanLink } from './EtherscanLink';

export function SyncInfo() {
  const [now, setNow] = useState<Date>(new Date());
  const block = useBlockNumber();
  const { timestamp } = useBlockMeta();
  const blockDate = timestamp ? new Date(timestamp) : new Date();
  const ageMS = Number(now) - Number(blockDate);
  const ageSeconds = Math.round(ageMS / 1000);

  useInterval(() => setNow(new Date()), 100);

  return (
    <p style={{ marginBottom: '1rem' }}>
      Last block was {ageSeconds} seconds ago:{' '}
      <EtherscanLink path={`/block/${block}`}>{block}</EtherscanLink>
    </p>
  );
}
