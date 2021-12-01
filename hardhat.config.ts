import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-docgen';
import * as dotenv from 'dotenv';

dotenv.config();

const hdWallet = {
  mnemonic: process.env.MNEMONIC || '',
  count: 10
};

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999
      }
    }
  },
  networks: {
    hardhat: {
      accounts: hdWallet,
      forking:
        process.env.FORKED_MAINNET === 'true'
          ? { url: process.env.HOMESTEAD_URL || '', blockNumber: 13575389 }
          : undefined
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: hdWallet
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD'
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true
  }
};

export default config;
