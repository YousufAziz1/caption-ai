import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const CELO_MAINNET_CUSD = "0x765de816845861e75a25fca122bb6898b8b1282a";
  const CELO_SEPOLIA_CUSD = "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b";

  let cUSDAddress = "";
  const chainId = network.config.chainId;

  if (chainId === 42220) {
    cUSDAddress = CELO_MAINNET_CUSD;
    console.log("Detected Celo Mainnet. cUSD Address:", cUSDAddress);
  } else if (chainId === 11142220) {
    cUSDAddress = CELO_SEPOLIA_CUSD;
    console.log("Detected Celo Sepolia. cUSD Address:", cUSDAddress);
  } else {
    throw new Error(`Unsupported network chain ID: ${chainId}`);
  }

  // Treasury address (default to deployer, or custom env if set)
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("Treasury address set to:", treasuryAddress);

  // Fee: 0.02 cUSD = 0.02 * 10^18 = 2 * 10^16 = 20000000000000000 wei
  const feeAmount = ethers.parseEther("0.02");
  console.log("Fee amount set to 0.02 cUSD (Wei):", feeAmount.toString());

  const CaptionAIPayment = await ethers.getContractFactory("CaptionAIPayment");
  const contract = await CaptionAIPayment.deploy(cUSDAddress, treasuryAddress, feeAmount);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("CaptionAIPayment deployed successfully to:", contractAddress);
  console.log("To verify, run:");
  console.log(`npx hardhat verify --network ${network.name} ${contractAddress} ${cUSDAddress} ${treasuryAddress} ${feeAmount.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
