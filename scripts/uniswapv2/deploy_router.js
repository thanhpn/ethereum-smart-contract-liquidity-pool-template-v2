const hre = require("hardhat");
const { getImplementationAddress } = require("@openzeppelin/upgrades-core");

async function main() {
    //npx hardhat run scripts/uniswapv2/deploy_router.js --network bsc-testnet
    //npx hardhat verify --network bsc-testnet 0x5E5048c4701742949FE0519B1c2bE957d0f7bD39 "0xBbD984be2169d6e9E4c0239Bb8bB4aA33DFB6440" "0x31872b8d018C4897eC28614d3CD765917A659361"
    const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Router02");

    //npx hardhat run scripts/uniswapv2/deploy_router.js --network ftmTestnet
    const Factory = "0x08DCE4a5C2966e54d606D99cC8fDb0A70759Ef9D" //fantom
    const WETH = "0xf1277d1Ed8AD466beddF92ef448A132661956621"//fantom
    //deployed router 0x503576eDB966591728db9aB05815D4c65C365fEB


    // //npx hardhat run scripts/uniswapv2/deploy_router.js --network avalancheFujiTestnet
    // const Factory = "0x08DCE4a5C2966e54d606D99cC8fDb0A70759Ef9D" //fantom
    // const WETH = "0xf1277d1Ed8AD466beddF92ef448A132661956621"//fantom

    // Factory, WETH
    const implimentationSC = await UniswapV2Factory.deploy(Factory, WETH);
    await implimentationSC.deployed();

    // console.log("implimentationSC deployed to:", implimentationSC.address);
    // await hre.run("verify:verify", { address: implimentationSC.address });
    // console.log("implimentationSC verified to:", implimentationSC.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });