import { utils } from 'ethers';
import { useToken, useTokenBalance } from '@usedapp/core';
import styled from 'styled-components';
import { EtherscanLink } from './EtherscanLink';
import { useStore } from '../store';
import { abi } from '../eth/contracts';

export function CloneTable() {
  const clones = useStore(store => store.clones);
  const balances = useStore(store => store.balances);

  return (
    <TableContainer>
      <thead>
        <TableRow $noHover>
          <TableHeader>Address</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Symbol</TableHeader>
          <TableHeader>Balance</TableHeader>
        </TableRow>
      </thead>
      <tbody>
        {clones.map(clone => (
          <CloneRow key={clone} address={clone} balance={balances[clone]} />
        ))}
      </tbody>
    </TableContainer>
  );
}

type CloneRowProps = {
  address: string;
  balance: string | undefined;
};

function CloneRow({ address }: CloneRowProps) {
  const account = useStore(store => store.account);
  const tokenInfo = useToken(address);
  const balance = useTokenBalance(address, account);
  const actions = useStore(store => store.actions);

  const handleRowClick = () => {
    alert('clicked ' + address);
  };

  if (!tokenInfo) {
    return null;
  }

  const { name, symbol } = tokenInfo;

  return (
    <TableRow onClick={handleRowClick}>
      <TableCell>
        <EtherscanLink path={`/address/${address}`}>{address}</EtherscanLink>
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{symbol}</TableCell>
      <TableCell>{utils.formatEther(balance)}</TableCell>
    </TableRow>
  );
}

const TableCell = styled.td`
  padding: 0.5em;
  border: none;
`;

const TableRow = styled.tr<{ $noHover: boolean }>`
  cursor: default;

  :hover {
    background-color: ${props =>
      props.$noHover ? 'initial' : 'var(--color-accent-dark)'};
  }
`;

const TableHeader = styled.th`
  font-style: bold;
  text-align: left;
  padding: 0.5em;

  border-top-left-radius: var(--border-radius-large);
  border-top-right-radius: var(--border-radius-large);
  border-bottom: 1px solid var(--color-text-light);

  ${TableCell}:first-child {
    border-top-left-radius: var(--border-radius-large);
  }

  ${TableCell}:last-child {
    border-top-right-radius: var(--border-radius-large);
  }
`;

const TableContainer = styled.table`
  margin-top: 1rem;
  width: 100%;
  border-spacing: 0;
  border: 1px solid var(--color-text-light);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-elevation-high);
  background: var(--color-bg-dark);

  ${TableRow}:last-child {
    border-bottom-left-radius: var(--border-radius-large);
    border-bottom-right-radius: var(--border-radius-large);

    ${TableCell}:first-child {
      border-bottom-left-radius: var(--border-radius-large);
    }

    ${TableCell}:last-child {
      border-bottom-right-radius: var(--border-radius-large);
    }
  }
`;
