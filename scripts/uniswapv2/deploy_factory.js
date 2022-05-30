const hre = require("hardhat");
const { getImplementationAddress } = require("@openzeppelin/upgrades-core");

async function main() {
    //npx hardhat run scripts/uniswapv2/deploy_factory.js --network bsc-testnet
    //npx hardhat verify --network bsc-testnet 0xBbD984be2169d6e9E4c0239Bb8bB4aA33DFB6440 "0x187D9dE4bcb90246E50650Fc5A591E2B35D19AC1"


    // Fantom
    //npx hardhat run scripts/uniswapv2/deploy_factory.js --network ftmTestnet
    //npx hardhat verify --network ftmTestnet 0x07283E6d1Cea7E8F8e98a637Bab574fd07a34bAB "0x187D9dE4bcb90246E50650Fc5A591E2B35D19AC1"
    // INIT_CODE_PAIR_HASH=0x9ffddf09ccfd47b30be400245472aa0039a20ad1934ea4bee5ada41e0b8a6aa4

    const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const implimentationSC = await UniswapV2Factory.deploy("0x187D9dE4bcb90246E50650Fc5A591E2B35D19AC1")
    await implimentationSC.deployed();

    const INIT_CODE_PAIR_HASH = await implimentationSC.INIT_CODE_PAIR_HASH();
    console.log("INIT_CODE_PAIR_HASH:", INIT_CODE_PAIR_HASH);

    // console.log("implimentationSC deployed to:", implimentationSC.address);
    // await hre.run("verify:verify", {
    //     address: implimentationSC.address, constructorArguments: [
    //         "0x187D9dE4bcb90246E50650Fc5A591E2B35D19AC1"
    //     ],
    // });
    // console.log("implimentationSC verified to:", implimentationSC.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });