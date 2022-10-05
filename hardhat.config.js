require("@nomicfoundation/hardhat-toolbox");
require("solidity-docgen");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",

    solidity: {compilers: [{version: "0.8.15"}]},
    namedAccounts: {
        owner: {
            default: 0,
            owner: 0,
        },
        user1: {
            default: 1,
            user1: 1,
        },
        user2: {
            default: 2,
            user2: 2,
        },
    },
};
