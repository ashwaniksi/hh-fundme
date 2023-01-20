//* Mocking - 9

//* Deploying Mocks

// This is '00-deploy-mocks.js' file.

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require('../helper-hardhat-config'); //importing 'developmentChains', INITIAL_ANSWER, DECIMALS

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        log('Local network detected! Deploying Mocks...');
        await deploy('MockV3Aggregator', {
            contract: 'MockV3Aggregator',
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER], // constructor arguments for contract
        });
        log('Mocks deployed !!!');
        log('----------------------------------------------------');
    }

    /* 
    Constructor of MockV3Aggregator:

    constructor(
    uint8 _decimals,       // equitvalent to decimals function.
    int256 _initialAnswer  // What the price feed is starting at.
  ) public {
    decimals = _decimals;
    updateAnswer(_initialAnswer);
  }

  ==> They are set in 'helper-hardhat-config.js' file.

  */
};

module.exports.tags = ['all', 'mocks']; // To only run a deploy script with one of these tags.

// yarn hardhat deploy --tags mocks

/*


Nothing to compile
Local network detected! Deploying Mocks...
deploying "MockV3Aggregator" (tx: 0x2f60bd4cba5dffe33cd22380f4891cfadb7f13aad763bb084e8a1c3336b892f9)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
Mocks deployed !!!
----------------------------------------------------
Done in 3.23s.


*/
