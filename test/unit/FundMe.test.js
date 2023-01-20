//* Staging tests- 2

// This is './test/unit/FundMe.js' file.

const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');
const { developmentChains } = require('../../helper-hardhat-config'); // importing

// Using a 'ternary' operator here. So 'FundMe' will only run when we're on a developement chain. If we're not on a developement chain, we'll skip the 'describe' block.
!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', function () {
        let fundMe;
        let deployer;
        let mockV3Aggregator;
        const sendValue = ethers.utils.parseEther('1');

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(['all']);

            fundMe = await ethers.getContract('FundMe', deployer);
            mockV3Aggregator = await ethers.getContract(
                'MockV3Aggregator',
                deployer
            );
        });

        describe('constructor', function () {
            it('Sets the aggregator address correctly', async function () {
                const response = await fundMe.getPriceFeed();
                assert.equal(response, mockV3Aggregator.address);
            });
        });

        describe('fund', function () {
            it('Fails if you do not send enough ETH', async function () {
                await expect(fundMe.fund()).to.be.revertedWith(
                    'You need to spend more ETH!'
                );
            });

            it('Updates the amount funded in the Data Structure', async function () {
                await fundMe.fund({ value: sendValue });
                const response = await fundMe.getAddressToAmountFunded(
                    deployer
                ); //updating variable names.
                assert.equal(response.toString(), sendValue.toString());
            });

            it('Adds the funder to array of Funders', async function () {
                await fundMe.fund({ value: sendValue });
                const funder = await fundMe.getFunder(0); //updating variable names.
                assert.equal(funder, deployer);
            });
        });

        describe('withdraw', function () {
            beforeEach(async function () {
                await fundMe.fund({ value: sendValue });
            });

            it('withdraw ETH from a single funder', async function () {
                // Arrange
                const startingFundMeBalance =
                    await fundMe.provider.getBalance(fundMe.address);
                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                // Act
                const transactionResponse = await fundMe.withdraw();
                const transactionReceipt = await transactionResponse.wait(1);

                // GAS CALCULATIONS
                const { gasUsed, effectiveGasPrice } = transactionReceipt;
                const gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                );
                const endingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                //Assert
                assert.equal(endingFundMeBalance, 0);
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                );
            });

            it('withdraw ETH when we have multiple funders', async function () {
                // Arrange
                const accounts = await ethers.getSigners();
                for (i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(
                        accounts[i]
                    );
                    await fundMeConnectedContract.fund({ value: sendValue });
                }

                const startingFundMeBalance =
                    await fundMe.provider.getBalance(fundMe.address);
                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                // Act
                const transactionResponse = await fundMe.withdraw();
                const transactionReceipt = await transactionResponse.wait(1);
                const { gasUsed, effectiveGasPrice } = transactionReceipt;
                const gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                );
                const endingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                // Assert
                assert.equal(endingFundMeBalance, 0);
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                );
                // Make sure that Funders are reser properly
                await expect(fundMe.getFunder(0)).to.be.reverted;
                for (i = 1; i < 6; i++) {
                    assert.equal(
                        await fundMe.getAddressToAmountFunded(
                            accounts[i].address
                        ),
                        0
                    );
                }
            });

            it('Only the owner should be able to withdraw', async function () {
                const accounts = await ethers.getSigners();
                const attacker = accounts[1];

                const attackerConnectedContract = await fundMe.connect(
                    attacker
                );

                await expect(
                    attackerConnectedContract.withdraw()
                ).to.be.reverted;
            });

            // it("Only allows the owner to withdraw", async function () {
            //     const accounts = await ethers.getSigners();
            //     const fundMeConnectedContract = await fundMe.connect(accounts[1]);
            //     await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
            //         "FundMe__NotOwner"
            //     );
            // });

            it('Cheaper withdraw from a single funder testing...', async function () {
                // Arrange
                const startingFundMeBalance =
                    await fundMe.provider.getBalance(fundMe.address);
                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                // Act
                const transactionResponse = await fundMe.cheaperWithdraw();
                const transactionReceipt = await transactionResponse.wait(1);

                // GAS CALCULATIONS
                const { gasUsed, effectiveGasPrice } = transactionReceipt;
                const gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                );
                const endingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                //Assert
                assert.equal(endingFundMeBalance, 0);
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                );
            });

            it('Cheaper withdraw multiple testing...', async function () {
                // Arrange
                const accounts = await ethers.getSigners();
                for (i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(
                        accounts[i]
                    );
                    await fundMeConnectedContract.fund({ value: sendValue });
                }

                const startingFundMeBalance =
                    await fundMe.provider.getBalance(fundMe.address);
                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                // Act
                const transactionResponse = await fundMe.cheaperWithdraw();
                const transactionReceipt = await transactionResponse.wait(1);
                const { gasUsed, effectiveGasPrice } = transactionReceipt;
                const gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                );
                const endingDeployerBalance =
                    await fundMe.provider.getBalance(deployer);

                // Assert
                assert.equal(endingFundMeBalance, 0);
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                );

                await expect(fundMe.getFunder(0)).to.be.reverted;
                for (i = 1; i < 6; i++) {
                    assert.equal(
                        await fundMe.getAddressToAmountFunded(
                            accounts[i].address
                        ),
                        0
                    );
                }
            });
        });
    });

/*
yarn hardhat test

* This will only run unit tests now when we're on development chains.

  FundMe
    constructor
      √ Sets the aggregator address correctly
    fund
      √ Fails if you do not send enough ETH
      √ Updates the amount funded in the data structure
      √ Adds funder to array of funders
    withdraw
      √ withdraw ETH from a single funder
      √ withdraw ETH when we have multiple funders
      √ Only the owner should be able to withdraw
      √ Cheaper withdraw from a single funder testing...
      √ Cheaper withdraw multiple testing...


  9 passing (2s)

Done in 10.06s.


 
 
*/
