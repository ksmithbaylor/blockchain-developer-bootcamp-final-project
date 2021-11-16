import chai, { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { RevenueToken } from '../typechain';
import { randomWallet, performAs, sendEth } from './util/eth';

chai.use(solidity);

describe('RevenueToken', () => {
  let owner: string;
  let rt: RevenueToken;

  beforeEach(async () => {
    const RevenueToken = await ethers.getContractFactory('RevenueToken');
    owner = randomWallet();
    rt = await RevenueToken.deploy(owner);
    await rt.deployed();
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
    await sendEth('1', owner);
    await performAs(owner, rt, async rt => {
      const transfer = rt.transfer(alice, ethers.utils.parseUnits('50', 18));
      await expect(transfer).to.be.revertedWith(
        'Argument is not a participant'
      );
    });
  });

  it('can add a participant with no transfer', async () => {
    const alice = randomWallet();

    await sendEth('1', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, '0');
    });

    expect(await rt.participants()).to.have.lengthOf(2);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.balanceOf(alice)).to.equal('0');
    expect(await rt.balanceOf(owner)).to.equal(expand('100'));
  });

  it('can add a participant and transfer', async () => {
    const alice = randomWallet();

    await sendEth('1', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('50'));
    });

    expect(await rt.participants()).to.have.lengthOf(2);
    expect(await rt.isParticipant(alice)).to.equal(true);
    expect(await rt.balanceOf(alice)).to.equal(expand('50'));
    expect(await rt.balanceOf(owner)).to.equal(expand('50'));
  });

  it('cannot forfeit as the only participant', async () => {
    await sendEth('1', owner);

    await performAs(owner, rt, async rt => {
      const forfeit = rt.forfeit();
      await expect(forfeit).to.be.revertedWith(
        'Cannot forfeit as the only participant'
      );
    });
  });

  it('can forfeit participation to one other', async () => {
    const alice = randomWallet();

    await sendEth('1', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('1'));
    });

    expect(await rt.participants()).to.have.lengthOf(2);

    await performAs(owner, rt, async rt => {
      await rt.forfeit();
    });

    expect(await rt.participants()).to.have.lengthOf(1);
    expect(await rt.isParticipant(owner)).to.equal(false);
    expect(await rt.balanceOf(owner)).to.equal('0');
    expect(await rt.balanceOf(alice)).to.equal(expand('100'));
  });

  it('can forfeit participation to several others', async () => {
    const alice = randomWallet();
    const bob = randomWallet();

    await sendEth('1', owner);

    await performAs(owner, rt, async rt => {
      await rt.addParticipant(alice, expand('60'));
      await rt.addParticipant(bob, expand('20'));
    });

    expect(await rt.participants()).to.have.lengthOf(3);

    await performAs(owner, rt, async rt => {
      await rt.forfeit();
    });

    expect(await rt.participants()).to.have.lengthOf(2);
    expect(await rt.isParticipant(owner)).to.equal(false);
    expect(await rt.balanceOf(owner)).to.equal('0');
    expect(await rt.balanceOf(alice)).to.equal(expand('75'));
    expect(await rt.balanceOf(bob)).to.equal(expand('25'));
  });
});

function expand(amount: string) {
  return ethers.utils.parseUnits(amount, 18);
}
