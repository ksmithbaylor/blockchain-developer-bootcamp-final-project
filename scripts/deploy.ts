import { ethers } from 'hardhat';

async function main() {
  const signers = await ethers.getSigners();
  const primaryWallet = signers[0].address;
  const RevenueToken = await ethers.getContractFactory('RevenueToken');
  const rt = await RevenueToken.deploy(
    'Revenue Token Parent',
    'REV',
    primaryWallet
  );
  console.log('Revenue Token Parent deployed to:', rt.address);
  await rt.deployed();
  console.log('Confirmed');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
