//* Running scripts on local node -2 - withdraw script

// Create a new file in the 'scripts' folder, and name is 'withdraw.js'

// This is './scripts/withdraw.js' file.

const { ethers, getNamedAccounts } = require('hardhat');

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract('FundMe', deployer);
    console.log(`Got contract FundMe at ${fundMe.address}`);

    console.log('Withdrawing from contract...');
    const transactionResponse = await fundMe.withdraw(); //withdrawing.
    await transactionResponse.wait(1);

    console.log('Got it back!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

/*
* Make sure the local node is already running in a separate terminal.

* run the script in a new terminal
yarn hardhat run scripts/withdraw.js --network localhost

Got contract FundMe at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Withdrawing from contract...
Got it back!
Done in 3.33s.

*/
