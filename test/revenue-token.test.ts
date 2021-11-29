import chai, { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { RevenueToken } from '../typechain';
import { randomWallet, performAs, sendEth } from './util/eth';
import { getSupportedTokens, sendToken, TokenContract } from './util/tokens';

chai.use(solidity);

describe('RevenueToken', () => {
  let parent: string;
  let owner: string;
  let parentRT: RevenueToken;
  let rt: RevenueToken;
  let supportedTokens: TokenContract[];

  before(async () => {
    const RevenueToken = await ethers.getContractFactory('RevenueToken');
    parent = randomWallet();
    parentRT = await RevenueToken.deploy('Revenue Token Parent', 'REV', parent);
    await parentRT.deployed();
    supportedTokens = await getSupportedTokens();
  });

  beforeEach(async () => {
    owner = randomWallet();
    const cloneTx = await parentRT.clone('My Business', 'BIZ', owner);
    const cloneReceipt = await cloneTx.wait();
    const cloneEvent = cloneReceipt.events?.find(e => e.event == 'Clone');
    const clone = cloneEvent?.args?.cloneAddress;
    rt = parentRT.attach(clone);
  });

  // Make sure the parent contract is never modified by any of the tests, which
  // should be operating on their own clones
  afterEach(async () => {
    expect(await parentRT.participants()).to.have.lengthOf(1);
    expect(await parentRT.isParticipant(parent)).to.equal(true);
    expect(await parentRT.balanceOf(parent)).to.equal(expand('100'));
  });

  it('cannot set clone parameters from any address', async () => {
    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      const setParams = rt.setCloneParameters('oops', 'ohno', randomWallet());
      await expect(setParams).to.be.revertedWith(
        'May only be called from cloning contract'
      );
    });
  });

  it('has a total supply of 100', async () => {
    expect(await rt.totalSupply()).to.equal(expand('100'));
  });

  it('has the right name', async () => {
    expect(await rt.name()).to.equal('My Business');
  });

  it('has the right symbol', async () => {
    expect(await rt.symbol()).to.equal('BIZ');
  });

  it('has a total supply of 100', async () => {
    expect(await rt.totalSupply()).to.equal(expand('100'));
  });

  it('starts off with one participant', async () => {
    expect(await rt.participants()).to.have.lengthOf(1);
    expect(await rt.isParticipant(owner)).to.equal(true);
  });

  it('starts off with the owner having 100%', async () => {
    const ownerBalance = await rt.balanceOf(owner);
    expect(ownerBalance).to.equal(ethers.utils.parseUnits('100', 18));
  });

  it('cannot transfer to a non-participant', async () => {
    const alice = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      const transfer = rt.transfer(alice, ethers.utils.parseUnits('50', 18));
      await expect(transfer).to.be.revertedWith(
        'Argument is not a participant'
      );
    });
  });

  it('can add a participant with no transfer', async () => {
    const alice = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, '0');
    });

    expect(await rt.participants()).to.have.lengthOf(2);
    expect(await rt.isParticipant(owner)).to.equal(true);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.balanceOf(owner)).to.equal(expand('100'));
    expect(await rt.balanceOf(alice)).to.equal('0');
  });

  it('can add a participant and transfer', async () => {
    const alice = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('50'));
    });

    expect(await rt.participants()).to.have.lengthOf(2);
    expect(await rt.isParticipant(owner)).to.equal(true);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.balanceOf(owner)).to.equal(expand('50'));
    expect(await rt.balanceOf(alice)).to.equal(expand('50'));
  });

  it('can add a participant multiple times with no ill effects', async () => {
    const alice = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('1'));
      expect(await rt.participants()).to.have.lengthOf(2);
      await rt.addParticipant(alice, expand('1'));
      expect(await rt.participants()).to.have.lengthOf(2);
    });
  });

  it('cannot forfeit as the only participant', async () => {
    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      const forfeit = rt.forfeit();
      await expect(forfeit).to.be.revertedWith(
        'Cannot forfeit as the only participant'
      );
    });

    expect(await rt.participants()).to.have.lengthOf(1);
    expect(await rt.isParticipant(owner)).to.equal(true);
    expect(await rt.balanceOf(owner)).to.equal(expand('100'));
  });

  it('can forfeit participation to one other', async () => {
    const alice = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('1'));
    });

    expect(await rt.participants()).to.have.lengthOf(2);
    expect(await rt.isParticipant(owner)).to.equal(true);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.balanceOf(owner)).to.equal(expand('99'));
    expect(await rt.balanceOf(alice)).to.equal(expand('1'));

    await performAs(owner, rt, async rt => {
      await rt.forfeit();
    });

    expect(await rt.participants()).to.have.lengthOf(1);
    expect(await rt.isParticipant(owner)).to.equal(false);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.balanceOf(owner)).to.equal('0');
    expect(await rt.balanceOf(alice)).to.equal(expand('100'));
  });

  it('can forfeit participation to several others', async () => {
    const alice = randomWallet();
    const bob = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('60'));
      await rt.addParticipant(bob, expand('20'));
    });

    expect(await rt.participants()).to.have.lengthOf(3);
    expect(await rt.isParticipant(owner)).to.equal(true);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.isParticipant(bob)).to.equal(true);
    expect(await rt.balanceOf(owner)).to.equal(expand('20'));
    expect(await rt.balanceOf(alice)).to.equal(expand('60'));
    expect(await rt.balanceOf(bob)).to.equal(expand('20'));

    await performAs(owner, rt, async rt => {
      await rt.forfeit();
    });

    expect(await rt.participants()).to.have.lengthOf(2);
    expect(await rt.isParticipant(owner)).to.equal(false);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.isParticipant(bob)).to.equal(true);
    expect(await rt.balanceOf(owner)).to.equal('0');
    expect(await rt.balanceOf(alice)).to.equal(expand('75'));
    expect(await rt.balanceOf(bob)).to.equal(expand('25'));
  });

  it('can forward all ETH to one participant', async () => {
    await sendEth('1', rt.address);
    await sendEth('100', owner);

    expect(await ethers.provider.getBalance(rt.address)).to.equal(expand('1'));
    expect(await ethers.provider.getBalance(owner)).to.equal(expand('100'));

    let transactionCost = BigNumber.from(0);

    await performAs(owner, rt, async rt => {
      const tx = await rt.distributeEth();
      const receipt = await tx.wait();
      transactionCost = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    });

    expect(await ethers.provider.getBalance(rt.address)).to.equal(expand('0'));
    expect(
      (await ethers.provider.getBalance(owner)).add(transactionCost)
    ).to.equal(expand('101'));
  });

  it('can forward all ETH to many participants', async () => {
    const alice = randomWallet();
    const bob = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('62'));
      await rt.addParticipant(bob, expand('24'));
    });

    await sendEth('1', rt.address);

    const ownerBalanceBefore = await ethers.provider.getBalance(owner);
    let transactionCost = BigNumber.from(0);

    await performAs(owner, rt, async rt => {
      const tx = await rt.distributeEth();
      const receipt = await tx.wait();
      transactionCost = receipt.gasUsed
        .mul(receipt.effectiveGasPrice)
        .add(BigNumber.from(expand('100')).sub(ownerBalanceBefore));
    });

    expect(await ethers.provider.getBalance(rt.address)).to.equal(expand('0'));
    expect(
      (await ethers.provider.getBalance(owner)).add(transactionCost)
    ).to.equal(expand('100.14'));
    expect(await ethers.provider.getBalance(alice)).to.equal(expand('0.62'));
    expect(await ethers.provider.getBalance(bob)).to.equal(expand('0.24'));
  });

  it('can forward a token to one participant', async () => {
    await sendEth('100', owner);

    for (const token of supportedTokens) {
      const d = await token.decimals();
      await sendToken('100', token, rt.address);

      expect(await token.balanceOf(rt.address)).to.equal(expand('100', d));
      expect(await token.balanceOf(owner)).to.equal(expand('0', d));

      await performAs(owner, rt, async rt => {
        await rt.distributeToken(token.address);
      });

      expect(await token.balanceOf(rt.address)).to.equal(expand('0', d));
      expect(await token.balanceOf(owner)).to.equal(expand('100', d));
    }
  });

  it('can forward a token to many participants', async () => {
    const alice = randomWallet();
    const bob = randomWallet();

    await sendEth('100', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('12'));
      await rt.addParticipant(bob, expand('29'));
    });

    for (const token of supportedTokens) {
      const d = await token.decimals();
      await sendToken('100', token, rt.address);

      expect(await token.balanceOf(rt.address)).to.equal(expand('100', d));
      expect(await token.balanceOf(owner)).to.equal(expand('0', d));
      expect(await token.balanceOf(alice)).to.equal(expand('0', d));
      expect(await token.balanceOf(bob)).to.equal(expand('0', d));

      await performAs(owner, rt, async rt => {
        await rt.distributeToken(token.address);
      });

      expect(await token.balanceOf(rt.address)).to.equal(expand('0', d));
      expect(await token.balanceOf(owner)).to.equal(expand('59', d));
      expect(await token.balanceOf(alice)).to.equal(expand('12', d));
      expect(await token.balanceOf(bob)).to.equal(expand('29', d));
    }
  });
});

function expand(amount: string, decimals: number = 18) {
  return ethers.utils.parseUnits(amount, decimals);
}
