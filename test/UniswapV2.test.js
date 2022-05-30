const { expect } = require("chai");
const { ethers, run } = require("hardhat");
// const { getLFW721 } = require('../scripts/helper');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
// const { fromWei } = require('web3-utils');
// const { web3 } = require("@openzeppelin/test-helpers/src/setup");

describe("Uniswap", function () {

    const tokenId = 0;
    const itemSalePrice = 100;
    let deployer = "";
    let minter = "";
    let buyer = "";
    let treasuryAddress = "";
    let feeToSetter;
    let swapper;
    let receiver;
    let staker;

    const TEST_ADDRESSES = [
        '0x1000000000000000000000000000000000000000',
        '0x2000000000000000000000000000000000000000'
    ]

    before(async function () {
        // await run('compile');
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeToSetter = accounts[0];
        minter = accounts[1];
        buyer = accounts[2];
        treasuryAddress = accounts[3];
        swapper = accounts[4];
        receiver = accounts[5];
        staker = accounts[6];


    });

    beforeEach(async function () {

        // WETH
        const WETH = await ethers.getContractFactory("WMATIC");
        this.wrapETH = await WETH.deploy();
        this.wrapETH.deployed();
        console.log("wrapETH deployed to:", this.wrapETH.address);

        // mint erc20 token for swapper
        const Token1 = await ethers.getContractFactory("AnyToken");
        this.token1 = await Token1.deploy();
        this.token1.deployed();
        console.log("Token1 deployed to:", this.token1.address);

        // mint erc20 token for swapper
        const Token2 = await ethers.getContractFactory("AnyToken");
        this.token2 = await Token2.deploy();
        this.token2.deployed();
        console.log("token2 deployed to:", this.token2.address);


        // const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
        // this.imUniswapV2Pair = await UniswapV2Pair.deploy();
        // this.imUniswapV2Pair.deployed();

        this.UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
        this.imUniswapV2Factory = await this.UniswapV2Factory.deploy(feeToSetter.address);
        this.imUniswapV2Factory.deployed();
        const INIT_CODE_PAIR_HASH = await this.imUniswapV2Factory.INIT_CODE_PAIR_HASH();
        console.log("INIT_CODE_PAIR_HASH=", INIT_CODE_PAIR_HASH);
        // await this.imUniswapV2Factory.setFactory(this.imUniswapV2Factory.address);

        const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
        this.imUniswapV2Router02 = await UniswapV2Router02.deploy(this.imUniswapV2Factory.address, this.wrapETH.address);
        this.imUniswapV2Router02.deployed();

        // const instanceTreasury = await upgrades.deployProxy(this.Treasury);
        // this.treasury = await instanceTreasury.deployed();
        // this.lfw721 = await getLFW721();

        // set AnyToken address
        // this.treasury.setAnyTokenAddress(this.AnyToken.address);

        // this.treasury.setTreasury(treasuryAddress.address);
    });

    //https://polygonscan.com/tx/0x9b1a09cf6c58585f77f3c46ff4faf988d8638ef0fb6132edf5f7e3632b0d8db6
    it("Should deploy router, factory, pair and swap", async function () {
        const amountIn = "5000000000000000000";
        const amountInMin = "4975000000000000000";
        let fromTokenAddress = this.token1.address;
        let toTokenAddress = this.token2.address;
        let deadline = 10000000000000;

        await this.token1.connect(deployer).approve(this.imUniswapV2Router02.address, amountIn);
        await this.token2.connect(deployer).approve(this.imUniswapV2Router02.address, amountIn);

        console.log("add liquidity to pool: ");
        await this.imUniswapV2Router02.connect(deployer).addLiquidity(fromTokenAddress, toTokenAddress, amountIn, amountIn, amountInMin, amountInMin, staker.address, deadline);

        let swapAmountIn = "106364683236171907072";
        let swapAmountOutMin = "22701425768846630912";
        let path = [fromTokenAddress, toTokenAddress]; // list of pair token such as: token0 + token 1, token 2+ token3....
        let to = receiver.address;

        // call swapExactTokensForTokens to router. after that router calculate amount in and out, if oke, router will call imUniswapV2Pair
        this.imUniswapV2Router02.swapExactTokensForTokens(swapAmountIn, swapAmountOutMin, path, to, deadline)
    });

    it("Should call router swap", async function () {
        const amountIn = "5000000000000000000";
        const amountInMin = "4975000000000000000";
        let fromTokenAddress = this.token1.address;
        let toTokenAddress = this.token2.address;
        let deadline = 10000000000000;

        await this.token1.connect(deployer).approve(this.imUniswapV2Router02.address, amountIn);
        await this.token2.connect(deployer).approve(this.imUniswapV2Router02.address, amountIn);

        console.log("add liquidity to pool: ");
        await this.imUniswapV2Router02.connect(deployer).addLiquidity(fromTokenAddress, toTokenAddress, amountIn, amountIn, amountInMin, amountInMin, staker.address, deadline);

        let swapAmountIn = "106364683236171907072";
        let swapAmountOutMin = "2270142576884663091";
        let path = [fromTokenAddress, toTokenAddress]; // list of pair token such as: token0 + token 1, token 2+ token3....
        let to = receiver.address;

        await this.token1.connect(deployer).transfer(swapper.address, swapAmountIn);
        await this.token1.connect(swapper).approve(this.imUniswapV2Router02.address, swapAmountIn);

        // call swapExactTokensForTokens to router. after that router calculate amount in and out, if oke, router will call imUniswapV2Pair
        this.imUniswapV2Router02.connect(swapper).swapExactTokensForTokens(swapAmountIn, swapAmountOutMin, path, to, deadline)

        // const usdtBalance = await this.token2.balanceOf(receiver.address);
        // console.log("USDT Balance=", usdtBalance);
    });
});
