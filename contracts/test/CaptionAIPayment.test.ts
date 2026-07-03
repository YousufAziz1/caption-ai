import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { CaptionAIPayment, MockERC20 } from "../typechain-types";

describe("CaptionAIPayment", () => {
  let paymentContract: any;
  let mockToken: any;
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let user: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  const FEE_AMOUNT = ethers.parseEther("0.02");

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    treasury = signers[1];
    user = signers[2];
    otherAccount = signers[3];

    // Deploy Mock cUSD
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy(ethers.parseEther("1000"));
    await mockToken.waitForDeployment();

    // Deploy Payment Contract
    const CaptionAIPaymentFactory = await ethers.getContractFactory("CaptionAIPayment");
    paymentContract = await CaptionAIPaymentFactory.deploy(
      await mockToken.getAddress(),
      treasury.address,
      FEE_AMOUNT
    );
    await paymentContract.waitForDeployment();

    // Mint tokens to user
    await mockToken.mint(user.address, ethers.parseEther("10"));
  });

  describe("Deployment", () => {
    it("Should set the correct owner, treasury, token, and fee", async () => {
      expect(await paymentContract.owner()).to.equal(owner.address);
      expect(await paymentContract.treasury()).to.equal(treasury.address);
      expect(await paymentContract.cUSDToken()).to.equal(await mockToken.getAddress());
      expect(await paymentContract.feeAmount()).to.equal(FEE_AMOUNT);
    });
  });

  describe("Payments", () => {
    it("Should fail if the user has not approved the fee amount", async () => {
      await expect(
        paymentContract.connect(user).payAndGenerate("request-1")
      ).to.be.revertedWith("Insufficient allowance");
    });

    it("Should transfer cUSD to treasury and emit event on successful payment", async () => {
      const contractAddress = await paymentContract.getAddress();
      
      // Approve fee amount
      await mockToken.connect(user).approve(contractAddress, FEE_AMOUNT);

      const initialUserBalance = await mockToken.balanceOf(user.address);
      const initialTreasuryBalance = await mockToken.balanceOf(treasury.address);

      // Pay
      const requestId = "test-req-123";
      const tx = await paymentContract.connect(user).payAndGenerate(requestId);

      // VerifyBalances
      expect(await mockToken.balanceOf(user.address)).to.equal(initialUserBalance - FEE_AMOUNT);
      expect(await mockToken.balanceOf(treasury.address)).to.equal(initialTreasuryBalance + FEE_AMOUNT);

      // Verify Event
      await expect(tx)
        .to.emit(paymentContract, "GenerationPaid")
        .withArgs(user.address, requestId, FEE_AMOUNT, anyValue => true);
    });
  });

  describe("Owner Controls", () => {
    it("Should allow owner to update fee amount", async () => {
      const newFee = ethers.parseEther("0.05");
      await expect(paymentContract.connect(owner).updateFeeAmount(newFee))
        .to.emit(paymentContract, "FeeAmountUpdated")
        .withArgs(FEE_AMOUNT, newFee);

      expect(await paymentContract.feeAmount()).to.equal(newFee);
    });

    it("Should allow owner to update treasury", async () => {
      await expect(paymentContract.connect(owner).updateTreasury(otherAccount.address))
        .to.emit(paymentContract, "TreasuryUpdated")
        .withArgs(treasury.address, otherAccount.address);

      expect(await paymentContract.treasury()).to.equal(otherAccount.address);
    });

    it("Should allow owner to update owner", async () => {
      await expect(paymentContract.connect(owner).updateOwner(otherAccount.address))
        .to.emit(paymentContract, "OwnerUpdated")
        .withArgs(owner.address, otherAccount.address);

      expect(await paymentContract.owner()).to.equal(otherAccount.address);
    });

    it("Should prevent non-owners from updating values", async () => {
      await expect(
        paymentContract.connect(user).updateFeeAmount(ethers.parseEther("0.01"))
      ).to.be.revertedWith("Caller is not the owner");

      await expect(
        paymentContract.connect(user).updateTreasury(user.address)
      ).to.be.revertedWith("Caller is not the owner");

      await expect(
        paymentContract.connect(user).updateOwner(user.address)
      ).to.be.revertedWith("Caller is not the owner");
    });
  });
});
