import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_feeAmount", "type": "uint256" }],
    "name": "updateFeeAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeAmount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Calling updateFeeAmount with account:", signer.address);

  const CONTRACT_ADDRESS = "0x4C534383A4158fC9C4a712213700ab6D7084343a";
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const currentFee = await contract.feeAmount();
  console.log("Current fee:", ethers.formatEther(currentFee), "cUSD");

  // New fee: 0.01 cUSD
  const newFee = ethers.parseEther("0.01");
  console.log("Setting new fee to:", ethers.formatEther(newFee), "cUSD");

  const tx = await contract.updateFeeAmount(newFee);
  console.log("Tx submitted:", tx.hash);
  await tx.wait();
  console.log("Fee updated successfully!");

  const updatedFee = await contract.feeAmount();
  console.log("New fee confirmed:", ethers.formatEther(updatedFee), "cUSD");
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
