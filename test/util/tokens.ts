import hre, { ethers } from 'hardhat';
import { BigNumber, Contract, ContractTransaction } from 'ethers';
import erc20Abi from './erc20-abi.json';
import { sendEth, randomWallet, performAs } from './eth';

export type TokenContract = Contract & {
  // address: string;
  // provider: unknown;
  balanceOf(address: string): Promise<BigNumber>;
  decimals(): Promise<number>;
  transfer(address: string, amount: string): Promise<ContractTransaction>;
  // connect(providerOrSigner: unknown): TokenContract;
};

type TokenDescriptor = {
  currency: string;
  tokenAddress: string;
  whale: string;
};

const mainnetTokens: TokenDescriptor[] = [
  {
    currency: 'USDC',
    tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    whale: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
  },
  {
    currency: 'DAI',
    tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    whale: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
  },
  {
    currency: 'USDT',
    tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    whale: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
  }
];

let deployedTokens: TokenDescriptor[] = [];
let tokenContracts: TokenContract[] = [];

export async function getSupportedTokens() {
  if (tokenContracts.length) {
    return tokenContracts;
  }

  const isMainnet =
    (await ethers.provider.getCode(mainnetTokens[0].tokenAddress)) != '0x';

  if (isMainnet) {
    deployedTokens = mainnetTokens;
  } else {
    // Deploy a fake ERC-20 token to interact with in tests
    const FakeToken = await ethers.getContractFactory('FakeToken');
    const whale = randomWallet();
    const token = await FakeToken.deploy(whale, 1_000_000_000_000);
    await token.deployed();

    deployedTokens = [{ currency: 'FAKE', tokenAddress: token.address, whale }];
  }

  tokenContracts = deployedTokens.map(
    ({ tokenAddress }) =>
      new ethers.Contract(tokenAddress, erc20Abi, ethers.provider)
  ) as unknown as TokenContract[];

  return tokenContracts;
}

export async function sendToken(
  tokenAmount: string,
  token: TokenContract,
  destination: string
) {
  const whale = deployedTokens.find(
    ({ tokenAddress }) => tokenAddress == token.address
  )?.whale;

  if (!whale) {
    throw new Error(`No whale for token ${token.address}`);
  }

  // Send some ETH to the whale to cover transfer
  await sendEth('0.1', whale);

  await performAs(whale, token, async token => {
    await token.transfer(
      destination,
      ethers.utils.parseUnits(tokenAmount, await token.decimals()).toString()
    );
  });
}
