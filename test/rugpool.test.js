const {ethers} = require("hardhat");
const {expect} = require("chai");
const {time, loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

describe("Task. Befor Fix", async function () {
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
                .approve(depositContract.address, 10e10);

            await depositToken
                .connect(user2)
                .approve(depositContract.address, 10e10);

            await rewardToken
                .connect(user1)
                .approve(depositContract.address, 10e10);

            await rewardToken
                .connect(user2)
                .approve(depositContract.address, 10e10);
        });

        it("text", async () => {
            expect(1).to.equal(1);
        });
    });
});
