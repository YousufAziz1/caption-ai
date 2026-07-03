import { ethers } from "hardhat";

const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_treasury", "type": "address" }],
    "name": "updateTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Calling updateTreasury with account (Owner):", signer.address);

  const cUSDContract = "0x4C534383A4158fC9C4a712213700ab6D7084343a";
  const USDCContract = "0xf22e90Cc5E2198c2ad1e6a0edF620245a6b6fe13";
  const newTreasury = "0x1d017C971f32f8Ae87E7cCe8e31d90dEc2dd46C6";

  console.log("Setting new treasury to:", newTreasury);

  // 1. Update cUSD Contract
  console.log("\n--- Updating cUSD Contract ---");
  const cUSDInstance = new ethers.Contract(cUSDContract, CONTRACT_ABI, signer);
  const currentCUSD = await cUSDInstance.treasury();
  console.log("Current cUSD Treasury:", currentCUSD);
  if (currentCUSD.toLowerCase() !== newTreasury.toLowerCase()) {
    const tx = await cUSDInstance.updateTreasury(newTreasury);
    console.log("Tx submitted:", tx.hash);
    await tx.wait();
    console.log("cUSD Treasury updated successfully!");
  } else {
    console.log("cUSD Treasury is already set to the new address.");
  }

  // 2. Update USDC Contract
  console.log("\n--- Updating USDC Contract ---");
  const USDCInstance = new ethers.Contract(USDCContract, CONTRACT_ABI, signer);
  const currentUSDC = await USDCInstance.treasury();
  console.log("Current USDC Treasury:", currentUSDC);
  if (currentUSDC.toLowerCase() !== newTreasury.toLowerCase()) {
    const tx = await USDCInstance.updateTreasury(newTreasury);
    console.log("Tx submitted:", tx.hash);
    await tx.wait();
    console.log("USDC Treasury updated successfully!");
  } else {
    console.log("USDC Treasury is already set to the new address.");
  }

  console.log("\nAll updates complete!");
  const confirmedCUSD = await cUSDInstance.treasury();
  const confirmedUSDC = await USDCInstance.treasury();
  console.log("Confirmed cUSD Treasury:", confirmedCUSD);
  console.log("Confirmed USDC Treasury:", confirmedUSDC);
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
