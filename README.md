# My audit practice. Hashex Academy. Task 2

#### C1-01. Withraw all deposited tokens by owner (Critical)

**Description:**
Owner can set `rewardToken` equels to `depositToken` by `setRewardToken` function and withdraw all deposited tokens from `FindProblem` contract.

```solidity
function setRewardToken(address _rewardToken) external onlyOwner {
    require(_rewardToken != address(0), "Zero address");
    rewardToken = _rewardToken;
    emit RewardToken(_rewardToken);
}

function withdrawUnclaimedRewards(uint256 amount) external onlyOwner {
    ERC20(rewardToken).transfer(owner, amount);
    }
}

```

**Recommendation:**
Add additional `require` to `setRewardToken` function

```solidity
require(_rewardToken != depositToken, "Reward token equal to deposit token");
```
