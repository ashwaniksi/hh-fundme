//* Running scripts on local node -1

// Create a new file in the 'scripts' folder, and name is 'fund.js'

// This is './scripts/fund.js' file.

const { ethers, getNamedAccounts } = require('hardhat'); //importing

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract('FundMe', deployer);
    console.log(`Got contract FundMe at ${fundMe.address}`);

    console.log('Funding contract...');
    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther('0.1'),
    });

    await transactionResponse.wait(1); // waiting 1 block confirmation.
    console.log('Funded!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

/*
* Run a local node in a terminal
yarn hardhat node


* run the script in a new terminal
yarn hardhat run scripts/fund.js --network localhost

Got contract FundMe at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Funding contract...
Funded!
Done in 3.26s.

*/
