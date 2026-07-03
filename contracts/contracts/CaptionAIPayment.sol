// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as needed by this contract.
 */
interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

/**
 * @title CaptionAIPayment
 * @dev Simple contract to coordinate pay-per-use AI generations via cUSD on Celo.
 * Forwarding all funds immediately to the treasury address to keep the contract zero-custody.
 */
contract CaptionAIPayment {
    address public owner;
    address public treasury;
    address public cUSDToken;
    uint256 public feeAmount;

    event GenerationPaid(
        address indexed user,
        string requestId,
        uint256 amount,
        uint256 timestamp
    );

    event OwnerUpdated(address indexed previousOwner, address indexed newOwner);
    event TreasuryUpdated(address indexed previousTreasury, address indexed newTreasury);
    event FeeAmountUpdated(uint256 previousFee, uint256 newFee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(address _cUSDToken, address _treasury, uint256 _feeAmount) {
        require(_cUSDToken != address(0), "Invalid cUSD address");
        require(_treasury != address(0), "Invalid treasury address");
        owner = msg.sender;
        cUSDToken = _cUSDToken;
        treasury = _treasury;
        feeAmount = _feeAmount;
    }

    /**
     * @notice Pay the fee and log the request ID for off-chain generation verification.
     * @param requestId Unique identifier for the generation request.
     */
    function payAndGenerate(string calldata requestId) external {
        require(bytes(requestId).length > 0, "Request ID cannot be empty");
        
        // Transfer cUSD directly from the user to the treasury
        bool success = IERC20(cUSDToken).transferFrom(msg.sender, treasury, feeAmount);
        require(success, "cUSD transfer failed");

        emit GenerationPaid(msg.sender, requestId, feeAmount, block.timestamp);
    }

    /**
     * @notice Update the fee amount. Only callable by owner.
     * @param _feeAmount The new fee amount (in Wei, 18 decimals).
     */
    function updateFeeAmount(uint256 _feeAmount) external onlyOwner {
        emit FeeAmountUpdated(feeAmount, _feeAmount);
        feeAmount = _feeAmount;
    }

    /**
     * @notice Update the treasury address. Only callable by owner.
     * @param _treasury The new treasury address to receive cUSD.
     */
    function updateTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    /**
     * @notice Transfer contract ownership. Only callable by owner.
     * @param _owner The new owner address.
     */
    function updateOwner(address _owner) external onlyOwner {
        require(_owner != address(0), "Invalid owner address");
        emit OwnerUpdated(owner, _owner);
        owner = _owner;
    }
}
