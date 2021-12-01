import styled from 'styled-components';
import ETH from 'cryptocurrency-icons/svg/icon/eth.svg';
import USDC from 'cryptocurrency-icons/svg/icon/usdc.svg';
import USDT from 'cryptocurrency-icons/svg/icon/usdt.svg';
import DAI from 'cryptocurrency-icons/svg/icon/dai.svg';
import CRV from 'cryptocurrency-icons/svg/icon/crv.svg';
import UNI from 'cryptocurrency-icons/svg/icon/uni.svg';
import unknownIcon from 'cryptocurrency-icons/svg/black/usd.svg';

const svgs: Record<string, string> = { ETH, USDC, USDT, DAI, CRV, UNI };

type Props = {
  symbol: string;
};

export function CryptoIcon({ symbol }: Props) {
  const svg = svgs[symbol] || unknownIcon;
  return <Icon src={svg} />;
}

const Icon = styled.img`
  display: inline-block;
  height: 24px;
  width: 24px;
  transform: translateY(7px);
  margin-right: 0.5rem;
`;
