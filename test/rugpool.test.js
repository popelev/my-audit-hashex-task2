const {ethers} = require("hardhat");
const {expect} = require("chai");
const {time, loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

describe("Task. Before Fix", async function () {
    let depositContract, depositToken, rewardToken;
    let accounts;
    let owner, feeCollector, user1, user2;
    const chainId = network.config.chainId;

    async function deployAll() {
        // Contracts are deployed using the first signer/account by default
        const [Owner, User1, User2] = await ethers.getSigners();
        owner = Owner;
        feeCollector = owner;
        user1 = User1;
        user2 = User2;

        const Token = await ethers.getContractFactory("Token", owner.address);
        depositToken = await Token.deploy();
        rewardToken = await Token.deploy();

        const Deposit = await ethers.getContractFactory(
            "FindProblemSource",
            owner.address
        );
        depositContract = await Deposit.deploy(
            feeCollector.address,
            100,
            depositToken.address,
            rewardToken.address
        );

        await depositToken.transfer(user1.address, 100);
        await depositToken.transfer(user2.address, 100);

        return {
            depositContract,
            depositToken,
            rewardToken,
            owner,
            user1,
            user2,
        };
    }

    describe("", async () => {
        beforeEach(async () => {
            await loadFixture(deployAll);

            await depositToken
                .connect(user1)
                .approve(depositContract.address, 10e5);

            await depositToken
                .connect(user2)
                .approve(depositContract.address, 10e5);

            await rewardToken
                .connect(user1)
                .approve(depositContract.address, 10e5);

            await rewardToken
                .connect(user2)
                .approve(depositContract.address, 10e5);
        });

        it("Rugpull Availible", async () => {
            await depositContract.connect(user1).deposit(10);
            await depositContract.connect(user2).deposit(10);

            expect(
                await depositToken.balanceOf(depositContract.address)
            ).to.equal(20);

            await depositContract.setRewardToken(depositToken.address);

            let balance = await depositToken.balanceOf(depositContract.address);
            await depositContract.withdrawUnclaimedRewards(balance);

            expect(
                await depositToken.balanceOf(depositContract.address)
            ).to.equal(0);
        });
    });
});
