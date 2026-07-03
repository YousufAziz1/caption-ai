import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying USDC contract with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const CELO_MAINNET_USDC = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";

  // Treasury address (default to deployer, or custom env if set)
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("Treasury address set to:", treasuryAddress);

  // Fee: 0.01 USDC = 0.01 * 10^6 = 10000 units
  const feeAmount = 10000n; // 10^4 (6 decimals)
  console.log("Fee amount set to 0.01 USDC (6 decimals):", feeAmount.toString());

  const CaptionAIPayment = await ethers.getContractFactory("CaptionAIPayment");
  const contract = await CaptionAIPayment.deploy(CELO_MAINNET_USDC, treasuryAddress, feeAmount);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("CaptionAIPayment USDC contract deployed successfully to:", contractAddress);
  console.log("To verify, run:");
  console.log(`npx hardhat verify --network celoMainnet ${contractAddress} ${CELO_MAINNET_USDC} ${treasuryAddress} ${feeAmount.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
