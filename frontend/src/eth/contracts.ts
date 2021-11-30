import { Contract, providers, utils } from 'ethers';
import { getTokenTransactions } from './etherscan';
import RevenueToken from './RevenueToken.json';

export const PARENT_CONTRACT_ADDRESS =
  '0xe9a663185e456311f5766b9c22065805c6176867';

export const CLONE_BYTECODE =
  '0x363d3d373d3d3d363d73' +
  PARENT_CONTRACT_ADDRESS.replace('0x', '') +
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
    if (bytecodes[i] === CLONE_BYTECODE) {
      clones.push(tokens[i]);
    }
  }

  return clones;
}

export async function balancesFor(clones: string[], account: string) {
  const balances = await Promise.all(
    clones.map(clone => getCloneContract(clone).balanceOf(account))
  );
  return clones.reduce(
    (bals, clone, i) => ({
      ...bals,
      [clone]: utils.formatEther(balances[i])
    }),
    {}
  );
}
