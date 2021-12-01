import { Contract, providers } from 'ethers';
import { getTokenTransactions } from './etherscan';
import RevenueToken from './RevenueToken.json';

export const PARENT_CONTRACT_ADDRESS =
  '0xabC044CfC1730768b8b8b1Ce83B4d97EFc5B0942';

export const CLONE_BYTECODE =
  '0x363d3d373d3d3d363d73' +
  PARENT_CONTRACT_ADDRESS.replace('0x', '').toLowerCase() +
  '5af43d82803e903d91602b57fd5bf3';

export const abi = RevenueToken.abi;

export function getProvider() {
  return new providers.Web3Provider(window.ethereum);
}

export function getParentContract() {
  return new Contract(PARENT_CONTRACT_ADDRESS, RevenueToken.abi, getProvider());
}

export function getCloneContract(cloneAddress: string) {
  return new Contract(cloneAddress, RevenueToken.abi, getProvider());
}

export async function tokensFor(account: string) {
  const transactions = await getTokenTransactions(account);

  const tokenAddresses = new Set<string>();
  for (const tx of transactions) {
    if (tx.to.toLowerCase() === account.toLowerCase()) {
      tokenAddresses.add(tx.contractAddress);
    }
  }

  return [...tokenAddresses];
}

export async function clonesFor(account: string) {
  const tokens = await tokensFor(account);
  const provider = getProvider();
  const bytecodes = await Promise.all(
    tokens.map(token => provider.getCode(token))
  );

  const clones = [];
  for (let i = 0; i < tokens.length; i++) {
    if (bytecodes[i].toLowerCase() === CLONE_BYTECODE.toLowerCase()) {
      clones.push(tokens[i]);
    }
  }

  return clones;
}
