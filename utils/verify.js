//* Utils Folder -1

//* Modularizing auto verification of the contracts on Etherscan.

// Here we are using the same code for auto verification of contracts on Etherscan after deployment as we used in previous lesson. But we're exporting it as well. So that it can be imported in our deploy scripts.

const { run } = require('hardhat'); // importing 'run' from 'hardhat'

const verify = async (contractAddress, args) => {
    console.log('Verifying contract...');
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already verified!');
        } else {
            console.log(e);
        }
    }
};

module.exports = { verify }; //exporting
