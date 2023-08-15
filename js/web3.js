"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

// Web3modal instance
let web3Modal = null;
// Chosen wallet provider given by the dialog window
let provider = null;
// Address of the selected account
let selectedAccount = null;
// chainId
let chainId = 1;
let connected_chainId = null;
// web3
let web3 = null;
// 
let startTime = 0;
let endTime = 0;
let diffTime = 0;
let duration = 0;
// 
let paidBNB = 0;
let paidUSDT = 0;
let balanceBnb = 0;
let balanceUsdt = 0;
//
let ratePerUsdt = "...";
let ratePerBnb = "...";
// 
let bnbPrice = 0;
let ethPrice = 0;


/**
 * Setup the orchestra
 */
async function init() {
    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    if(chainId!=null) {
        // const providerOptions = {
        //     walletconnect: {
        //         package: WalletConnectProvider,
        //         options: {
        //             // Mikko's test key - don't copy as your mileage may vary
        //             infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
        //         }  
        //     },
        // };
    
        $("#customModal").css('display','none');
        // $("#openModalButton").html('Connected');
        
        web3Modal = new Web3Modal({
            cacheProvider: false, // optional
            // providerOptions, // required
            theme: "dark",
        });
    
        
        if(chainId==56)
            web3 = new Web3(config[0].mainNetUrl);
        if(chainId==1)
            web3 = new Web3(config[1].mainNetUrl); 

        try {    

            let result = await getStartPresaleTime();

            if(result.success){
                startTime = result.start_time;
            }
    
            result = await getEndPresaleTime();
            if(result.success){
                endTime = result.end_time;
                console.log('endTime====', result.end_time);
            }
    
            duration = Number(endTime)*1000 - Number(startTime)*1000;
            console.log('diffTime==========', duration);
    
            // presaled amount
            // result = await getUserPaidUSDT();

            // if(result.success){
            //     paidUSDT = result.paid_usdt;
            //     paidBNB = result.paid_bnb;
            //     console.log('usdt==========', paidUSDT);
            // }
            // if(chainId==56){
            //     result = await getBNBprice();
            //     console.log("BNB price result========", result);
            // }
            // // ETH price
            // if(chainId==1){
            //     result = await getETHprice();
            //     console.log("ETH price result========", result);
            // }

             // get rate
            result = await getTokensRates();
             if (result.success) {
                 ratePerBnb = result.pTokensPerBNB;
                 ratePerUsdt = result.pTokensPerUSDT;
            }


            updateUI();
            secondCounter();

        } catch(e) {
            console.log("Could not get a wallet connection", e);
            return;
        }
    }   
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData(provider) {
    // Get a Web3 instance for the wallet
    web3 = new Web3(provider);
    // Get connected chain id from Ethereum node
    connected_chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    console.log("Web3 instance is", connected_chainId);
    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();
    // MetaMask does not give you all accounts, only the selected account
    selectedAccount = accounts[0];
}

async function changeNetwork() {
    console.log("change Network click");
     var indexChainID = $("#toggleValueBtn").val();
    //  console.log('');
     if(indexChainID != null || indexChainID != ''){
         console.log('now its need to be done');
         updateUI();
     }
    if(chainId!=connected_chainId){
        if(chainId==56 || indexChainID==1){
            try {
                let web3 = new Web3(window.ethereum);
        
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: web3.utils.toHex(config[0].chainId) }],
                });
        
                await fetchAccountData(provider);
                await onConnect();
                updateUI();
                // await getBalanceOfAccount();
            }
            catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: web3.utils.toHex(config[0].chainId),
                                    chainName: 'Binance',
                                    rpcUrls: [config[0].mainNetUrl] /* ... */,
                                },
                            ],
                        });
                        return {
                            success: true,
                            message: "switching succeed"
                        }
                    } catch (addError) {
                        return {
                            success: false,
                            message: "Switching failed." + addError.message
                        }
                    }
                }
            }
        }
        if(chainId==1 || indexChainID==2){
            try {
                let web3 = new Web3(window.ethereum);
        
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: web3.utils.toHex(config[1].chainId) }],
                });
        
                await fetchAccountData(provider);
                await onConnect();
                updateUI();
                // await getBalanceOfAccount();
            }
            catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: web3.utils.toHex(config[1].chainId),
                                    chainName: 'Ethereum',
                                    rpcUrls: [config[1].mainNetUrl] /* ... */,
                                },
                            ],
                        });
                        return {
                            success: true,
                            message: "switching succeed"
                        }
                    } catch (addError) {
                        return {
                            success: false,
                            message: "Switching failed." + addError.message
                        }
                    }
                }
            }
        }
    }
}

/**
 * Connect wallet button pressed.
 */
 function openModal(id){
    
     $("#customModal").css("display","block");
 }
async function onConnect() {
    if(chainId==null)
        alert("Select Chain");
    else{
$("#customModal").css("display","none");
$("#openModalButton").css('display','none');
        // first detect if window.ethereum is there
        // render app
        // else
        // detect if mobile device

        // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){

        //     // open the deeplink page 
        //     window.open("https://metamask.app.link/dapp/crm.foodcraving.co.uk/")
            
        //     }
        //else {
            
        //     // install metamask message
            
        //     }
        provider = await web3Modal.connect();
        console.log("chainId =", chainId);
        console.log("connected_chainId =", connected_chainId);
        const accounts = await web3.eth.getAccounts();
        console.log("accounts=", accounts);
        selectedAccount = accounts[0];

        try {
            await fetchAccountData(provider);
            updateUI();
            let result = await getStartPresaleTime();


            if(result.success){
                startTime = result.start_time;

            }
    
            result = await getEndPresaleTime();
            if(result.success){
                endTime = result.end_time;

            }
    
            duration = Number(endTime)*1000 - Number(startTime)*1000;
            console.log('diffTime==========', duration);
    
            // presaled amount
            // result = await getUserPaidUSDT();
            // if(result.success){
            //     paidUSDT = result.paid_usdt;
            //     paidBNB = result.paid_bnb;
            // }
            result = await getBalanceOfAccount()
            if(result.success){
                balanceBnb = result.avaxBalance;
                balanceUsdt = result.usdtBalance;
            }
    
            // get rate
            result = await getTokensRates();
            if (result.success) {
                ratePerBnb = result.pTokensPerBNB;
                ratePerUsdt = result.pTokensPerUSDT;
            }
    
            // BNB price
            // if(chainId==56){
            //     result = await getBNBprice();
            //     console.log("BNB price result========", result);
            // }
            // // ETH price
            // if(chainId==1){
            //     result = await getETHprice();
            //     console.log("ETH price result========", result);
            // }
    
            await fetchAccountData(provider);
            updateUI();
            secondCounter();
        } catch(e) {
            console.log("Could not get a wallet connection", e);
            return;
        }
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData(provider);
        updateUI();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        console.log('chainChanged===', chainId);
        connected_chainId = chainId;
        fetchAccountData(provider);
        updateUI();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
        console.log('networkChanged===', networkId);
        fetchAccountData(provider);
    });
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

    console.log("Killing the wallet connection", provider);

    // TODO: Which providers have close method?
    if(provider.close) {
        await provider.close();

        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        await web3Modal.clearCachedProvider();
        provider = null;
    }

    selectedAccount = null;
    chainId = connected_chainId;
    connected_chainId = null;
    

    // Set the UI back to the initial state

    // document.querySelector("#selectNetwork1").innerHTML = "Select Network";
    // document.querySelector("#selectNetwork2").innerHTML = "Select Network";
  
    
    updateUI();

}

async function getStartPresaleTime() {
    if(chainId==56){
        try {
            const PresaleContract = new web3.eth.Contract(config[0].PresaleFactoryAbi, config[0].PresaleFactoryAddress);
            let start_time = await PresaleContract.methods.startTime().call();
            return {
                success: true,
                start_time
            }
        } catch (error) {
            console.log('[START Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
    if(chainId==1){
        try {
            const PresaleContract = new web3.eth.Contract(config[1].PresaleFactoryAbi, config[1].PresaleFactoryAddress);
            let start_time = await PresaleContract.methods.startTime().call();
            return {
                success: true,
                start_time
            }
        } catch (error) {
            console.log('[START Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
}

async function getEndPresaleTime() {
    if(chainId==56){
        try {
            const PresaleContract = new web3.eth.Contract(config[0].PresaleFactoryAbi, config[0].PresaleFactoryAddress);
            let end_time = await PresaleContract.methods.endTime().call();
            return {
                success: true,
                end_time
            }
        } catch (error) {
            console.log('[END Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
    if(chainId==1){
        try {
            const PresaleContract = new web3.eth.Contract(config[1].PresaleFactoryAbi, config[1].PresaleFactoryAddress);
            let end_time = await PresaleContract.methods.endTime().call();
            return {
                success: true,
                end_time
            }
        } catch (error) {
            console.log('[END Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
}

function showToast(message) {
    // Create a toast container element
    var toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
  
    // Create a toast message element
    var toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';
    toastMessage.textContent = message;
  
    // Append the message to the container
    toastContainer.appendChild(toastMessage);
  
    // Append the container to the document body
    document.body.appendChild(toastContainer);
  
    // Automatically remove the toast after a certain time (e.g., 3 seconds)
    setTimeout(function() {
      document.body.removeChild(toastContainer);
    }, 5000);
  }


async function buy_pToken (type, ref, coinAmount) {
    if(chainId==56){
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) return { success: false }
            const PresaleContract = new web3.eth.Contract(config[0].PresaleFactoryAbi, config[0].PresaleFactoryAddress);
            let decimal = 'ether';
        
            if (type == 0 && ref == null) {
                const UsdcContract = new web3.eth.Contract(config[0].USDCAbi, config[0].USDCAddress);
                const _allowance = await UsdcContract.methods.allowance(accounts[0], config[0].PresaleFactoryAddress).call()
                coinAmount = web3.utils.toWei(coinAmount.toString(),decimal);
                console.log("allowance=", _allowance);
                
                if(Number(_allowance)/10**18 === 0) {
                    console.log("allowance is passed");
                // if(Number(ethers.utils.formatUnits(_allowance, 18)) === 0) {
                    await UsdcContract.methods.approve(config[0].PresaleFactoryAddress, "100000000000000000000000000").send({ from: accounts[0]});  
                }
                
                await PresaleContract.methods.buyTokensByUSDTwithoutReferral(accounts[0],coinAmount).send({ from: accounts[0]});
            }  
            if (type== 1 && ref == null) {
                coinAmount = web3.utils.toWei(coinAmount.toString(), decimal);
                await PresaleContract.methods.buyTokensWithoutReferral().send({ from: accounts[0], value:coinAmount });
            }
        
            if (type == 0 && ref != null) {
                const UsdcContract = new web3.eth.Contract(config[0].USDCAbi, config[0].USDCAddress);
        
                const _allowance = await UsdcContract.methods.allowance(accounts[0], config[0].PresaleFactoryAddress).call()
                    coinAmount = web3.utils.toWei(coinAmount.toString(),decimal);
                // if(Number(ethers.utils.formatUnits(_allowance, 18)) === 0) {
                if(Number(_allowance)/10**18 === 0) {
                    
                    await UsdcContract.methods.approve(config[0].PresaleFactoryAddress, "100000000000000000000000000").send({ from: accounts[0]});  
                }
        
                await PresaleContract.methods.buyTokensByUSDTwithReferral(accounts[0], ref, coinAmount).send({ from: accounts[0]});
            }
            if (type== 1 && ref != null) {
                coinAmount = web3.utils.toWei(coinAmount.toString(), decimal);
                await PresaleContract.methods.buyTokensWithReferral(ref).send({ from: accounts[0], value:coinAmount});
            }

            if (type == 0){

                var raisedAmount = window.localStorage.getItem("raisedAmount");

                raisedAmount = Number(raisedAmount) + Number(coinAmount/10 ** 18);

                window.localStorage.setItem("raisedAmount", raisedAmount);

                insertDB(Number((parseFloat(coinAmount/10**18))));

                // alert("You bought SurfToken successfully.")
                showToast('You bought SurfToken successfully.');

                document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
                
            }
            else if (type == 1){
                let result = await getBNBprice(coinAmount);

                // alert("You bought SurfToken successfully.")
                showToast('You bought SurfToken successfully.');
            }
        
            return {
                success: true
                
            }
        } catch (error) {
                console.log('[BUY Error] = ', error);
            return {
                success: false,
                error: parseErrorMsg(error.message)
            }
        }
    }
    if(chainId==1){
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) return { success: false }
            const PresaleContract = new web3.eth.Contract(config[1].PresaleFactoryAbi, config[1].PresaleFactoryAddress);
            let decimal = 'ether';

        
            if (type == 0 && ref == null) {
                const UsdcContract = new web3.eth.Contract(config[1].USDCAbi, config[1].USDCAddress);
                const _allowance = await UsdcContract.methods.allowance(accounts[0], config[1].PresaleFactoryAddress).call()
                     
                // if(Number(ethers.utils.formatUnits(_allowance, 6)) === 0) {
                if(Number(_allowance)/10**6 === 0) {
                    await UsdcContract.methods.approve(config[1].PresaleFactoryAddress, "10000000000000").send({ from: accounts[0]});  
                }

                
                await PresaleContract.methods.buyTokensByUSDTwithoutReferral(accounts[0],coinAmount * 10 ** 6).send({ from: accounts[0]});
            }  
            if (type== 1 && ref == null) {
                coinAmount = web3.utils.toWei(coinAmount.toString(), decimal);
                await PresaleContract.methods.buyTokensWithoutReferral().send({ from: accounts[0], value:coinAmount });
            }
        
            if (type == 0 && ref != null) {
                const UsdcContract = new web3.eth.Contract(config[1].USDCAbi, config[1].USDCAddress);
        
                const _allowance = await UsdcContract.methods.allowance(accounts[0], config[1].PresaleFactoryAddress).call()
                
                // if(Number(ethers.utils.formatUnits(_allowance, 6)) === 0) {
                if(Number(_allowance)/10**6 === 0) {
                    await UsdcContract.methods.approve(config[1].PresaleFactoryAddress, "10000000000000").send({ from: accounts[0]});  
                }
        
                await PresaleContract.methods.buyTokensByUSDTwithReferral(accounts[0], ref, coinAmount * 10 ** 6).send({ from: accounts[0]});
            }
            if (type== 1 && ref != null) {
                coinAmount = web3.utils.toWei(coinAmount.toString(), decimal);
                await PresaleContract.methods.buyTokensWithReferral(ref).send({ from: accounts[0], value:coinAmount});
            }

            if (type == 0){
                
                var raisedAmount = window.localStorage.getItem("raisedAmount");

                raisedAmount = Number(raisedAmount) + Number(coinAmount);

                window.localStorage.setItem("raisedAmount", raisedAmount);

                insertDB(Number((parseFloat(coinAmount))));
                
                // alert("You bought SurfToken successfully.")
                showToast('You bought SurfToken successfully.');

                document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
                
            }
            else if (type == 1){
                let result = await getETHprice(coinAmount);

                // alert("You bought SurfToken successfully.")
                showToast('You bought SurfToken successfully.');
            
        }
        
            return {  
                success: true  
            }
        } catch (error) {
                console.log('[BUY Error] = ', error);
            return {
                success: false,
                error: parseErrorMsg(error.message)
            }
        }
    }
}

async function getUserPaidUSDT () {
    if(chainId==56){
        try {
            
            const PresaleContract = new web3.eth.Contract(config[0].PresaleFactoryAbi, config[0].PresaleFactoryAddress);
            let paid_usdt = await PresaleContract.methods.Total_USDT_Deposit_Amount().call();
    
            paid_usdt = Math.floor(parseFloat(paid_usdt)/10**18);
        
            let paid_bnb = await PresaleContract.methods.totalDepositedETHBalance().call();
            paid_bnb = Number(Math.floor(parseFloat(paid_bnb)))/10**18;
        
            return {
                success: true,
                paid_usdt,
                paid_bnb
            }
        } catch (error) {
            console.log('[Get Paid Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
    if(chainId==1){
        try {
            
            const PresaleContract = new web3.eth.Contract(config[1].PresaleFactoryAbi, config[1].PresaleFactoryAddress);
            let paid_usdt = await PresaleContract.methods.Total_USDT_Deposit_Amount().call();
    
            paid_usdt = Math.floor(parseFloat(paid_usdt)/10**6);
        
            let paid_bnb = await PresaleContract.methods.totalDepositedETHBalance().call();
            paid_bnb = Math.floor(paid_bnb/10**14)/10**4;
        
            return {
                success: true,
                paid_usdt,
                paid_bnb
            }
        } catch (error) {
            console.log('[Get Paid Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
}

async function getBalanceOfAccount () {
    if(chainId==56){
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) return { success: false }
            let avaxBalance = await web3.eth.getBalance(accounts[0]);
            console.log("rdsavaxBalance=", avaxBalance)
            // avaxBalance = web3.utils.fromWei(avaxBalance);
            avaxBalance = parseFloat(Math.floor(Number(avaxBalance)*10**4)/10**22).toFixed(4);
            const UsdcContract = new web3.eth.Contract(config[0].USDCAbi, config[0].USDCAddress);
            let usdtBalance = await UsdcContract.methods.balanceOf(accounts[0]).call();

            console.log("rdsusdtbalance=", usdtBalance);
            // usdtBalance = web3.utils.fromWei(usdtBalance);
            usdtBalance = parseFloat(Math.floor(Number(usdtBalance)*10**4)/10**22).toFixed(4);
            
            return {
                success: true,
                avaxBalance,
                usdtBalance,
                // astroBalance
            }
        } catch (error) {
            console.log('[Get Balance] = ', error);
            return {
                success: false,
                result: "Something went wrong: "
            }
        }
    }
    if(chainId==1){
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) return { success: false }
            let avaxBalance = await web3.eth.getBalance(accounts[0]);
            // avaxBalance = web3.utils.fromWei(avaxBalance);
            console.log("balance=", avaxBalance);
            avaxBalance = parseFloat(Math.floor(Number(avaxBalance)*10**4)/10**22).toFixed(4);

            const UsdcContract = new web3.eth.Contract(config[1].USDCAbi, config[1].USDCAddress);
            let usdtBalance = await UsdcContract.methods.balanceOf(accounts[0]).call();
            console.log("usdt balance",usdtBalance )
            usdtBalance = parseFloat(Math.floor(Number(usdtBalance)*10**1)/10**7).toFixed(4);
            
            return {
                success: true,
                avaxBalance,
                usdtBalance,
                // astroBalance
            }
        } catch (error) {
            console.log('[Get Balance] = ', error);
            return {
                success: false,
                result: "Something went wrong: "
            }
        }
    }
}

async function getTokensRates () {
    if(chainId==56){
        try {
            
            const PresaleContract = new web3.eth.Contract(config[0].PresaleFactoryAbi, config[0].PresaleFactoryAddress);
            let pTokensPerBNB = await PresaleContract.methods.tokensPerETH().call();
            let pTokensPerUSDT = await PresaleContract.methods.tokensPerUSDT().call();
        
            pTokensPerBNB = pTokensPerBNB;
            pTokensPerUSDT = pTokensPerUSDT;
        
            return {
                success: true,
                pTokensPerBNB,
                pTokensPerUSDT
            }
        } catch (error) {
            console.log('[Rate Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
    if(chainId==1){
        try {
            
            const PresaleContract = new web3.eth.Contract(config[1].PresaleFactoryAbi, config[1].PresaleFactoryAddress);
            let pTokensPerBNB = await PresaleContract.methods.tokensPerETH().call();
            let pTokensPerUSDT = await PresaleContract.methods.tokensPerUSDT().call();
        
            pTokensPerBNB = pTokensPerBNB;
            pTokensPerUSDT = Number(pTokensPerUSDT)/10**12;
        
            return {
                success: true,
                pTokensPerBNB,
                pTokensPerUSDT
            }
        } catch (error) {
            console.log('[Rate Error] = ', error);
            return {
                success: false,
                result: "Something went wrong "
            }
        }
    }
}


function loadDB(){

    var dbData;
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "../db.php", true);
    ajax.send();
    ajax.onreadystatechange = function() {
         if (ajax.readyState == 4 && ajax.status == 200) {
           var data = ajax.responseText;
           dbData=data;
           window.localStorage.setItem("raisedAmount", dbData);

           //Deal with the response
        }
    }
}

function insertDB(Amount){

    var dbData;
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "../insert.php", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    

    var data = {amount:Amount};
    ajax.send(JSON.stringify(data));
    console.log("rdsrds", data);

    ajax.onreadystatechange = function() {
         if (ajax.readyState == 4 && ajax.status == 200) {
            var response = ajax.responseText;
            console.log("rdssuccesed")
           //Deal with the response
        }
    }
}

function secondCounter() {

    var date = Date.now();
    
    diffTime = Number(endTime) * 1000 - date;
    
    let day = Math.floor(parseFloat(diffTime)/1000/60/60/24);

    if(day > 99)
        day = 99;

    var date = new Date(diffTime);

    date = date.toUTCString();

    var date = new Date(date);

    console.log("date = ", date.getDate());
        
    document.querySelector("#day1").innerHTML = ("00" + (date.getDate() - 1)).slice(-2);
    // document.querySelector("#day2").innerHTML = ("00" + (date.getDate() - 1)).slice(-2);

    document.querySelector("#hour1").innerHTML = ("00" + date.getHours()).slice(-2);
    // document.querySelector("#hour2").innerHTML = ("00" + (date.getHours()- 1)).slice(-2);

    document.querySelector("#min1").innerHTML = ("00" + date.getMinutes()).slice(-2);
    // document.querySelector("#min2").innerHTML = ("00" + date.getMinutes()).slice(-2);

    document.querySelector("#sec1").innerHTML = ("00" + date.getSeconds()).slice(-2);
    // document.querySelector("#sec2").innerHTML = ("00" + date.getSeconds()).slice(-2);
    
    // progress bar
    const elem1 = document.getElementById('progressbar_1');
    // const elem2 = document.getElementById('progressbar_2');

    let temp;

    if (diffTime > 0){
        temp = (100 -  Number(diffTime) / Number(duration) * 100) + '%';
    }
    else
        temp = "100%";
    
    elem1.style.width = temp;

    if(diffTime <=0 ){


        document.querySelector("#day1").innerHTML = "00";
        // document.querySelector("#day2").innerHTML = "00";

        document.querySelector("#hour1").innerHTML = "00";
        // document.querySelector("#hour2").innerHTML = "00";

        document.querySelector("#min1").innerHTML = "00";
        // document.querySelector("#min2").innerHTML = "00";

        document.querySelector("#sec1").innerHTML = "00";
        // document.querySelector("#sec2").innerHTML = "00";
        
    }     
    
    setTimeout(secondCounter, 1000);
}

async function getBNBprice (coinAmount) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.binance.com/api/v3/klines?symbol=BNBUSDC&interval=1h&limit=1');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const temp = JSON.parse(xhr.responseText);
            bnbPrice = temp[0][3];
            // document.querySelector("#raisedAmountBnb").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;
            // document.querySelector("#raisedAmountUsdt").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;

            var raisedAmount = window.localStorage.getItem("raisedAmount");

            raisedAmount = Number(raisedAmount) + Number((parseFloat(coinAmount/10**18)*parseFloat(bnbPrice)));

            window.localStorage.setItem("raisedAmount", raisedAmount);

            insertDB(Number((parseFloat(coinAmount/10**18)*parseFloat(bnbPrice))));

            console.log("inserted db");

            document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            
            
            
        } else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    }; 
    xhr.send();
};

async function getETHprice (coinAmount) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.binance.com/api/v3/klines?symbol=ETHUSDC&interval=1h&limit=1');
    xhr.onload = function() {

        if (xhr.status === 200) {
            const temp = JSON.parse(xhr.responseText);
            ethPrice = temp[0][3];

            // document.querySelector("#raisedAmountBnb").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;
            // document.querySelector("#raisedAmountUsdt").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;
  
            var raisedAmount = window.localStorage.getItem("raisedAmount");

            raisedAmount = Number(raisedAmount) + Number((parseFloat(coinAmount/10**18)*parseFloat(ethPrice)));

            window.localStorage.setItem("raisedAmount", raisedAmount);
 
            insertDB(Number((parseFloat(coinAmount/10**18)*parseFloat(ethPrice))));
  
            document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            
        } else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
};

function switchTheNetwork() {

    document.querySelector("#myDropdown1").classList.toggle("enabl");
    document.querySelector("#myDropdown2").classList.toggle("enabl");
}

async function selectChain(index) {
    if(index==1){
        $("#toggleValueBtn").val(index);
        console.log('ethereum');
        chainId=56;
        document.querySelector("#selectNetwork1").innerHTML = "Binance Smart Chain (BSC)";
        document.querySelector("#selectNetwork2").innerHTML = "Binance Smart Chain (BSC)";

        document.querySelector("#tokenLogo1").style.backgroundImage = "url('./images/icon/bsc.png')";
        console.log('change BNB logo here');
        document.querySelector("#tokenLogo2").src  = "./images/icon/bsc.png";
        document.querySelector(".bnb-usd-bg").style.backgroundImage = "url('./images/icon/bsc.png')";
        
        document.querySelector("#tokenLogo1").innerHTML="BNB"
        // document.querySelector("#symbolLabel").innerHTML = "BNB";
    }
    if(index==2){
      $("#toggleValueBtn").val(index);
        console.log('BNB');
        chainId=1;
        document.querySelector("#selectNetwork1").innerHTML = "Ethereum Blockchain";
        document.querySelector("#selectNetwork2").innerHTML = "Ethereum Blockchain";

        document.querySelector("#tokenLogo1").style.backgroundImage = "url('./images/icon/ethereum-logo.svg')";
        document.querySelector(".bnb-usd-bg").style.backgroundImage =   "url('./images/icon/ethereum-logo.svg')";
   
        document.querySelector("#tokenLogo1").innerHTML="ETH"

        document.querySelector("#tokenLogo2").src = "./images/icon/ethereum-logo.svg";

        // document.querySelector("#symbolLabel").innerHTML = "ETH";
    }
    
    await init();
    loadDB();
    updateUI();
}

function updateUI() {
    var change = $("#toggleValueBtn").val();
    console.log("change for coin"+change);
    document.querySelector("#connect-btn1").addEventListener("click", function() {
        openModal('1');
    });
    
    document.querySelector("#connect-btn2").addEventListener("click", function() {
        openModal('2');
    });

    // document.querySelector("#connect-btn1").addEventListener("click", openModal);
    document.querySelector("#disconnect-btn1").addEventListener("click", onDisconnect);
    document.querySelector("#switch-btn1").addEventListener("click", changeNetwork);

    // document.querySelector("#connect-btn2").addEventListener("click", openModal);
    document.querySelector("#disconnect-btn2").addEventListener("click", onDisconnect);
    document.querySelector("#switch-btn2").addEventListener("click", changeNetwork);

    document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));

    if(connected_chainId==null){
        document.querySelector("#disconnect-btn1").style.display = "none";
        document.querySelector("#connect-btn1").style.display = "block";
        document.querySelector("#switch-btn1").style.display = "none";

        document.querySelector("#disconnect-btn2").style.display = "none";
        document.querySelector("#connect-btn2").style.display = "block";
        document.querySelector("#switch-btn2").style.display = "none";

        document.querySelector("#balance-info-label1").style.display = "none";
        document.querySelector("#referral-info-label1").style.display = "none";
        document.querySelector("#referral-info-label2").style.display = "none";
        document.querySelector("#referral-info-label3").style.display = "none";
        document.querySelector("#referral-info-label4").style.display = "none";
        document.querySelector("#balance-info-element1").style.display = "none";
        document.querySelector("#balance-info-label2").style.display = "none";
        document.querySelector("#balance-info-element2").style.display = "none";

        // document.querySelector("#ratePerUSDT").innerHTML = ratePerUsdt;
        // document.querySelector("#ratePerBNB").innerHTML = ratePerBnb;

        
    }
    else{
        console.log("web3 js file");
        console.log("update UI");
        console.log("connected_chainId",connected_chainId);

        if(chainId != connected_chainId){
            console.log("web3js chainId != connected_chainId condition");
            document.querySelector("#connect-btn1").style.display = "none";
            // document.querySelector("#connect-btn12").style.display = "block";
            document.querySelector("#disconnect-btn1").style.display = "none";
            document.querySelector("#switch-btn1").style.display = "block";
    
            document.querySelector("#connect-btn2").style.display = "none";
            document.querySelector("#disconnect-btn2").style.display = "none";
            document.querySelector("#switch-btn2").style.display = "block";
    
            document.querySelector("#balance-info-label1").style.display = "none";
            document.querySelector("#balance-info-element1").style.display = "none";
            document.querySelector("#balance-info-label2").style.display = "none";
            document.querySelector("#balance-info-element2").style.display = "none";
            
            document.querySelector("#referral-info-label2").style.display = "none";
            document.querySelector("#referral-info-label1").style.display = "none";
                        
            document.querySelector("#referral-info-label3").style.display = "none";
            document.querySelector("#referral-info-label4").style.display = "none";
            

            // document.querySelector("#ratePerUSDT").innerHTML = ratePerUsdt;
            // document.querySelector("#ratePerBNB").innerHTML = ratePerBnb;
        }
        else{
            if(chainId==config[0].chainId){
                console.log("web3js BSC condition");
                document.querySelector("#connect-btn1").style.display = "none";
                // document.querySelector("#connect-btn12").style.display = "none";
                document.querySelector("#disconnect-btn1").style.display = "block";
                document.querySelector("#disconnect-btn1").innerHTML = selectedAccount.slice(0, 5)+"..."+selectedAccount.slice(34);
                document.querySelector("#switch-btn1").style.display = "none";
        
                document.querySelector("#connect-btn2").style.display = "none";
                document.querySelector("#disconnect-btn2").style.display = "block";
                document.querySelector("#disconnect-btn2").innerHTML = selectedAccount.slice(0, 5)+"..."+selectedAccount.slice(34);
                document.querySelector("#switch-btn2").style.display = "none";
        
                document.querySelector("#balance-info-label1").style.display = "block";
                document.querySelector("#balance-info-element1").style.display = "flex";
                document.querySelector("#balance-info-label2").style.display = "block";
                document.querySelector("#balance-info-element2").style.display = "flex";

                document.querySelector("#referral-info-label1").style.display = "flex";
                document.querySelector("#referral-info-label2").style.display = "flex";
                document.querySelector("#referral-info-label3").style.display = "flex";
                document.querySelector("#referral-info-label4").style.display = "flex";
        
                // document.querySelector("#raisedAmountBnb").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;
                // document.querySelector("#raisedAmountUsdt").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;

                document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
            document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
        
                document.querySelector("#balanceUsdt").innerHTML = balanceUsdt;
                document.querySelector("#balanceBnb").innerHTML = balanceBnb;
        
                // document.querySelector("#ratePerUSDT").innerHTML = ratePerUsdt;
                // document.querySelector("#ratePerBNB").innerHTML = ratePerBnb;
            
                document.querySelector("#tokenLogo1").style.backgroundImage = "url('./images/icon/bsc.png')";
                document.querySelector("#tokenLogo2").src  = "./images/icon/bsc.png";

                // document.querySelector("#symbolLabel").innerHTML = "BNB";
                document.querySelector("#symbolwalletLabel1").innerHTML =  "Your BNB Amount&nbsp;&nbsp;:&nbsp;&nbsp;";
                document.querySelector("#symbolwalletLabel2").innerHTML = "BNB";
        
                document.querySelector("#referUrl1").value = "https://surfreward.io/?ref="+selectedAccount;
                document.querySelector("#referUrl2").value = "https://surfreward.io/?ref="+selectedAccount;
            }
            if(chainId==config[1].chainId){
                console.log("web3js ethereum condition");
                document.querySelector("#connect-btn1").style.display = "none";
                // document.querySelector("#connect-btn12").style.display = "block";
                document.querySelector("#disconnect-btn1").style.display = "block";
                document.querySelector("#disconnect-btn1").innerHTML = selectedAccount.slice(0, 5)+"..."+selectedAccount.slice(34);
                document.querySelector("#switch-btn1").style.display = "none";
        
                document.querySelector("#connect-btn2").style.display = "none";
                document.querySelector("#disconnect-btn2").style.display = "block";
                document.querySelector("#disconnect-btn2").innerHTML = selectedAccount.slice(0, 5)+"..."+selectedAccount.slice(34);
                document.querySelector("#switch-btn2").style.display = "none";
        
                document.querySelector("#balance-info-label1").style.display = "block";
                document.querySelector("#balance-info-element1").style.display = "flex";
                document.querySelector("#balance-info-label2").style.display = "block";
                document.querySelector("#balance-info-element2").style.display = "flex";

                document.querySelector("#referral-info-label1").style.display = "block";
                document.querySelector("#referral-info-label2").style.display = "block";
                document.querySelector("#referral-info-label3").style.display = "block";
                document.querySelector("#referral-info-label4").style.display = "block";
        
                // document.querySelector("#raisedAmountBnb").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;
                // document.querySelector("#raisedAmountUsdt").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;

                document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
                document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
        
                document.querySelector("#balanceUsdt").innerHTML = balanceUsdt;
                document.querySelector("#balanceBnb").innerHTML = balanceBnb;
        
                // document.querySelector("#ratePerUSDT").innerHTML = ratePerUsdt;
                // document.querySelector("#ratePerBNB").innerHTML = ratePerBnb;
    
                document.querySelector("#tokenLogo1").style.backgroundImage = "url('./images/icon/ethereum-logo.svg')";
                document.querySelector("#tokenLogo2").src = "./images/icon/ethereum-logo.svg";

                // document.querySelector("#symbolLabel").innerHTML = "ETH";
                document.querySelector("#symbolwalletLabel1").innerHTML = "Your ETH Amount&nbsp;&nbsp;:&nbsp;&nbsp;";
                document.querySelector("#symbolwalletLabel2").innerHTML = "ETH";
        
                document.querySelector("#referUrl1").value = "https://surfreward.io/?ref="+selectedAccount;
                document.querySelector("#referUrl2").value = "https://surfreward.io/?ref="+selectedAccount;
            }
            
            
            if(change === 1){
                var selectedAccAddress = $("#connected_account_address").val();
                
                console.log('web3js inside change for 1'+selectedAccAddress);
                document.querySelector("#connect-btn1").style.display = "none";
                // document.querySelector("#connect-btn12").style.display = "block";
                document.querySelector("#disconnect-btn1").style.display = "block";
                document.querySelector("#disconnect-btn1").innerHTML = selectedAccAddress.slice(0, 5)+"..."+selectedAccAddress.slice(34);
                document.querySelector("#switch-btn1").style.display = "none";
        
                document.querySelector("#connect-btn2").style.display = "none";
                document.querySelector("#disconnect-btn2").style.display = "block";
                document.querySelector("#disconnect-btn2").innerHTML = selectedAccAddress.slice(0, 5)+"..."+selectedAccAddress.slice(34);
                document.querySelector("#switch-btn2").style.display = "none";
        
                document.querySelector("#balance-info-label1").style.display = "block";
                document.querySelector("#balance-info-element1").style.display = "flex";
                document.querySelector("#balance-info-label2").style.display = "block";
                document.querySelector("#balance-info-element2").style.display = "flex";

                document.querySelector("#referral-info-label1").style.display = "block";
                document.querySelector("#referral-info-label2").style.display = "block";
                document.querySelector("#referral-info-label3").style.display = "block";
                document.querySelector("#referral-info-label4").style.display = "block";
        
                document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
                document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
        
                document.querySelector("#balanceUsdt").innerHTML = balanceUsdt;
                document.querySelector("#balanceBnb").innerHTML = balanceBnb;
    
                document.querySelector("#tokenLogo1").style.backgroundImage = "url('./images/icon/ethereum-logo.svg')";
                document.querySelector("#tokenLogo2").src = "./images/icon/ethereum-logo.svg";

                document.querySelector("#symbolwalletLabel1").innerHTML = "Your ETH Amount&nbsp;&nbsp;:&nbsp;&nbsp;";
                document.querySelector("#symbolwalletLabel2").innerHTML = "ETH";
        
                document.querySelector("#referUrl1").value = "https://surfreward.io/?ref="+selectedAccAddress;
                document.querySelector("#referUrl2").value = "https://surfreward.io/?ref="+selectedAccAddress;
            }else if(change === 2){
                var selectedAccAddress = $("#connected_account_address").val();
                
                console.log('web3js inside change for 2'+selectedAccAddress);
                      console.log("web3js ethereum condition");
                document.querySelector("#connect-btn1").style.display = "none";
                // document.querySelector("#connect-btn12").style.display = "block";
                document.querySelector("#disconnect-btn1").style.display = "block";
                document.querySelector("#disconnect-btn1").innerHTML = selectedAccount.slice(0, 5)+"..."+selectedAccount.slice(34);
                document.querySelector("#switch-btn1").style.display = "none";
        
                document.querySelector("#connect-btn2").style.display = "none";
                document.querySelector("#disconnect-btn2").style.display = "block";
                document.querySelector("#disconnect-btn2").innerHTML = selectedAccount.slice(0, 5)+"..."+selectedAccount.slice(34);
                document.querySelector("#switch-btn2").style.display = "none";
        
                document.querySelector("#balance-info-label1").style.display = "block";
                document.querySelector("#balance-info-element1").style.display = "flex";
                document.querySelector("#balance-info-label2").style.display = "block";
                document.querySelector("#balance-info-element2").style.display = "flex";

                document.querySelector("#referral-info-label1").style.display = "block";
                document.querySelector("#referral-info-label2").style.display = "block";
                document.querySelector("#referral-info-label3").style.display = "block";
                document.querySelector("#referral-info-label4").style.display = "block";
        
                // document.querySelector("#raisedAmountBnb").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;
                // document.querySelector("#raisedAmountUsdt").innerHTML = Math.floor((parseFloat(paidBNB)*parseFloat(bnbPrice)+parseFloat(paidUSDT))*100)/100;

                document.querySelector("#raisedAmountBnb").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
                document.querySelector("#raisedAmountUsdt").innerHTML = new Intl.NumberFormat('en-US').format(Number(window.localStorage.getItem("raisedAmount")).toFixed(2));
        
                document.querySelector("#balanceUsdt").innerHTML = balanceUsdt;
                document.querySelector("#balanceBnb").innerHTML = balanceBnb;
        
                // document.querySelector("#ratePerUSDT").innerHTML = ratePerUsdt;
                // document.querySelector("#ratePerBNB").innerHTML = ratePerBnb;
    
                document.querySelector("#tokenLogo1").style.backgroundImage = "url('./images/icon/ethereum-logo.svg')";
                document.querySelector("#tokenLogo2").src = "./images/icon/ethereum-logo.svg";

                // document.querySelector("#symbolLabel").innerHTML = "ETH";
                document.querySelector("#symbolwalletLabel1").innerHTML = "Your ETH Amount&nbsp;&nbsp;:&nbsp;&nbsp;";
                document.querySelector("#symbolwalletLabel2").innerHTML = "ETH";
        
                document.querySelector("#referUrl1").value = "https://surfreward.io/?ref="+selectedAccount;
                document.querySelector("#referUrl2").value = "https://surfreward.io/?ref="+selectedAccount;
            }
        }
    }
    

}
/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
    // updateUI();
    loadDB();
    await init();

    const token1 = document.querySelector("#token1");
    const token2 = document.querySelector("#token2");

    const usdt = document.querySelector("#usdt");
    const bnb = document.querySelector("#bnb");

    // input onchange
    const regex = /^[+]?\d*\.?\d*$/;

    token1.addEventListener('input', ()=>{
        if (token1.value == "" || token1.value == undefined)
            usdt.value  = 0;
        else 
            usdt.value = Number(parseFloat(token1.value)/parseFloat(ratePerUsdt)).toFixed(18);
    });

    token1.addEventListener('input', () => {
        
        const inputValue = token1.value.trim();
        if (!regex.test(inputValue)) {
            token1.value = '';
        }
        
    });

    token2.addEventListener('input', ()=>{
        
        if (token2.value == "" || token2.value == undefined)
            bnb.value  = 0;
        else 
            bnb.value = Number(parseFloat(token2.value)/parseFloat(ratePerBnb)).toFixed(18);
            
    });
    token2.addEventListener('input', () => {
        
        const inputValue = token2.value.trim();
        if (!regex.test(inputValue)) {
            token2.value = '';
        }
    });

    usdt.addEventListener('input', ()=>{
        console.log('OnChange===', usdt.value);

        if (usdt.value == "" || usdt.value == undefined)
            token1.value  = 0;
        else
            token1.value = parseFloat(usdt.value)*parseFloat(ratePerUsdt);
    });
    usdt.addEventListener('input', () => {
        const inputValue = usdt.value.trim();
        if (!regex.test(inputValue)) {
            usdt.value = '';
        }
    });
    
    bnb.addEventListener('input', ()=>{

        if (bnb.value == "" || bnb.value == undefined)
            token2.value  = 0;
        else
            token2.value = parseFloat(bnb.value)*parseFloat(ratePerBnb);

    });
    bnb.addEventListener('input', () => {
        const inputValue = bnb.value.trim();
        if (!regex.test(inputValue)) {
            bnb.value = '';
        }
    });

    
  

    // on Buy
    const buyByUSDT = document.querySelector("#buyByUSDT");
    const buyByBNB = document.querySelector("#buyByBNB");

    buyByUSDT.addEventListener('click', async ()=>{
        
        if(token1.value!="" && usdt.value!=""){
            const urlParams = new URLSearchParams(window.location.search);
            const ref = urlParams.get('ref');

            try {
                const result = await buy_pToken(0, ref, parseFloat(usdt.value));
                if (result.success) {
                    console.log('buy_pToken success');
                } else {
                    console.log('buy_pToken failed');
                }
            } catch (error) {
                console.log("Transaction has been failed. " + error);
            }
        }
    });
    buyByBNB.addEventListener('click', async ()=>{
        console.log(token2.value);
        if(token2.value!="" && bnb.value!=""){
            const urlParams = new URLSearchParams(window.location.search);
            const ref = urlParams.get('ref');

            try {
                const result = await buy_pToken(1, ref, parseFloat(bnb.value));
                if (result.success) {
                    console.log('buy_pToken success');
                } else {
                    console.log('buy_pToken failed');
                }
            } catch (error) {
                console.log("Transaction has been failed. " + error);
            }
        }
    });

    // on copy
    const copyBtn1 = document.querySelector("#copy1");
    const copyBtn2 = document.querySelector("#copy2");

    const referUrl1 = document.querySelector("#referUrl1");
    const referUrl2 = document.querySelector("#referUrl2");

    copyBtn1.addEventListener('click', ()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        
        referUrl1.select();
        document.execCommand("copy");
    });
    copyBtn2.addEventListener('click', ()=>{

        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');

        referUrl2.select();
        document.execCommand("copy");
    });

    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('enabl')) {
                openDropdown.classList.remove('enabl');
                }
            }
        }
    }
});



