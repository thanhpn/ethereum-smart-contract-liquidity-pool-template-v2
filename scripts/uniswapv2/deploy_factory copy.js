const hre = require("hardhat");
const { getImplementationAddress } = require("@openzeppelin/upgrades-core");

async function main() {
    //npx hardhat run scripts/uniswapv2/deploy_factory.js --network bsc-testnet
    //npx hardhat verify --network bsc-testnet 0xBbD984be2169d6e9E4c0239Bb8bB4aA33DFB6440 "0x187D9dE4bcb90246E50650Fc5A591E2B35D19AC1"
    const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const implimentationSC = await UniswapV2Factory.deploy("0x187D9dE4bcb90246E50650Fc5A591E2B35D19AC1")
    await implimentationSC.deployed();

    console.log("implimentationSC deployed to:", implimentationSC.address);
    await hre.run("verify:verify", { address: implimentationSC.address });
    console.log("implimentationSC verified to:", implimentationSC.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });