const dashboard = [{
    "inputs": [{
        "internalType": "address",
        "name": "_router",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "_pAstro",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "_usdc",
        "type": "address"
    }],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address",
        "name": "_from",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "_astro",
        "type": "uint256"
    }],
    "name": "ClaimASTRO",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address",
        "name": "_from",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "address",
        "name": "_astro",
        "type": "address"
    }],
    "name": "SetASTROAddress",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address",
        "name": "_from",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
    }],
    "name": "SetClaimFee",
    "type": "event"
}, {
    "inputs": [],
    "name": "CLAIM_CAP",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "CLAIM_PERIOD",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "_joe02Router",
    "outputs": [{
        "internalType": "contract IJoeRouter02",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "claimASTRO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
    }],
    "name": "getASTROFromUSDC",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
    }],
    "name": "getUSDCFromASTRO",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "_astro",
        "type": "address"
    }],
    "name": "setASTROAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "_cap",
        "type": "uint256"
    }],
    "name": "setClaimCap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "_time",
        "type": "uint256"
    }],
    "name": "setClaimPeriod",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "userClaimTimes",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}]