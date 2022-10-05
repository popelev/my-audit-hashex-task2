// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const Token = await ethers.getContractFactory("Token");
    const depositToken = await Token.deploy();
    const rewardToken = await Token.deploy();

    const Deposit = await ethers.getContractFactory("FindProblemSource");
    const depositContract = await Deposit.deploy(
        feeCollector,
        100,
        depositToken.address,
        rewardToken.address
    );

    await depositToken.deployed();
    await rewardToken.deployed();
    await depositContract.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
