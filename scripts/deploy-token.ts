import { ethers } from 'hardhat';

const tokens = [
  ['Fake USD Coin', 'USDC'],
  ['Fake Tether', 'USDT'],
  ['Fake DAI', 'DAI'],
  ['Fake CRV', 'CRV'],
  ['Fake UNI', 'UNI']
];

async function main() {
  const signers = await ethers.getSigners();
  const primaryWallet = signers[0].address;
  const FakeToken = await ethers.getContractFactory('FakeToken');

  const tokenContracts = [];

  for (const [name, symbol] of tokens) {
    const token = await FakeToken.deploy(
      primaryWallet,
      '1000000000000',
      name,
      symbol
    );
    console.log(symbol, 'deployed to address', token.address);
    tokenContracts.push(token);
  }

  await Promise.all(tokenContracts.map(tc => tc.deployed()));
  console.log('All confirmed.');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
