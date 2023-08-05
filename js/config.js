const config = [
    {
        chainId: 56, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
        mainNetUrl: 'https://bsc.blockpi.network/v1/rpc/public',
        // mainNetUrl: 'https://rpc.ankr.com/eth_goerli',
        testNetUrl: 'https://goerli.infura.io/v3/',
        PresaleFactoryAddress : "0xF7b3a900F1248309FF9B3f9650d0B016e7F8BCe2", // Avalanche
        PresaleFactoryAbi : PresaleFactory, //bnb
        ProfitShareAddress: "0x161Bca0e8aaaED678a82e97E70a7b74d8386a5D9",
        ProfitShareAbi: ProfitShare,
        AstroAddress: '0xC58322eb9554e7927C1d08D93FC3aBdB0D3EdAb0', // Avalanche - 0x9d77cceEBDA1De9A6E8517B4b057c1c2F89C8444
        AstroAbi: Astro,
        USDCAddress: '0x55d398326f99059fF775485246999027B3197955', // Avalanche
        USDCAbi: USDC,
    },
    {
        chainId: 1, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
        mainNetUrl: 'https://rpc.ankr.com/eth',
        testNetUrl: 'https://goerli.infura.io/v3/', 
        PresaleFactoryAddress : "0x80d32caa44f99609f542291d1949F6A2a19BD301", // Avalanche
        PresaleFactoryAbi : PresaleFactory1, //bnb
        ProfitShareAddress: "0x161Bca0e8aaaED678a82e97E70a7b74d8386a5D9",
        ProfitShareAbi: ProfitShare,
        AstroAddress: '0xC58322eb9554e7927C1d08D93FC3aBdB0D3EdAb0', // Avalanche - 0x9d77cceEBDA1De9A6E8517B4b057c1c2F89C8444
        AstroAbi: Astro,
        USDCAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Avalanche
        USDCAbi: USDC, 
    },
]
const def_config = {
    REBASE_RATE: 0.0003944,
    DPR: 0.0191,
    APY: 1000.0337,
    SWAP_FEE: 0.053, 
    AUTO_SLIPPAGE: 1,
    DAILY_CLAIM: 1,
    BUY_FEE: 0.15,
    SELL_FEE: 0.3,
    DEF_PRICE: 0.01,
    ASTRO_DIGIT: 2,
    MAX_PRESALE_AMOUNT: 13000000
}
const MaxAmount = 10000000000000;
const MinAmount = 500;
console.log('config============', config);
