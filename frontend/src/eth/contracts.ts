import { Contract, providers } from 'ethers';
import { getTokenTransactions } from './etherscan';
import RevenueToken from './RevenueToken.json';

export const PARENT_CONTRACT_ADDRESS =
  '0xabC044CfC1730768b8b8b1Ce83B4d97EFc5B0942';

export const CLONE_BYTECODE =
  '0x363d3d373d3d3d363d73' +
  PARENT_CONTRACT_ADDRESS.replace('0x', '').toLowerCase() +
  '5af43d82803e903d91602b57fd5bf3';

export const TOKENS = [
  '0x19a455aD4Ea219834f1A1E60bCf1889FeEfc6181',
  '0x3C0f667532A9AE5D573eB5099556105bb9329c43',
  '0x5972D5569060287A8B39a0f73B474AADA445d0A3',
  '0xdEf39AFf18bB8bcaD1845637d32cBc8609667873',
  '0xc6eb4b20C06AF75580F65BA39ce482906f4EE943'
];

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
