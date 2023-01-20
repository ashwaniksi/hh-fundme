//* Testnet Demo

//* Deploying on Rinkeby testnet

// This is '01-deploy-fund-me.js' file.

const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const { network } = require('hardhat');

const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get('MockV3Aggregator');
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
    }
    log(
        '-----------------------------------------------------------------------'
    );

    // Under the networks section in 'hardhat-config.js', and under the 'rinkeby', we must add the number of blocks for confirmation.

    /*
    rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6, // no. of blocks to wait before auto verify
        },
     */

    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
        // if no 'blockConfirmation' is defined, then we will wait for '1' block confirmation.
    });

    // VERIFICATION
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }

    log(
        '-----------------------------------------------------------------------'
    );
};

module.exports.tags = ['all', 'fundme'];

/*

yarn hardhat deploy --network rinkeby

Nothing to compile
-----------------------------------------------------------------------
deploying "FundMe" (tx: 0x838935b12f694cd69d0f01d98a6fd973b206fe22ce387caab8ef03e116ad7e33)...: deployed at 0x447EF2926A7f0efF4AADcf22cA6d979b86044770 with 898438 gas
Verifying contract...
Nothing to compile
Successfully submitted source code for contract
contracts/FundMe.sol:FundMe at 0x447EF2926A7f0efF4AADcf22cA6d979b86044770
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FundMe on Etherscan.
https://rinkeby.etherscan.io/address/0x447EF2926A7f0efF4AADcf22cA6d979b86044770#code
-----------------------------------------------------------------------
Done in 107.11s.

$ yarn hardhat deploy --network goerli

Nothing to compile
-----------------------------------------------------------------------
reusing "FundMe" at 0xbB6FF7F09583256820f2ea5fF229A371Db81D2f6
Verifying contract...
Nothing to compile
Already verified!
-----------------------------------------------------------------------
Done in 12.49s.

*/
