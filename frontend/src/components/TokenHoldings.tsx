import { utils } from 'ethers';
import { useToken, useTokenBalance, useEtherBalance } from '@usedapp/core';
import styled from 'styled-components';
import { DistributeEth } from './DistributeEth';
import { DistributeToken } from './DistributeToken';
import { EtherscanLink } from './EtherscanLink';
import { CryptoIcon } from './CryptoIcon';
import { TOKENS } from '../eth/contracts';

type Props = {
  clone: string;
};

export function TokenHoldings({ clone }: Props) {
  // It's only okay to use these hooks in a map expression because TOKENS is
  // static and never changes for the lifetime of the page.
  const infos = TOKENS.map(token => useToken(token));
  const balances = TOKENS.map(token => useTokenBalance(token, clone));
  const ethBalance = useEtherBalance(clone);

  return (
    <td>
      <div>
        <DistributeEth clone={clone}>
          <CryptoIcon symbol="ETH" />
          <EtherscanLink path="/">
            <Mono>{'ETH'.padEnd(5)}</Mono>
          </EtherscanLink>{' '}
          {utils.formatEther(ethBalance || '0')}
        </DistributeEth>
      </div>
      {infos.map((info, i) =>
        !info ? null : (
          <div key={info.symbol}>
            <DistributeToken clone={clone} token={TOKENS[i]}>
              <CryptoIcon symbol={info.symbol} />
              <EtherscanLink path={`/address/${TOKENS[i]}`}>
                <Mono>{info.symbol.padEnd(5)}</Mono>
              </EtherscanLink>{' '}
              {utils.formatUnits(balances[i] || '0', info.decimals)}
            </DistributeToken>
          </div>
        )
      )}
    </td>
  );
}

const Mono = styled.pre`
  display: inline-block;
  font-family: var(--font-mono);
`;
