const hre = require("hardhat");

//npx hardhat run scripts/uniswapv2/upgrade.js --network bsc-testnet
//npx hardhat verify --network bsc-testnet 0x18287191305147666f21171409beb8cb3aadff48
async function main() {
    const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
    const lfw721AddressProduction = "0x2613eBde4589BC78eCa20aF8fE5E6576060F4b30";

    console.log("Upgrading UniswapV2Router02...");
    const iUniswapV2Router02 = await upgrades.upgradeProxy(lfw721AddressProduction, UniswapV2Router02);
    await iUniswapV2Router02.deployed();

    console.log("UniswapV2Router02 upgrade");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });