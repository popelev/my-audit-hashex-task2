// SPDX-License-Identifier: None
pragma solidity 0.8.15;

// TASK: Find critical problem and fix it in one line ;)

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FindProblemFixed {
    address public owner;
    address private feeCollector;
    uint256 public feeRate;
    address public depositToken;
    address public rewardToken;

    struct Deposit {
        uint256 amount;
        uint256 lastDeposit;
    }

    mapping(address => Deposit) public deposits;

    event Rate(uint256 rate);
    event FeeCollector(address prev, address newCollector);
    event RewardToken(address token);
    event NewDeposit(address to, uint256 amount);
    event Withdraw(address who, uint256 amount);
    event Owner(address oldOwner, address newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier allowedUser() {
        require(deposits[msg.sender].amount > 0, "Not allowed");
        _;
    }

    constructor(
        address _feeCollector,
        uint256 _feeRate,
        address _depositToken,
        address _rewardToken
    ) {
        require(_feeCollector != address(0), "Zero address");
        require(_feeRate < 200, "2% max");
        require(_depositToken != address(0), "Zero address");
        require(_rewardToken != address(0), "Zero address");
        owner = msg.sender;

        feeCollector = _feeCollector;
        feeRate = _feeRate;
        depositToken = _depositToken;
        rewardToken = _rewardToken;

        emit Owner(address(0), msg.sender);
    }

    function setFeeCollector(address _feeCollector) external onlyOwner {
        require(_feeCollector != address(0), "Zero address");
        feeCollector = _feeCollector;
    }

    function setFeeRate(uint256 _rate) external onlyOwner {
        require(_rate < 200, "2% max");
        feeRate = _rate;
        emit Rate(_rate);
    }

    function setRewardToken(address _rewardToken) external onlyOwner {
        require(_rewardToken != address(0), "Zero address");
        require(
            _rewardToken != depositToken,
            "Reward token equal to deposit token"
        );

        rewardToken = _rewardToken;
        emit RewardToken(_rewardToken);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        rewardToken = newOwner;
        emit RewardToken(newOwner);
    }

    function depositRewards(uint256 amount) external {
        ERC20(rewardToken).transferFrom(msg.sender, address(this), amount);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Zero amount");
        require(deposits[msg.sender].amount == 0, "Already deposited");
        deposits[msg.sender].amount += amount;
        deposits[msg.sender].lastDeposit = block.timestamp;
        ERC20(depositToken).transferFrom(msg.sender, address(this), amount);
        emit NewDeposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external allowedUser {
        if (block.timestamp - deposits[msg.sender].lastDeposit < 604800) {
            uint256 feeAmount = (amount * feeRate) / 10000;
            if (feeRate > 0) {
                ERC20(depositToken).transfer(feeCollector, feeAmount);
                amount -= feeAmount;
            }
            ERC20(depositToken).transfer(msg.sender, amount);
            return;
        }

        deposits[msg.sender].amount -= amount;
        deposits[msg.sender].lastDeposit = block.timestamp;

        ERC20(depositToken).transfer(msg.sender, amount);
        rewardTransfer(msg.sender);

        emit Withdraw(msg.sender, amount);
    }

    function withdrawUnclaimedRewards(uint256 amount) external onlyOwner {
        ERC20(rewardToken).transfer(owner, amount);
    }

    function rewardTransfer(address to) internal {
        uint256 rewardBalance = ERC20(rewardToken).balanceOf(address(this));
        if (rewardBalance >= 1e18) {
            ERC20(rewardToken).transfer(to, 1e18);
        }
    }
}
