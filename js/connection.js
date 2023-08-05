let web3 = new Web3(Web3.givenProvider);
let currentAccount = null;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;
const Trust = window.ethereum;
const truncateHash = hash => {
  return hash.slice(1, 6) + '...' + hash.slice(hash.length - 5);
};

const fetchAccountData = async () => {

  web3 = new Web3(provider);

  // console.log("Web3 instance is", web3);

  const chainId = await web3.eth.getChainId();

  const accounts = await web3.eth.getAccounts();
  currentAccount = accounts[0];
   console.log("console mareo");
  $('#currentAccount').text(currentAccount);
  $('#currentAccount_field').val(currentAccount);
        $('#conectBtn').css('background-color','green');
        $('#conectBtn').css('border-color','green');
        $('#conectBtn').text('Connected');
  localStorage.setItem('current_account', currentAccount);
  // $('#airdrop_wallet').val(currentAccount);
  // $('#mmac_reg_wallet').val(currentAccount);
  // if($('#reg_wallet_1').val() == ''){
  //   $('#reg_wallet_1').val(currentAccount);
  // }
  // $('.btn-connect').text(truncateAddress(currentAccount))

}
const truncateAddress= address => {
  return address.slice(1, 6) + '...' + address.slice(address.length - 5);
};
// const Toast = Swal.mixin({
//   toast: true,
//   position: 'top-end',
//   showConfirmButton: false,
//   timer: 4000,
//   timerProgressBar: true,
//   didOpen: (toast) => {
//     toast.addEventListener('mouseenter', Swal.stopTimer)
//     toast.addEventListener('mouseleave', Swal.resumeTimer)
//   }
// });


$(async () => {
  await localStorage.removeItem('current_account');

  // console.log('providerOption',providerOptions)
 const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: 'https://bsc-dataseed.binance.org/'
        },
         network: 'binance',
        chainId: 56,
        //infuraId: "dc255cb746804c658bcd31cad3d29f23",
      }
    },

    trust: {
      package: Trust,
      options: {
        id: "",
      }
    },
  };

  // console.log('providerOption',providerOptions)

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider:'MetaMask', // optional. For MetaMask / Brave / Opera.
  });
  if(localStorage.getItem('current_account')){
    $('#reg_wallet_1').val(currentAccount);
  }


  if(currentAccount){
    fetchUserInfo();
  }


  // $('#connect_metmask').on('click', function(){
    
  // })
// onConnect();
//connectMetamask();

})
const connectMetamask = () => {
    // console.log('in connect metamask');
  $("#connected_wallet_type").val('Metamask');
  $("#myModal").css('display','none');
    if (typeof window.ethereum !== 'undefined') {
      ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        currentAccount = accounts[0]
        console.log(currentAccount);
        // setAccountBalance();
        // // setMaxSwapAmt();
        //   let str1 = currentAccount.slice(0, 5);
        //   let str2 = currentAccount.slice(38, 42);
        //   let shortAddress = `${str1}...${str2}`;
          localStorage.setItem('current_account', currentAccount);
        //   localStorage.setItem('short_address', shortAddress);
        //   localStorage.setItem('btn_color','#ff1982')
        // $('.token_nav_id').show();
        // $('.acc_no').text(shortAddress);
        // $('.btn-connect').css('background', '#ff1982');
        // $('#ConnectWallet').modal('hide');
        console.log('connectMetamask');
        $('#currentAccount').text(currentAccount);
        $('#currentAccount_field').val(currentAccount);
        $('#conectBtn').css('background-color','green');
        $('#conectBtn').css('border-color','green');
        $('#conectBtn').text('Connected');
        $('#connectedAccountDiv').css('display', 'block');
        $('#connectedAccount').val(currentAccount);
        connectedAccountDiv
        
        //fetchUserInfo()
      })
      .catch(error => {
        console.log('error', error)
      });
    } else {
        console.log('please install metamask');
        alert('Please install metamask');
      return toastr.error('Please install Metamask')
    }
    // setAccountBalance();
    // onChangeAccount();
  };
const connectMetamaskTrust = () => {
//   $("#ConnectWallet").modal('hide');
$("#myModal").css('display','none');
    if (typeof window.ethereum !== 'undefined') {
      ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        currentAccount = accounts[0]
        // setAccountBalance();
        // // setMaxSwapAmt();
        //   let str1 = currentAccount.slice(0, 5);
        //   let str2 = currentAccount.slice(38, 42);
        //   let shortAddress = `${str1}...${str2}`;
          localStorage.setItem('current_account', currentAccount);
        //   localStorage.setItem('short_address', shortAddress);
        //   localStorage.setItem('btn_color','#ff1982')
        // $('.token_nav_id').show();
        // $('.acc_no').text(shortAddress);
        // $('.btn-connect').css('background', '#ff1982');
        // $('#ConnectWallet').modal('hide');
        $("#myModal").css('display','none');
        console.log('connectMetamask');
        $('#currentAccount').text(currentAccount);
        $('#currentAccount_field').val(currentAccount);
        $.ajax({
              url :'https://difi.digiebot.com/staking/profile?address='+currentAccount,
              method: 'GET',
              success: function(resp){
               console.log(resp);
              }
            });
        $('#conectBtn').css('background-color','green');
        $('#conectBtn').css('border-color','green');
        $('#conectBtn').text('Connected');
        
        //fetchUserInfo()
      })
      .catch(error => {
        console.log('error', error)
      });
    } else {
      return toastr.error('Please access browser through Trust Wallet on Android or use WebConnect on iOS')
    }
    // setAccountBalance();
    // onChangeAccount();
  };

const onConnect = async () => {
//   $("#ConnectWallet").modal('hide');
$("#myModal").css('display','none');
   console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
    console.log('provider checking', provider);
  } catch(e) {
     console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    currentAccount = accounts[0];
    console.log(currentAccount);
    let prevAccount = localStorage.getItem('current_account');
    if(currentAccount != prevAccount && prevAccount != null){
      
      localStorage.setItem('current_account', currentAccount); 
  
      $('#currentAccount').text(currentAccount);
      $('#currentAccount_field').val(currentAccount);
        $('#conectBtn').css('background-color','green');
        $('#conectBtn').css('border-color','green');
        $('#conectBtn').text('Connected');
         
    $('#airdrop_wallet').val(currentAccount);
      let str1 = currentAccount.slice(0, 5);
      let str2 = currentAccount.slice(38, 42);
      let shortAddress = `${str1}...${str2}`;
      $('.acc_no').text(shortAddress);
      if($('#reg_wallet_1').val() != currentAccount){
        $('#reg_wallet_2').val(currentAccount);
      }
    }
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  // await refreshAccountData();
  await fetchAccountData();
}

const onChangeAccount = () => {
    if(window.ethereum !== undefined){
      ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          $('.acc_no').text("Connect Wallet");
          $('.btn-connect').css('background', '#3F3D3F');
          localStorage.clear();
          console.log('connectMetamaskchange');
        } else {
          console.log('connectMetamaskchange');
          currentAccount = accounts[0];
          let prevAccount = localStorage.getItem('current_account');
          if(currentAccount != prevAccount && prevAccount != null){
            localStorage.setItem('current_account', currentAccount);
            $('#currentAccount').text(currentAccount);
            $('#currentAccount_field').val(currentAccount);
            $('#conectBtn').css('background-color','green');
            $('#conectBtn').css('border-color','green');
            $('#conectBtn').text('Connected');
            
            let str1 = currentAccount.slice(0, 5);
            let str2 = currentAccount.slice(38, 42);
            let shortAddress = `${str1}...${str2}`;
            $('.acc_no').text(shortAddress);
            if($('#reg_wallet_1').val() != currentAccount){
              $('#reg_wallet_2').val(currentAccount);
            }
          }
          $('#current-account').text(currentAccount);
          setAccountBalance();
          fetchUserInfo();
          // userInfo(currentAccount);
        }
      });
    }
  };
  toastr.options = {
  "debug": false,
  "positionClass": "toast-bottom-full-width",
  "onclick": null,
  "fadeIn": 300,
  "fadeOut": 1000,
  "timeOut": 5000,
  "extendedTimeOut": 1000
}
 const connectBinance = () => {
//   $("#ConnectWallet").modal('hide');
$("#myModal").css('display','none');
    if (typeof window.BinanceChain !== 'undefined') {
      BinanceChain.request({ method: 'eth_accounts' })
      .then(accounts => {
        currentAccount = accounts[0]
        // setAccountBalance();
        // setMaxSwapAmt();
          let str1 = currentAccount.slice(0, 5);
          let str2 = currentAccount.slice(38, 42);
          let shortAddress = `${str1}...${str2}`;
          
          localStorage.setItem('current_account', currentAccount);
          localStorage.setItem('short_address', shortAddress);
          localStorage.setItem('btn_color','#ff1982');
        $('#currentAccount').text(currentAccount);
        $('#currentAccount_field').val(currentAccount);
        $('#conectBtn').css('background-color','green');
        $('#conectBtn').css('border-color','green');
        $('#conectBtn').text('Connected');
        
        $('.token_nav_id').show();
        $('.acc_no').text(shortAddress);
        $('.btn-connect').css('background', '#ff1982');
        // $('#ConnectWallet').modal('hide');
        $('#nft_reg_wallet').val(currentAccount);
      })
      .catch(error => {
        console.log('error', error.message)
      });
    } else {
      return toastr.error('Please install Binance smart chain')
    }
    // setAccountBalance();
  };
function addNetwork(id)
   {
    let networkData;
    switch (id)
   {
      //bsctestnet
      case 97:
        networkData = [
          {
            chainId: "0x61",
            chainName: "BSCTESTNET",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ];
        break;
      //bscmainet
      case 56:
        networkData = [
          {
            chainId: "0x38",
            chainName: "BSCMAINET",
            rpcUrls: ["https://bsc-dataseed1.binance.org"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ];
        break;
      default:
        break;
    }
    // agregar red o cambiar red
    return window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: networkData,
    });
  }
ethereum.on('chainChanged', function (){
  //console.log(net_id);
    web3.eth.getChainId().then(id => {
        console.log(id);
      if(id != 56){
          addNetwork(56)
      }
    })
    });


