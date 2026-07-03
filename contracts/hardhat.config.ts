import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const CELOSCAN_API_KEY = process.env.CELOSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    celoSepolia: {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 11142220,
    },
    celoMainnet: {
      url: "https://forno.celo.org",
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 42220,
    },
  },
  etherscan: {
    apiKey: {
      celoSepolia: CELOSCAN_API_KEY,
      celoMainnet: CELOSCAN_API_KEY,
    },
    customChains: [
      {
        network: "celoSepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.celoscan.io/api",
          browserURL: "https://sepolia.celoscan.io",
        },
      },
      {
        network: "celoMainnet",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
    ],
  },
};

export default config;
