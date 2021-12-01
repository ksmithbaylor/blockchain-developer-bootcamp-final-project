import { utils } from 'ethers';
import { useToken, useTokenBalance } from '@usedapp/core';
import styled from 'styled-components';
import { EtherscanLink } from './EtherscanLink';
import { useStore } from '../store';

export function CloneTable() {
  const clones = useStore(store => store.clones);
  const activeClone = useStore(store => store.activeClone);

  if (clones.length === 0) {
    return <p>You are not participating in any revenue tokens!</p>;
  }

  return (
    <>
      <h2>
        Revenue Tokens <Small>(Click to select)</Small>
      </h2>
      <p>You are participating in these revenue tokens:</p>
      <TableContainer>
        <thead>
          <TableRow $noHover>
            <TableHeader>Address</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Symbol</TableHeader>
            <TableHeader>My Share</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {clones.map(clone => (
            <CloneRow
              key={clone}
              address={clone}
              active={clone === activeClone}
            />
          ))}
        </tbody>
      </TableContainer>
    </>
  );
}

type CloneRowProps = {
  address: string;
  active: boolean;
};

function CloneRow({ address, active }: CloneRowProps) {
  const account = useStore(store => store.account);
  const tokenInfo = useToken(address);
  const balance = useTokenBalance(address, account);
  const actions = useStore(store => store.actions);

  const handleRowClick = () => {
    actions.selectClone(address);
  };

  if (!tokenInfo || !balance) {
    return null;
  }

  const { name, symbol } = tokenInfo;

  return (
    <TableRow onClick={handleRowClick} $active={active}>
      <TableCell>
        <EtherscanLink path={`/address/${address}`}>{address}</EtherscanLink>
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{symbol}</TableCell>
      <TableCell>{utils.formatEther(balance) + '%'}</TableCell>
    </TableRow>
  );
}

const TableCell = styled.td`
  padding: 0.5em;
  border: none;
`;

const TableRow = styled.tr<{ $noHover?: boolean; $active?: boolean }>`
  cursor: default;
  background-color: ${props =>
    props.$active ? 'var(--color-bg-light)' : 'var(--color-bg-dark)'};

  :hover {
    background-color: ${props =>
      props.$noHover
        ? 'initial'
        : props.$active
        ? 'var(--color-accent)'
        : 'var(--color-accent-dark)'};
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
  margin-bottom: 2rem;
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

const Small = styled.span`
  font-size: 1rem;
  font-weight: normal;
  display: inline-block;
`;
