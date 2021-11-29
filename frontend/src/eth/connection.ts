import { providers } from 'ethers';

export async function haveAccounts() {
  const accounts = await getProvider().listAccounts();
  return accounts.length > 0;
}

export function initialize() {
  return window.ethereum.request({ method: 'eth_requestAccounts' });
}

export function getProvider() {
  return new providers.Web3Provider(window.ethereum);
}

export function whichChain() {
  return window.ethereum.request({ method: 'eth_chainId' });
}
