import { expect } from 'chai';
import { ethers } from 'hardhat';
import { RevenueToken } from '../typechain';
import {
  sendSmallEthAmount,
  manyRandomWallets,
  randomWallet
} from './util/eth';

describe('RevenueToken', () => {
  const owner = randomWallet();
  let rt: RevenueToken;
  let destinations: string[] = [];

  before(async () => {
    // Deploy the single main contract that clones are created from
    const RevenueToken = await ethers.getContractFactory('RevenueToken');
    rt = await RevenueToken.deploy(owner, ethers.utils.parseUnits('100', 18));
    await rt.deployed();
  });

  beforeEach(async () => {
    destinations = manyRandomWallets(10);

    // Ensure destinations exist already to get a more realistic measure of the
    // gas needed for each operation
    await sendSmallEthAmount(destinations);
  });

  it('works', () => {
    expect(true).to.equal(true);
  });
});
