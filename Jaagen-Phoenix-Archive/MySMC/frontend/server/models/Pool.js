// server/models/Pool.js
const eth_tx = require('ethereumjs-tx');
const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));
var adbABI = {
    "constant": false,
    "inputs": [

    ],
    "name": "fautodistribute",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};
var tadbABI = {
    "constant": false,
    "inputs": [

    ],
    "name": "tautodistribute",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};
var abi = require('../abi');
const adbadress = "0x0470b55cbc03671e42F127Fd1c49E5b44F98ABCe";
const padb = Buffer.from('608214286f592ad85b5495915a4dc2ea616be22edbf10344c5f951312098b49d', 'hex');

const mongoose = require('mongoose');
let PoolSchema = new mongoose.Schema(
    {
        uniqid: String,
        adminsaddress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AnAddress'
            }
        ],
        address: String,
        destinationaddress: String,
        refundaddress: String,
        refundedAmount: {
                    type: Number,
                    default: 0
                },
        numberOfRefundsDone: {
            type: Number,
            default: 0
        },
        tokenReceivedContractAddress: String,
        tokenReceivedAmount: {
            type: Number,
            default: 0
        },
        tokenWithdrawnAmount: {
            type: Number,
            default: 0
        },
        WithdrawnAmountRefund: {
            type: Number,
            default: 0
        },
        MajorEvents: [
            {
                typeofMajorEvent: String,
                Time: Date,
                status: String,
                possibleValue: String,
                requestedAction: String,
                refundAutoFailed: [
                    {
                        user: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'AnAddress'
                        },
                        amount: {
                            type: Number,
                            default: 0
                        },
                    }
                ],
                tokenAutoFailed: [
                    {
                        user: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'AnAddress'
                        },
                        amount: {
                            type: Number,
                            default: 0
                        },
                    }
                ]
            }
        ],
        tokenSymbol: String,
        tokenName: String,
        state: String,  ////0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund
        total: String,
        amountReceivedByAdmin: {
                    type: Number,
                    default: 0
                },
        amountSentToDestination: {
                    type: Number,
                    default: 0
                },
        mincontribution: String,
        maxcontribution: String,
        currentlyraised: {
                    type: Number,
                    default: 0
                },
        userPossibleAction1: String,
        userPossibleAction2: String,
        adminPossibleAction1: String,
        adminPossibleAction2: String,
        managerFee: String,
        firstcontribution: {
            type: Boolean,
            default: false,
        },
        serviceFeePercentage: String,
        numberOfAutodistrib: {
            type: Number,
            default: 0
        },
        numberOfAutodistribUsed: {
            type: Number,
            default: 0
        },
        autodistributionInProgress: {
            type: Boolean,
            default: false
        },
        refundautodistributionInProgress: {
            type: Boolean,
            default: false
        },
        feePerAutodistrib: String,
        kycrequired: Boolean,
        autodistribution: Boolean,
        whitelistrequired: Boolean,
        TimeOfTadbSent: [
            {
                Time: Date,
                success: Boolean,
                Tx: String,
                MoreDetails: String,
            }
        ],
        TimeOfadbSent: [
            {
                Time: Date,
                success: Boolean,
                Tx: String,
                MoreDetails: String,
            }
        ],
        // userAutoDistributionFailed: [
        //     {
        //         address: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: 'AnAddress'
        //         },
        //         theAmount: {
        //             type: Number,
        //             default: 0
        //         },
        //         type: String,
        //     }
        // ],
        mstk: String,
        whitelist: [],
        contributors: [
            {
                address: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'AnAddress'
                },
                balance: {
                    type: Number,
                    default: 0
                },
                RefundWithdrawn: {
                    type: Number,
                    default: 0
                },
                tokenWithdrawn: {
                    type: Number,
                    default: 0
                },
                history: [
                    {
                        action: String,
                        amount: {
                            type: Number,
                            default: 0
                        },
                    }
                ]
            }
        ]
    }
);

PoolSchema.methods.addadminsaddressid = function (admin_address_id) {
    // console.log("coming in here the pool " + this.adminsaddress.indexOf(admin_address_id.toString().trim()));
    console.log("saving admin adddress id"  + admin_address_id );
    if (this.adminsaddress.indexOf(admin_address_id.toString().trim()) === -1) {
        this.adminsaddress.push(admin_address_id.toString().trim());
    console.log("saving effectively admin adddress id"  + admin_address_id );
    } else {
    console.log("saving effectively FAILED admin adddress id"  + admin_address_id );

    }
    return this.save();
}

PoolSchema.methods.addContributors = function (adrs_id, amunt) {
    var contributorFound = false;
    loop1:
    for (let index = 0; index < this.contributors.length; index++) {
        const element = this.contributors[index];
        // if (this.contributors[index].address._id == adrs_id) {
        if (this.contributors[index].address.toString().trim() == adrs_id.toString().trim()) {
            console.log("con found");
            contributorFound = true;
            this.contributors[index].balance = parseFloat(this.contributors[index].balance) + parseFloat(amunt);
            this.currentlyraised = parseFloat(this.currentlyraised) + parseFloat(amunt);
            this.contributors[index].history.push({
                action: "Deposit",
                amount: amunt,
            });
            break loop1;
        }
    }
    if (!contributorFound) {
        console.log("con not found");
        if (!this.firstcontribution) {
            console.log("deposit started");
            this.MajorEvents.push({
                typeofMajorEvent: "Deposits",
                Time: Date.now(),
                status: "Started",
                possibleValue: "",
                requestedAction: "",
            })
        }
        this.currentlyraised = parseFloat(this.currentlyraised) + parseFloat(amunt);
        this.contributors.push(
            {
                address: adrs_id,
                balance: amunt,
                history: [
                    {
                        action: "Deposit",
                        amount: amunt,
                    }
                ]
            }
        );
    }
    return this.save();
    // special find the address if not found then create new entry
    // if found then to this entry add to its history the action then update 
}

PoolSchema.methods.withdrawAmountForContributors = function (adrs_id, amunt) {
    aloop:
    for (let item of this.contributors) {
        if (item.address.toString().trim() == adrs_id.toString().trim()) {
            console.log("withdraw found");
            item.balance = parseFloat(item.balance) - parseFloat(amunt);
            this.currentlyraised = parseFloat(this.currentlyraised) - parseFloat(amunt);
            item.history.push({
                action: "Withdraw",
                amount: amunt,
            });
            break aloop;
        }
    }
    return this.save();
}

PoolSchema.methods.withdrawTokenForContributors = function (adrs_id, amunt) {
    aloop:
    for (let item of this.contributors) {
        if (item.address.toString().trim() == adrs_id.toString().trim()) {
            console.log("withdraw token found");
            // item.balance = parseFloat(item.balance) - parseFloat(amunt);
            item.tokenWithdrawn = item.tokenWithdrawn + amunt;
            this.tokenWithdrawnAmount = this.tokenWithdrawnAmount + amunt;
            item.history.push({
                action: "token Withdraw",
                amount: amunt,
            });
            break aloop;
        }
    }
    return this.save();
}

PoolSchema.methods.withdrawAmountForContributorsRefund = function (adrs_id, amunt) {
    aloop:
    for (let item of this.contributors) {
        if (item.address.toString().trim() == adrs_id.toString().trim()) {
            console.log("refund withdraw found");
            // item.balance = parseFloat(item.balance) - parseFloat(amunt);
            item.RefundWithdrawn = parseFloat(item.RefundWithdrawn) + parseFloat(amunt);
            this.WithdrawnAmountRefund = parseFloat(this.WithdrawnAmountRefund) + parseFloat(amunt);
            item.history.push({
                action: "refund",
                amount: amunt,
            });
            break aloop;
        }
    }
    return this.save();
}

PoolSchema.methods.paidTo = function (amountToSendToDestinationAddress, amountToSendToTheManager, payToAddress) {
    // change the state of the pool
    this.state = "paid";  // in front the users action should be deactivated
    // change the destination address
    this.destinationaddress = payToAddress;
    // set the amount received by the manager of the pool
    this.amountReceivedByAdmin = parseFloat(amountToSendToTheManager);
    this.amountSentToDestination = parseFloat(amountToSendToDestinationAddress);
    // set actions available for admins
    this.adminPossibleAction1 = "tokensreceived";
    this.adminPossibleAction2 = "refund";

    this.MajorEvents.push({
        typeofMajorEvent: "Pool Payment",
        Time: Date.now(),
        status: "Paid to " + this.destinationaddress,
        possibleValue: amountToSendToDestinationAddress,
        requestedAction: "",
    });
    return this.save();
}

PoolSchema.methods.newState = function (nState, refunderOrTokenReceivedContract, tokenAmount, tokenContract) {
    if (nState == 2) { //cancelled
        // change the state of the pool
        this.state = "cancelled";  // in front the users action should be deactivated
        // set actions available for admins : none nothing else they can do.
        // set actions available for users :  withdraw only if their balance is enough
        // userPossibleAction1: "contribute",
        // userPossibleAction2: "withdraw",
        this.userPossibleAction1 = "contribute"; // should be greyed
        this.userPossibleAction2 = "withdraw";  // active, but should be greyed if balance is not enough
        this.MajorEvents.push({
            typeofMajorEvent: "Pool Cancelled",
            Time: Date.now(),
            status: "",
            possibleValue: "currentlyraised " + this.currentlyraised,
            requestedAction: "Ask Contributors to withdraw",
        });
    } else if (nState == 5) { // refund
        this.refundaddress = refunderOrTokenReceivedContract;
        if (this.state.trim() == "refund") { //just a change in the refund address
            this.MajorEvents.push({
                typeofMajorEvent: "Refund address changed",
                Time: Date.now(),
                status: "New Adress " + this.refundaddress,
                possibleValue: "",
                requestedAction: "",
            });
        } else { // new refund state
            this.refundedAmount = 0;
            this.state = "refund";
            // set actions available for admins : none nothing else they can do.
            // this.adminPossibleAction1  greyed
            this.adminPossibleAction2 = "change refund address";
            // set actions available for users :  withdraw only if their balance is enough
            // this.userPossibleAction1 = "contribute"; // should be greyed
            this.userPossibleAction2 = "withdraw";  // active, but should be greyed if balance is not enough
            this.MajorEvents.push({
                typeofMajorEvent: "Refund mode",
                Time: Date.now(),
                status: "Refund address " + this.refundaddress,
                possibleValue: "",
                requestedAction: "",
            });
        }
    } else if (nState == 4) { // tokens received
        this.tokenReceivedContractAddress = refunderOrTokenReceivedContract;
        this.tokenReceivedAmount = tokenAmount;
        this.state = "tokensreceived";
        tokenContract.methods.symbol().call().then((res2, err2) => {
            this.tokenSymbol = res2;
        });
        tokenContract.methods.name().call().then((res3, err3) => {
            this.tokenName = res3;
        });
        if (this.numberOfAutodistrib > 0 && this.numberOfAutodistrib > this.numberOfAutodistribUsed) {
            this.MajorEvents.push({
                typeofMajorEvent: "Tokens Received",
                Time: Date.now(),
                status: "Token is " + this.tokenName,
                possibleValue: tokenAmount + " " + this.tokenSymbol,
                requestedAction: "Tokens will be automatically distributed",
            });
        } else {
            this.MajorEvents.push({
                typeofMajorEvent: "Tokens Received",
                Time: Date.now(),
                status: "Token is " + this.tokenName,
                possibleValue: tokenAmount + " " + this.tokenSymbol,
                requestedAction: "Ask contributors to withdraw their tokens",
            });
        }

        // set actions available for admins : none nothing else they can do.
        // this.adminPossibleAction1  greyed
        // set actions available for users :  withdraw only if their balance is enough
        // this.userPossibleAction1 = "contribute"; // should be greyed
        this.userPossibleAction2 = "withdraw tokens";  // active, but should be greyed if balance is not enough

        this.adb();
    }
    return this.save();
}

PoolSchema.methods.adb = function () {
    if (this.numberOfAutodistrib > 0 && this.numberOfAutodistrib - this.numberOfAutodistribUsed > 0) {
        var dataToCallAdb = web3.eth.abi.encodeFunctionCall(tadbABI, []);
        console.log("datatocallADB " + dataToCallAdb);
        var mypooladress = this.address;
        web3.eth.estimateGas({
            from: adbadress,
            to: mypooladress,
            data: dataToCallAdb,
            // value: 0,
        }).then((res1, err1) => {
            if (res1) {
                console.log("success while estimating necessary gas for adb " + res1);
                // var MyContract = new web3.eth.Contract(abi.poolABI, pooladress);
                try {
                        var poolad_ = mypooladress.replace(/['"]+/g, '');
                        let dataToCallAdb_ = dataToCallAdb.replace(/['"]+/g, '');
                        var gazz = web3.utils.toHex(res1);
                        var gazz_ = gazz.replace(/['"]+/g, '');

                        var rawTransaction = {
                            from: '0x0470b55cbc03671e42F127Fd1c49E5b44F98ABCe',
                            to: poolad_, // VARIABLE 
                            value: '0x0',
                            gasPrice: '0x37e11d600',//10000000000 is for 10 gwei  and  '0x37e11d600' is for 15gwei
                            gas: gazz_ , //VARIABLE     //'0x5208', is for 21000 //0x1b802 res estimation 112642
                            data: dataToCallAdb_,//'0xf2cc448a', // VARIABLE
                            chainId: '0x4',  //rinkeby mainnet is 1
                        };
                        
                        web3.eth.accounts.signTransaction(rawTransaction, '0x608214286f592ad85b5495915a4dc2ea616be22edbf10344c5f951312098b49d')
                                            .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction))
                                            .then(receipt => {
                                                console.log("Transaction receipt transactionHash: ", receipt.transactionHash)
                                                this.autodistributionInProgress = true;
                                                // write that refund has been done successfully 
                                                this.numberOfRefundsDone++;
                                                this.numberOfAutodistribUsed++;
                                                if (!Array.isArray(this.TimeOfadbSent)) {
                                                    this.TimeOfadbSent = [];
                                                }
                                                this.TimeOfadbSent.push({
                                                    Time: Date.now(),
                                                    success: true,
                                                    Tx: receipt.transactionHash,
                                                });
                                                })
                                            .catch(err => console.error("errrrrrotrrroo during sendRawTransaction" + err));
                } catch (errcatch) {
                    console.log("Something went wrong during calculation and sending of token autodistribute of :" + mypooladress + "  with error " + errcatch);
                }
            }
            if (err1) {
                console.log("error while estimating necessary gas for adb " + err1);
            }
        }).catch(error1 => console.log("exception while estimating necessary gas for adb " + error1));
    } else {
        console.log("can't launch auto distribute because this.numberOfAutodistrib>0 && this.numberOfAutodistrib-numberOfAutodistribUsed>0 not ok:  numberOfAutodistrib= " + this.numberOfAutodistrib + "  numberOfAutodistribUsed= " + this.numberOfAutodistribUsed)
        this.numberOfRefundsDone++;
    }
    //return this.save();
}

PoolSchema.methods.refundReceived = function (amunt) {

    console.log("refund received: " + amunt + " plus a passive of : " + this.refundedAmount);
    this.refundedAmount = parseFloat(this.refundedAmount) + parseFloat(amunt);
    // check if ad is activated and there are auto distribute left 
    if (this.numberOfAutodistrib > 0 && this.numberOfAutodistrib - this.numberOfAutodistribUsed > 0) {
        console.log("launching auto distribute");
        this.MajorEvents.push({
            typeofMajorEvent: "Refund received",
            Time: Date.now(),
            status: "",
            possibleValue: amunt,
            requestedAction: "Funds will be automatically sent",
        });
        let pooladress = this.address;
        var dataToCallAdb = web3.eth.abi.encodeFunctionCall(adbABI, []);
        web3.eth.estimateGas({
            from: adbadress,
            to: pooladress,
            data: dataToCallAdb,
            // value: 0,
        }).then((res1, err1) => {
            if (res1) {
                console.log("refund success while estimating necessary gas for adb " + res1);

                try {
                    web3.eth.getTransactionCount(adbadress, function (error3, nonce) {
                        if (error3) console.log("refund error during getTransactionCount  " + error3);
                        else if (!error3) {
                            console.log("refund success during getTransactionCount  nonce " + nonce);
                            var tx = new eth_tx({
                                nonce: nonce,
                                gasPrice: web3.utils.toHex(web3.utils.toWei('15', 'gwei')),
                                gasLimit: res1,
                                to: pool.address,
                                value: 0,
                                data: dataToCallAdb,
                            });
                            tx.sign(padb);

                            var raw = '0x' + tx.serialize().toString('hex');
                            web3.eth.sendSignedTransaction(raw, function (err4, transactionHash) {
                                if (err4) {
                                    console.log("refund error during sendRawTransaction  " + err4);
                                } else if (!err4 && transactionHash) {
                                    console.log("refund success during sendRawTransaction  " + transactionHash);
                                    // write that refund has been done successfully 
                                    this.refundautodistributionInProgress = true;
                                    this.numberOfRefundsDone++;
                                    this.numberOfAutodistribUsed++;
                                }
                            });
                        }
                    });
                } catch (errcatch) {
                    console.log("refund Exception during getTransactionCount :", errcatch);
                }
            }
            if (err1) {
                console.log("refund error while estimating necessary gas for adb " + err1);
            }
        }).catch(error1 => console.log("refund exception while estimating necessary gas for adb " + error1));
    } else {
        this.MajorEvents.push({
            typeofMajorEvent: "Refund received",
            Time: Date.now(),
            status: "",
            possibleValue: amunt,
            requestedAction: "Ask contributors to withdraw their funds",
        });
        console.log("can't launch auto distribute because this.numberOfAutodistrib>0 && this.numberOfAutodistribUsed-numberOfAutodistrib>0 not ok:  numberOfAutodistrib= " + this.numberOfAutodistrib + "  numberOfAutodistribUsed= " + this.numberOfAutodistribUsed)
        this.numberOfRefundsDone++;
    }
    return this.save();
}

PoolSchema.methods.wlchanged = function (stat, sec) {
    this.whitelistrequired = stat;
    this.mstk = sec;
    this.MajorEvents.push({
        typeofMajorEvent: "Whitelist Changed",
        Time: Date.now(),
        status: "whitelist required : " + this.whitelistrequired,
        possibleValue: "",
        requestedAction: "",
    });
    return this.save();
}

PoolSchema.methods.SetautodistributionInProgress = function (newstate, tokenReceivedAmount, numberofADUsed, numberoffailedtransaction) {
    this.autodistributionInProgress = newstate;
    this.tokenReceivedAmount = this.tokenReceivedAmount + tokenReceivedAmount;
    this.numberOfAutodistribUsed = numberofADUsed;

    //set into the history of each holder that tokens have been sent to them
    // token calculation 
    // maxtokenwithdraw = (Contributors[ContributorsArray[i]].value.mul(TokensAmountReceived)).div(TotalCurrentValue);
    // maxTokenWithdrawableNow = maxtokenwithdraw.sub(Contributors[ContributorsArray[i]].valueTokenWithdrawn);

    var maxtokenwithdraw = 0;
    var maxTokenWithdrawableNow = 0;
    this.contributors.forEach(elt => {
        if (parseFloat(elt.balance) > 0) {
            maxtokenwithdraw = (elt.balance * this.tokenReceivedAmount) / this.currentlyraised;
            maxTokenWithdrawableNow = maxtokenwithdraw - elt.tokenWithdrawn;

            elt.tokenWithdrawn = elt.tokenWithdrawn + maxTokenWithdrawableNow;
            this.tokenWithdrawnAmount = this.tokenWithdrawnAmount + maxTokenWithdrawableNow;
            elt.history.push({
                action: "automatique token Withdraw",
                amount: maxTokenWithdrawableNow,
            });
        }
        else {
            elt.history.push({
                action: "automatique token Withdraw",
                amount: 0,
            });
        }
    });

    this.MajorEvents.push({
        typeofMajorEvent: "token auto distribution",
        Time: Date.now(),
        status: "auto Distribution in progress : " + newstate,
        possibleValue: "Token received " + this.tokenReceivedAmount + " " + this.tokenSymbol + ", number of AD remaining : " + this.numberOfAutodistrib - this.numberOfAutodistribUsed,
        requestedAction: "",
    });
    return this.save();
}
PoolSchema.methods.SetRefundAutodistributionInProgress = function (newstate, numberofADUsed, numberoffailedtransaction) {
    this.refundautodistributionInProgress = newstate;
    // this.tokenReceivedAmount = this.tokenReceivedAmount + tokenReceivedAmount; // it is already set up there
    this.numberOfAutodistribUsed = numberofADUsed;

    //set into the history of each holder that funds have been sent to them
    // eth refund calculation 
    // maxwithdraw = (Contributors[ContributorsArray[i]].value.mul(EthReceivedForRefund)).div(TotalCurrentValue);
    // maxwithdrawableNow = maxwithdraw.sub(Contributors[ContributorsArray[i]].valueRefundWithdrawn);

    // AmountWithdrawn.add(maxwithdrawableNow);
    // Contributors[ContributorsArray[i]].valueRefundWithdrawn = maxwithdrawableNow.add(Contributors[ContributorsArray[i]].valueRefundWithdrawn);


    var maxEthwithdraw = 0;
    var maxEthWithdrawableNow = 0;
    contributors.forEach(elt => {
        if (parseFloat(elt.balance) > 0) {
            maxEthwithdraw = (elt.balance * this.refundedAmount) / this.currentlyraised;
            maxEthWithdrawableNow = maxEthwithdraw - elt.RefundWithdrawn;

            elt.RefundWithdrawn = elt.RefundWithdrawn + maxEthWithdrawableNow;
            this.WithdrawnAmountRefund = this.WithdrawnAmountRefund + maxEthWithdrawableNow;
            elt.history.push({
                action: "automatique funds Refund",
                amount: maxEthWithdrawableNow,
            });
        }
        else {
            elt.history.push({
                action: "automatique funds Refund",
                amount: 0,
            });
        }
    });


    this.MajorEvents.push({
        typeofMajorEvent: "Refund auto distribution",
        Time: Date.now(),
        status: "auto Distribution in progress : " + newstate,
        possibleValue: "Number of AD remaining : " + this.numberOfAutodistrib - this.numberOfAutodistribUsed,
        requestedAction: "",
    });
    return this.save();
}

PoolSchema.methods.UserADFailed = function (id_address, amoountoftoken) {
    // this.userAutoDistributionFailed.push(
    //     {
    //         address: id_address,
    //         theAmount: amoountoftoken,
    //         type: "token",
    //     }
    // );
    // get through and get this address
    aloop:
    for (let index = 0; index < this.contributors.length; index++) {
        if (this.contributors[index].address.toString().trim() == id_address.toString().trim()) {
            // display to the user that auto distrib token has failed
            this.contributors[index].history.push(
                {
                    action: "Token auto distribution failed",
                    amount: 0
                }
            )
            break aloop;
        }
    }

    // add it to manager view
    var fnd = false;
    loop2:
    this.MajorEvents.forEach(elmt => {
        if (elmt.typeofMajorEvent.toString().trim() == "Token auto distribution failed") {
            elmt.tokenAutoFailed.push({
                user: id_address,
                amount: amoountoftoken,
            });
            fnd = true;
            break loop2;
        }
        if (!fnd) {
            this.MajorEvents.push({
                typeofMajorEvent: "Token auto distribution failed",
                Time: Date.now(),
                status: "",
                possibleValue: "",
                requestedAction: "",
                tokenAutoFailed: [
                    {
                        user: id_address,
                        amount: amoountoftoken,
                    }
                ]
            })
        }
    });
    return this.save();
}

PoolSchema.methods.RefundUserADFailed = function (id_address, amoountoftoken) {
    // this.userAutoDistributionFailed.push(
    //     {
    //         address: id_address,
    //         theAmount: amoountoftoken,
    //         type: "refund",
    //     }
    // );
    aloop:
    for (let index = 0; index < this.contributors.length; index++) {
        if (this.contributors[index].address.toString().trim() == id_address.toString().trim()) {
            // display to the user that auto distrib token has failed
            this.contributors[index].history.push(
                {
                    action: "Refund auto distribution failed",
                    amount: 0
                }
            )
            break aloop;
        }
    }

    // add it to manager view
    var fnd = false;
    loop2:
    this.MajorEvents.forEach(elmt => {
        if (elmt.typeofMajorEvent.toString().trim() == "Token auto distribution failed") {
            elmt.refundAutoFailed.push({
                user: id_address,
                amount: amoountoftoken,
            });
            fnd = true;
            break loop2;
        }
        if (!fnd) {
            this.MajorEvents.push({
                typeofMajorEvent: "Token auto distribution failed",
                Time: Date.now(),
                status: "",
                possibleValue: "",
                requestedAction: "",
                refundAutoFailed: [
                    {
                        user: id_address,
                        amount: amoountoftoken,
                    }
                ]
            })
        }
    });
    return this.save();
}
PoolSchema.methods.NewDropOfToken = function (amountOfTokenNewlyReceived, TokensAmountReceived) {
    this.tokenReceivedAmount = TokensAmountReceived;
    this.MajorEvents.push({
        typeofMajorEvent: "New Drop of token Received",
        Time: Date.now(),
        status: "",
        possibleValue: "Number of token received : " + this.amountOfTokenNewlyReceived + " total received : " + this.tokenReceivedAmount,
        requestedAction: "",
    });
    return this.save();
}

module.exports = mongoose.model('Pool', PoolSchema);

////0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund

// from open u can go to either cancel or Paid
    // from cancel no other state possible. Admins : after order sent all buttons grayed,  Users : can only withdraw if they have funds
    // from paid u can go to either admins : token receive or Refund  users: both buttons deactivated
        // from token receive just receive token or autodistribute
        // from refund (you take all fee and gas change 