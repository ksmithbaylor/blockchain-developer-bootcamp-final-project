import { useState, useEffect } from 'react';
import { useBlockNumber, useBlockMeta } from '@usedapp/core';
import { formatDistance } from 'date-fns';
import useInterval from 'react-useinterval';

export function SyncInfo() {
  const [now, setNow] = useState<Date>(new Date());
  const block = useBlockNumber();
  const { timestamp } = useBlockMeta();
  const blockDate = new Date(timestamp);
  const ageMS = now - blockDate;
  const ageSeconds = Math.round(ageMS / 1000);

  useInterval(() => setNow(new Date()), 100);

  return (
    <p>
      Last block was {ageSeconds} seconds ago:{' '}
      <a
        href={`https://ropsten.etherscan.io/block/${block}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {block}
      </a>
    </p>
  );
}
