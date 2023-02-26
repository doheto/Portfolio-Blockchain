module.exports = {
    factoryAddress: "0x793f9e746f73779475ede99d2f693bd3123f2ce1",
    factoryABI:
        [
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "percentageTime100",
                        "type": "uint256"
                    },
                    {
                        "name": "feePerAutodistribution",
                        "type": "uint256"
                    }
                ],
                "name": "setServiceFeePercentage",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "the",
                        "type": "string"
                    },
                    {
                        "name": "mail",
                        "type": "bytes32"
                    },
                    {
                        "name": "managers",
                        "type": "address[4]"
                    },
                    {
                        "name": "totalPoolValue",
                        "type": "uint256"
                    },
                    {
                        "name": "minAmountPerContributor",
                        "type": "uint256"
                    },
                    {
                        "name": "maxAmountPerContributor",
                        "type": "uint256"
                    },
                    {
                        "name": "isWhiteList",
                        "type": "bool"
                    },
                    {
                        "name": "destinationAddress",
                        "type": "address"
                    },
                    {
                        "name": "dataField",
                        "type": "bytes"
                    },
                    {
                        "name": "allfees",
                        "type": "uint256[4]"
                    }
                ],
                "name": "create",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "feePerAutodistrib",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "serviceFeePercentage",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [

                ],
                "name": "renounceOwnership",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "owner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "isOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "mail",
                        "type": "bytes32"
                    },
                    {
                        "name": "adr",
                        "type": "address"
                    }
                ],
                "name": "verifyUser",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "adrs",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "mail",
                        "type": "bytes32"
                    }
                ],
                "name": "NewUserMail",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "the",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "name": "newAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "managers",
                        "type": "address[4]"
                    },
                    {
                        "indexed": false,
                        "name": "totalPoolValue",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "allfees",
                        "type": "uint256[4]"
                    },
                    {
                        "indexed": false,
                        "name": "minAmountPerContributor",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "maxAmountPerContributor",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "destinationAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "dataField",
                        "type": "bytes"
                    },
                    {
                        "indexed": false,
                        "name": "isWhitelist",
                        "type": "bool"
                    }
                ],
                "name": "ContractCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "newAddress",
                        "type": "address"
                    }
                ],
                "name": "FactoryCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "feePercentage",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "feePerSending",
                        "type": "uint256"
                    }
                ],
                "name": "ServiceFeePercentageAndFeePerSending",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            }
        ],
    poolABI:
        [
            {
                "constant": true,
                "inputs": [

                ],
                "name": "TotalCurrentValue",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "sig",
                        "type": "bytes"
                    }
                ],
                "name": "alloweddeposit",
                "outputs": [

                ],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdraw",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "TotalPoolValueIn",
                        "type": "uint256"
                    },
                    {
                        "name": "MinAmountPerContributorIn",
                        "type": "uint256"
                    },
                    {
                        "name": "MaxAmountPerContributorIn",
                        "type": "uint256"
                    }
                ],
                "name": "set",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "statew",
                        "type": "bool"
                    },
                    {
                        "name": "si",
                        "type": "string"
                    }
                ],
                "name": "setw",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "contractAddress",
                        "type": "address"
                    }
                ],
                "name": "confirmTokens",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "get",
                "outputs": [
                    {
                        "name": "feesp",
                        "type": "uint256[4]"
                    },
                    {
                        "name": "MinAmountPerContributorp",
                        "type": "uint256"
                    },
                    {
                        "name": "MaxAmountPerContributorp",
                        "type": "uint256"
                    },
                    {
                        "name": "ContributorArrayp",
                        "type": "address[]"
                    },
                    {
                        "name": "DestinationAddressp",
                        "type": "address"
                    },
                    {
                        "name": "DataFieldp",
                        "type": "bytes"
                    },
                    {
                        "name": "statep",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [

                ],
                "name": "fautodistribute",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "payToAddress",
                        "type": "address"
                    }
                ],
                "name": "payTo",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [

                ],
                "name": "deposit",
                "outputs": [

                ],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "TotalPoolValue",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "Contributors",
                "outputs": [
                    {
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "name": "valueRefundWithdrawn",
                        "type": "uint256"
                    },
                    {
                        "name": "valueTokenWithdrawn",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "stateIn",
                        "type": "uint8"
                    },
                    {
                        "name": "refunderOrTokenReceivedContract",
                        "type": "address"
                    }
                ],
                "name": "stater",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "message",
                        "type": "bytes32"
                    },
                    {
                        "name": "v",
                        "type": "uint8"
                    },
                    {
                        "name": "r",
                        "type": "bytes32"
                    },
                    {
                        "name": "s",
                        "type": "bytes32"
                    }
                ],
                "name": "verify",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [

                ],
                "name": "tautodistribute",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "managersAddress",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "managers",
                        "type": "address[4]"
                    },
                    {
                        "name": "totalPoolValue",
                        "type": "uint256"
                    },
                    {
                        "name": "allfees",
                        "type": "uint256[4]"
                    },
                    {
                        "name": "minAmountPerContributor",
                        "type": "uint256"
                    },
                    {
                        "name": "maxAmountPerContributor",
                        "type": "uint256"
                    },
                    {
                        "name": "destinationAddress",
                        "type": "address"
                    },
                    {
                        "name": "dataField",
                        "type": "bytes"
                    },
                    {
                        "name": "isWhitelist",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "NewDeposit",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "withdrawer",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "amountWihdrawn",
                        "type": "uint256"
                    }
                ],
                "name": "LogNewWithdraw",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "withdrawer",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "tokenAmountWihdrawn",
                        "type": "uint256"
                    }
                ],
                "name": "LogNewTokenWithdraw",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "withdrawer",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "amountWihdrawn",
                        "type": "uint256"
                    }
                ],
                "name": "LogNewRefundWithdraw",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "statew",
                        "type": "bool"
                    },
                    {
                        "indexed": false,
                        "name": "s",
                        "type": "string"
                    }
                ],
                "name": "WhitelistState",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "TotalPoolValueIn",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "MinAmountPerContributorIn",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "MaxAmountPerContributorIn",
                        "type": "uint256"
                    }
                ],
                "name": "setValueInPool",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "state",
                        "type": "uint8"
                    },
                    {
                        "indexed": true,
                        "name": "refundAddressOrTokensContract",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "TokensAmountReceived",
                        "type": "uint256"
                    }
                ],
                "name": "stateChanged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "giverOfOrder",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "amountToSendToDestinationAddress",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "name": "amountToSendToTheManager",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "name": "payToAddress",
                        "type": "address"
                    }
                ],
                "name": "PaymentDone",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "refundamountreceived",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "name": "EthReceivedForRefund",
                        "type": "uint256"
                    }
                ],
                "name": "RefundReceived",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "adr",
                        "type": "address"
                    }
                ],
                "name": "ecrecov",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "contributoradr",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "autodistribfailed",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "numberOfAutoDistributionused",
                        "type": "uint8"
                    },
                    {
                        "indexed": true,
                        "name": "TokensAmountReceived",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "name": "numberOfFailed",
                        "type": "uint256"
                    }
                ],
                "name": "autodistribDone",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "contributoradr",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "fautodistribfailed",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "numberOfAutoDistributionused",
                        "type": "uint8"
                    },
                    {
                        "indexed": true,
                        "name": "numberOfFailed",
                        "type": "uint256"
                    }
                ],
                "name": "fautodistribDone",
                "type": "event"
            }
        ],
    erc20ABI:
        [
            {
                "constant": true,
                "inputs": [

                ],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "_account",
                        "type": "address"
                    },
                    {
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "name": "_symbol",
                        "type": "string"
                    },
                    {
                        "name": "_decimals",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            }
        ],
    erc223ABI:
        [
            {
                "constant": true,
                "inputs": [

                ],
                "name": "name",
                "outputs": [
                    {
                        "name": "_name",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "_totalSupply",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "_decimals",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "MAX_UINT256",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "_symbol",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    },
                    {
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    },
                    {
                        "name": "_data",
                        "type": "bytes"
                    },
                    {
                        "name": "_custom_fallback",
                        "type": "string"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ],
    erc721ABI:
        [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "interfaceId",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "getApproved",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "tokenOfOwnerByIndex",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "tokenByIndex",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "ownerOf",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "tokenURI",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "operator",
                        "type": "address"
                    }
                ],
                "name": "isApprovedForAll",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "symbol",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "approved",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "ApprovalForAll",
                "type": "event"
            }
        ],
    erc777ABI:
        [],
};