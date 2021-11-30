import { Contract, providers } from 'ethers';
import RevenueToken from './RevenueToken.json';

export const PARENT_CONTRACT_ADDRESS =
  '0xe9a663185e456311F5766b9C22065805C6176867';

export function getProvider() {
  return new providers.Web3Provider(window.ethereum);
}

export function getParentContract() {
  return new Contract(PARENT_CONTRACT_ADDRESS, RevenueToken.abi, getProvider());
}

export function getCloneContract(cloneAddress: string) {
  return new Contract(cloneAddress, RevenueToken.abi, getProvider());
}
