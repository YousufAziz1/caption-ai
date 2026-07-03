import { ethers } from "hardhat";

async function main() {
  const cUSDContract = "0x4C534383A4158fC9C4a712213700ab6D7084343a";
  const USDCContract = "0xf22e90Cc5E2198c2ad1e6a0edF620245a6b6fe13";

  const ABI = [
    "function treasury() view returns (address)",
    "function owner() view returns (address)",
    "function feeAmount() view returns (uint256)"
  ];

  try {
    const contract = new ethers.Contract(cUSDContract, ABI, ethers.provider);
    const treasury = await contract.treasury();
    const owner = await contract.owner();
    const fee = await contract.feeAmount();
    console.log("--- cUSD Payment Contract (Mainnet) ---");
    console.log("Treasury Wallet (Where funds go):", treasury);
    console.log("Owner Wallet:", owner);
    console.log("Fee amount:", ethers.formatEther(fee), "cUSD");
  } catch (e) {
    console.error("Error checking cUSD contract:", e);
  }

  try {
    const contract = new ethers.Contract(USDCContract, ABI, ethers.provider);
    const treasury = await contract.treasury();
    const owner = await contract.owner();
    const fee = await contract.feeAmount();
    console.log("--- USDC Payment Contract (Mainnet) ---");
    console.log("Treasury Wallet (Where funds go):", treasury);
    console.log("Owner Wallet:", owner);
    console.log("Fee amount (USDC decimals=6):", (Number(fee) / 1000000).toString(), "USDC");
  } catch (e) {
    console.error("Error checking USDC contract:", e);
  }
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
