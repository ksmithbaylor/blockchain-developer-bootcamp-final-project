import { utils } from 'ethers';
import { useToken, useTokenBalance } from '@usedapp/core';
import styled from 'styled-components';
import { EtherscanLink } from './EtherscanLink';
import { TOKENS } from '../eth/contracts';

type Props = {
  clone: string;
};

export function TokenHoldings({ clone }: Props) {
  // It's only okay to use these hooks in a map expression because TOKENS is
  // static and never changes for the lifetime of the page.
  const infos = TOKENS.map(token => useToken(token));
  const balances = TOKENS.map(token => useTokenBalance(token, clone));

  return (
    <td>
      {infos.map((info, i) =>
        !info ? null : (
          <div>
            <EtherscanLink path={`/address/${TOKENS[i]}`}>
              <Mono>{info.symbol.padEnd(5)}</Mono>
            </EtherscanLink>{' '}
            {utils.formatUnits(balances[i] || '0', info.decimals)}
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
