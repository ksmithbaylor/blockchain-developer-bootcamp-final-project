import hre, { ethers } from 'hardhat';
import { Contract } from 'ethers';

export function balance(address: string) {
  return ethers.provider.getBalance(address);
}

export async function sendEth(etherAmount: string, destination: string) {
  const signers = await ethers.getSigners();
  await signers[0].sendTransaction({
    to: destination,
    value: ethers.utils.parseUnits(etherAmount, 'ether').toHexString()
  });
}

export async function sendSmallEthAmount(destinations: string[]) {
  for (const destination of destinations) {
    await sendEth('0.00001', destination);
  }
}

export function randomWallet() {
  const randomBytes = Math.floor(Math.random() * 2 ** 32)
    .toString(16)
    .padStart(8, '0');
  return new ethers.Wallet('0x' + randomBytes).address;
}

export function manyRandomWallets(n: number) {
  return Array.from(new Array(n)).map(_ => randomWallet());
}

export function toWei(etherAmount: string) {
  return ethers.utils.parseEther(etherAmount).toString();
}

export async function totalBalance(addresses: string[]) {
  const balances = await Promise.all(addresses.map(a => balance(a)));
  return balances.reduce((a, b) => a.add(b));
}

export async function performAs<TContract extends Contract>(
  actor: string,
  contract: TContract,
  action: (contract: TContract) => unknown
) {
  // Impersonate the actor
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [actor]
  });

  // Perform the action
  const impersonatedContract = contract.connect(await ethers.getSigner(actor));
  const result = await action(impersonatedContract as TContract);

  // Stop impersonating the actor
  await hre.network.provider.request({
    method: 'hardhat_stopImpersonatingAccount',
    params: [actor]
  });

  return result;
}
