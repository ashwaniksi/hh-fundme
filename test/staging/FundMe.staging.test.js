//* Staging tests- 1

// This is './test/staging/FundMe.staging.test.js' file.

// This is the test that we run on the test net. It is only done once our unit testing is complete.

// create a new file in the './test/staging/' folder and name it 'FundMe.staging.test.js'.

const { assert } = require('chai');
const { network, ethers, getNamedAccounts } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

// We'll skip the describe block if we're on a development chain. Using a 'ternary' operator here. So 'FundMe Staging Tests' will only run when we're on a testnet. Go to 'unit' test and add the same thing with a '!' before the describe block. So that unit test will only run in case we're on a 'development chains'
developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe Staging Tests', async function () {
        let deployer;
        let fundMe;
        const sendValue = ethers.utils.parseEther('0.1');
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            fundMe = await ethers.getContract('FundMe', deployer);
        });

        //! No fixtures needed.
        //We're not going to deploy 'fundMe' because we're assuming it is already deployed.
        // We also don't need mocks, as on testnet data feeds are available.

        it('allows people to fund and withdraw', async function () {
            await fundMe.fund({ value: sendValue });
            await fundMe.withdraw();

            const endingBalance = await fundMe.provider.getBalance(
                fundMe.address
            );

            assert.equal(endingBalance.toString(), '0');
        });
    });

/*

* Deploying on the Rinkeby testnet:
yarn hardhat deploy --network rinkeby


deploying "FundMe" (tx: 0x7e7f951b4b9f6d443f2aa538b8e85cb645fcb4b512bf1e46c097e2f437f97cee)...: deployed at 0x71B4F30c4AdC182a81aaf123e91279Ab70453A9c with 1094385 gas
Verifying contract...
Nothing to compile
Successfully submitted source code for contract
contracts/FundMe.sol:FundMe at 0x71B4F30c4AdC182a81aaf123e91279Ab70453A9c
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FundMe on Etherscan.
https://rinkeby.etherscan.io/address/0x71B4F30c4AdC182a81aaf123e91279Ab70453A9c#code
-----------------------------------------------------------------------
Done in 589.40s.

--------------------------------------------------------------


* Running tests on Rinkeby testnet:
yarn hardhat test --network rinkeby

yarn hardhat test --network goerli
yarn run v1.22.15
warning package.json: No license field


  FundMe Staging Tests
    ✓ allows people to fund and withdraw (6057540 gas)


  1 passing (6m)

Done in 376.20s.

*/
