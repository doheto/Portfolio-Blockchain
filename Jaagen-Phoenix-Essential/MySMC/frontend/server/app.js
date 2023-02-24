/** require dependencies */
const express = require("express")
const routes = require('./routes/')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
//const cloudinary = require('cloudinary')
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const Web3 = require('web3'); //`https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`

const User = require('./models/User');
const AnAddress = require('./models/AnAddress');

const models = require('./models');  // a global object
const APool = models('Pool');
// const APool = require('./models/Pool');

const app = express()
const router = express.Router()
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/medium"
const uri = "mongodb+srv://scm:scm2486@mynodb-xmzfv.mongodb.net/test?retryWrites=true";

var abi = require('./abi');
//61303744997
var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));

const Personal = require('web3-eth-personal');
const personal = new Personal(new Web3.providers.HttpProvider('http://localhost:8545'));



//event autodistribfailed(address indexed contributoradr, uint indexed amount);
//event autodistribDone(uint8 indexed numberOfAutoDistributionused, uint indexed TokensAmountReceived, uint indexed numberOfFailed);

var NewDepositEventSignature = "";
var NewWithDrawEventSignature = ""; //withdraw
var PaymentDoneEventSignature = ""; //PaymentDone
var StateChangedEventSignature = ""; //Cancel
var NewRefundWithDrawEventSignature = ""; //Cancel 
var NewRefundReceivedEventSignature = ""; //refund 
var LogNewTokenWithdrawEventSignature = ""; //token withdraw 
var WhitelistStateEventSignature = ""; // 
var ecrecovEventSignature = ""; // 
var tautodistributeABI = ""; // 
var autodistribfailedEventSignature = ""; // 
var autodistribDoneEventSignature = ""; // 
var fautodistribfailedEventSignature = ""; // 
var fautodistribDoneEventSignature = ""; // 
var NewDropOfTokenEventSignature = ""; // NewDropOfToken(amountOfTokenNewlyReceived, TokensAmountReceived)
for (let i = 0; i < abi.poolABI.length; i++) {
    if (abi.poolABI[i].name == "NewDeposit") {
        NewDepositEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "LogNewWithdraw") {
        NewWithDrawEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "PaymentDone") {
        PaymentDoneEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "stateChanged") {
        StateChangedEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "LogNewRefundWithdraw") {
        NewRefundWithDrawEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "RefundReceived") {
        NewRefundReceivedEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "LogNewTokenWithdraw") {
        LogNewTokenWithdrawEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "WhitelistState") {
        WhitelistStateEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "ecrecov") {
        ecrecovEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "tautodistribute") {
        tautodistributeABI = abi.poolABI[i];
    }
    if (abi.poolABI[i].name == "autodistribfailed") {
        autodistribfailedEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "autodistribDone") {
        autodistribDoneEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "fautodistribfailed") {
        fautodistribfailedEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "fautodistribDone") {
        fautodistribDoneEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
    if (abi.poolABI[i].name == "NewDropOfToken") {
        NewDropOfTokenEventSignature = web3.eth.abi.encodeEventSignature(abi.poolABI[i]);
    }
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

var myContractInstance = new web3.eth.Contract(abi.factoryABI, abi.factoryAddress);
/** connect to MongoDB datastore */
var conn = '';
try {
    conn = mongoose.connect(uri, function (err, client) {
    })
} catch (error) {
    console.log("Error connecting to MongoDB " + error)
}
let port = 5000 || process.env.PORT

/** set up routes {API Endpoints} */
routes(router);

/** set up middlewares */
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));  //* 
app.use(helmet())
//app.use('/static',express.static(path.join(__dirname,'static')))
app.use('/api', router)

// !!!!!!!!  AS WE ARE DOING A NEW DEPLOYMENT OF NODES IT IS WISE HERE TO DELETE ALL EXISTING POOLS !!!!!!!!


myContractInstance.events.NewUserMail((error, event) => {
    if (!error) {
        // if (eventName == "NewUserMail") {
        var adrs = event.returnValues.adrs;
        var mail = event.returnValues.mail;
        console.log("New address for an user " + adrs + " mail " + mail);
        mail = (web3.utils.toAscii(mail)).replace(/\0/g, '');

        // find user by mail 
        User.findOne({ email: mail }, function (err, usrfound) {
            if (usrfound && !err) {
                //if the adddress is in our database of addresses
                AnAddress.findOne({ addr: adrs }, function (err, adrsfound) {
                    if (adrsfound && !err) { // it is in our database 
                        if (!adrsfound.owner) {  //if it is not associated then we just associate it with this user
                            usrfound.addpersonalwallets(adrsfound._id);
                            adrsfound.addOwner(usrfound._id);
                        } //if it is associated with someone account then ?? u simply do nothing
                    } else {// if not in db then create an address entry fill it and associate it with this account
                        new AnAddress({ addr: adrs, owner: usrfound._id }).save((err, newadr) => {
                            if (err)
                                console.log("err " + err);
                            else if (!newadr)
                                console.log("!newadr ");
                            else {
                                console.log(" success added newadr to user ");
                                usrfound.addpersonalwallets(newadr._id);
                            }
                        });
                    }
                });
            }
        });
        // }
    }
    else {
        console.log(error);
    }
});

// string the,       // the is the unique id
//     address newAddress, address[4] managers,uint totalPoolValue, uint[4] allfees, uint minAmountPerContributor, 
//     uint maxAmountPerContributor, address destinationAddress, bytes dataField, bool isWhitelist

myContractInstance.events.ContractCreated((error, event) => {
    if (!error) {
        console.log("New created pool ContractCreated  ");
        console.dir(event.returnValues);
        var isWhitelist = false;
        if (event.returnValues.isWhitelist != null) {
            isWhitelist = event.returnValues.isWhitelist;
        }


        // from open u can go to either cancel or Paid
        // from cancel no other state possible
        // from paid u can go to either token receive or Refund
        // from token receive just receive token or autodistribute
        // from refund (you take all fee and gas change )
        APool.findOne({ address: event.returnValues.newAddress }, function (errorfinding, poolfound) {
            if (poolfound && !errorfinding) {
                console.log("pool exist you are not legit ");
            }
            else if (!errorfinding && !poolfound) {
                APool.findOne({ uniqid: event.returnValues.the }, function (errorfindingid, poolfound2) {
                    if (poolfound2 && !errorfindingid) {
                        console.log("pool exist you are not legit id");
                    }
                    else if (!poolfound2 && !errorfindingid) {
                        console.log("pool creation ");

                        var majEvent = [];
                        majEvent.push({
                            typeofMajorEvent: "Pool Created/Open",
                            time: Date.now(),
                            status: "success",
                            possibleValue: "",
                            requestedAction: ""
                        });
                        new APool({
                            uniqid: event.returnValues.the,
                            address: event.returnValues.newAddress,
                            destinationaddress: event.returnValues.destinationAddress,
                            total: event.returnValues.totalPoolValue,
                            mincontribution: event.returnValues.minAmountPerContributor,
                            maxcontribution: event.returnValues.maxAmountPerContributor,
                            managerFee: event.returnValues.allfees[0],
                            serviceFeePercentage: event.returnValues.allfees[1],
                            numberOfAutodistrib: event.returnValues.allfees[2],
                            feePerAutodistrib: event.returnValues.allfees[3],
                            whitelistrequired: isWhitelist,
                            userPossibleAction1: "contribute",
                            userPossibleAction2: "withdraw",
                            adminPossibleAction1: "Pay",
                            adminPossibleAction2: "Cancel",
                            currentlyraised: 0,
                            amountReceivedByAdmin: 0,
                            amountSentToDestination: 0,
                            kycrequired: false,
                            state: "open",////0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund
                            MajorEvents: majEvent,
                        }).save((err, newcreatedpool) => {
                            if (err)
                                console.log("err " + err);
                            else if (!newcreatedpool)
                                console.log("!newcreatedpool ");
                            else {
                                console.log(" success created new pool ");
                                // go through the addresses 
                                event.returnValues.managers.forEach(element => {
                                    // if one is null dont save it
                                    //else
                                    console.log(element);
                                    if (web3.utils.isAddress(element) && element != '0x0000000000000000000000000000000000000000') {
                                        //  if in our db then just push it in the list of the managers 
                                        AnAddress.findOne({ addr: element }, function (erroranaddress, adrsfound) {
                                            if (adrsfound && !erroranaddress) { // it is in our database 
                                                // console.log("adress is in our db ");
                                                // APool.findOne({ address: event.returnValues.newAddress }, function (err2, plfnd) {
                                                    // if (plfnd && !err2) {
                                                        console.log("adress is in our db and pool found");
                                                        newcreatedpool.addadminsaddressid(adrsfound._id); //adding it to the pool managers list
                                                        adrsfound.addpoolmanagerof(newcreatedpool._id);// saying that that address is manager of this pool 
                                                    // }
                                                // });
                                            } else {// if not in db then create an address entry fill it and associate it with this pool
                                                console.log("adress is not in our db ");
                                                new AnAddress({ addr: element }).save((anothererr, newlycreatedaddress) => {
                                                    if (anothererr)
                                                        console.log("err " + anothererr);
                                                    else if (!newlycreatedaddress)
                                                        console.log("!newlycreatedaddress ");
                                                    else {
                                                        console.log(" success create address plus pool .... now adding manager.... text must follow");
                                                        // APool.findOne({ address: event.returnValues.newAddress }, function (anothererr2, thepoolfound2) {
                                                        //     if (thepoolfound2 && !anothererr2) {
                                                                console.log("pool found and adding newly created address ");
                                                                newcreatedpool.addadminsaddressid(newlycreatedaddress._id); //adding it to the pool managers list
                                                                newlycreatedaddress.addpoolmanagerof(newcreatedpool._id);// saying that that address is manager of this pool 
                                                        //     }
                                                        // });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });

                        
                    }
                });
            }
        });


    }
    else {
        console.log(error);
    }
});




var subscription = web3.eth.subscribe('logs',
    {
        fromBlock: 0,
        // topics: [
        //             NewDeposit,
        //         ]
    }, function (error, result) {
        // if (!error)
        //     console.log(result);
    })
    .on("data", function (log) {   // whn incoming data log found 

        if (log.topics[0] == NewDepositEventSignature && log.topics.length >= 3) {
            console.log("new deposit");
            // console.dir(log);

            let poolAdrs = log.address; //web3.eth.abi.decodeParameter('address', log.address);
            let contributor = web3.eth.abi.decodeParameter('address', log.topics[1]);
            let amount = web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256', log.topics[2]));


            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    console.log("poolfound");
                    AnAddress.findOne({ addr: contributor }, function (erroranaddress, adrsfound) { // find the address
                        if (adrsfound && !erroranaddress) { // it is in our database 
                            // tell address manager to add this pool to the contrib of this user
                            adrsfound.addPool(poolfound._id);
                            // tell pooolmanager to add this user and his contribution
                            poolfound.addContributors(adrsfound._id, amount);
                        } else {// if not in db then create an address entry fill it and associate it with this pool
                            new AnAddress({ addr: contributor }).save((anothererr, newlycreatedaddress) => {
                                if (anothererr)
                                    console.log("error while creating this address " + anothererr);
                                else if (!newlycreatedaddress)
                                    console.log("!newlycreatedaddress ");
                                else {
                                    console.log(" success create address.. adding now to pool ");
                                    // tell address manager to add this pool to the contrib of this user
                                    newlycreatedaddress.addPool(poolfound._id);
                                    // tell pooolmanager to add this user and his contribution
                                    poolfound.addContributors(newlycreatedaddress._id, amount);
                                }
                            });
                        }
                    });


                    //use adrs_id and send to Pool manager and tel it : addNewContributor(adrs, pooladrs, amount)
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });
        } else if (log.topics[0] == NewWithDrawEventSignature && log.topics.length >= 3) {
            console.log("new withdraw");
            let poolAdrs = log.address;
            let contributor = web3.eth.abi.decodeParameter('address', log.topics[1]);
            let amount = web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256', log.topics[2]));

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 

                    AnAddress.findOne({ addr: contributor }, function (erroranaddress, adrsfound) { // find the address
                        if (adrsfound && !erroranaddress) { // it is in our database 
                            // tell pooolmanager to withdraw that amount for that user in the pool
                            poolfound.withdrawAmountForContributors(adrsfound._id, amount);
                        }
                    });
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });
        } else if (log.topics[0] == PaymentDoneEventSignature && log.topics.length >= 4) {
            console.log("payment done to");
            // (address giverOfOrder, uint indexed amountToSendToDestinationAddress, uint indexed amountToSendToTheManager, address indexed payToAddress)

            let poolAdrs = log.address; //web3.eth.abi.decodeParameter('address', log.address);
            let amountToSendToDestinationAddress = web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256', log.topics[1]));
            let amountToSendToTheManager = web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256', log.topics[2]));
            let payToAddress = web3.eth.abi.decodeParameter('address', log.topics[3]);


            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    // tell pooolmanager to process the payment 
                    poolfound.paidTo(amountToSendToDestinationAddress, amountToSendToTheManager, payToAddress);
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });
        } else if (log.topics[0] == StateChangedEventSignature && log.topics.length >= 4) {
            console.log("pool state chnged");
            // (address giverOfOrder, uint indexed amountToSendToDestinationAddress, uint indexed amountToSendToTheManager, address indexed payToAddress)

            let poolAdrs = log.address; //web3.eth.abi.decodeParameter('address', log.address);
            let newState = web3.eth.abi.decodeParameter('uint8', log.topics[1]);
            let refunderOrTokenReceivedContract = web3.eth.abi.decodeParameter('address', log.topics[2]);
            let tokenAmount = web3.eth.abi.decodeParameter('uint256', log.topics[3]);


            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    // tell pooolmanager to process the change in state 
                    if (newState == 4) {
                        let tokenContract = new web3.eth.Contract(abi.erc20ABI, refunderOrTokenReceivedContract);
                        poolfound.newState(newState, refunderOrTokenReceivedContract, tokenAmount, tokenContract);
                        //poolfound.adb(); //first(() => second(() => third()));

                    } else {
                        poolfound.newState(newState, refunderOrTokenReceivedContract, tokenAmount, "");
                    }

                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });
        } else if (log.topics[0] == NewRefundWithDrawEventSignature && log.topics.length >= 3) {
            console.log("new refund withdraw");
            let poolAdrs = log.address;
            let contributor = web3.eth.abi.decodeParameter('address', log.topics[1]);
            let amount = web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256', log.topics[2]));

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 

                    AnAddress.findOne({ addr: contributor }, function (erroranaddress, adrsfound) { // find the address
                        if (adrsfound && !erroranaddress) { // it is in our database 
                            // tell pooolmanager to withdraw that amount for that user in the pool
                            poolfound.withdrawAmountForContributorsRefund(adrsfound._id, amount);
                        }
                    });
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });//event LogNewRefundWithdraw   (address indexed withdrawer, uint indexed amountWihdrawn);
        } else if (log.topics[0] == NewRefundReceivedEventSignature && log.topics.length >= 3) {
            console.log("new refund funds arrived");
            let poolAdrs = log.address;
            let amount = web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256', log.topics[1]));

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    // tell pooolmanager to add a refund amount just received 
                    poolfound.refundReceived(amount);
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });//event LogNewRefundWithdraw   (address indexed withdrawer, uint indexed amountWihdrawn);
        } else if (log.topics[0] == LogNewTokenWithdrawEventSignature && log.topics.length >= 3) {
            console.log("new token withdraw");
            let poolAdrs = web3.eth.abi.decodeParameter('address', log.address);
            let contributor = web3.eth.abi.decodeParameter('address', log.topics[1]);
            let amount = web3.eth.abi.decodeParameter('uint256', log.topics[2]);

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 

                    AnAddress.findOne({ addr: contributor }, function (erroranaddress, adrsfound) { // find the address
                        if (adrsfound && !erroranaddress) { // it is in our database 
                            // tell pooolmanager to withdraw that amount for that user in the pool
                            poolfound.withdrawTokenForContributors(adrsfound._id, amount);
                        }
                    });
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });//event LogNewRefundWithdraw   (address indexed withdrawer, uint indexed amountWihdrawn);
        } else if (log.topics[0] == WhitelistStateEventSignature && log.topics.length >= 2) {
            console.log("whitelist state changed"); //event WhitelistState   (bool indexed statew, string indexed s);
            let poolAdrs = log.address; //web3.eth.abi.decodeParameter('address', log.address);
            let newStateOfWhitelist = web3.eth.abi.decodeParameter('bool', log.topics[1]);
            let stoken = web3.eth.abi.decodeParameter('string', log.data);

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    console.log("saved " + newStateOfWhitelist + "  " + stoken);
                    poolfound.wlchanged(newStateOfWhitelist, stoken);
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });//event LogNewRefundWithdraw   (address indexed withdrawer, uint indexed amountWihdrawn);


        } else if (log.topics[0] == ecrecovEventSignature && log.topics.length >= 1) { // handled
            console.log("deposit for whitelist");
            // console.dir(log.topics);
            let poolAdrs = log.address;
            let adrs = web3.eth.abi.decodeParameter('address', log.topics[1]);
            console.log("adress " + adrs);
        } else if (log.topics[0] == autodistribfailedEventSignature && log.topics.length >= 3) {
            console.log("token autodistribfailed for pool  " + log.address + " user " + log.topics[1] + "  for amount " + log.topics[2]);
            let poolAdrs = log.address;
            let adrs = web3.eth.abi.decodeParameter('address', log.topics[1]);
            let tokenamount = web3.eth.abi.decodeParameter('uint256', log.topics[2]);
            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    AnAddress.findOne({ addr: adrs }, function (erroranaddress, adrsfound) {
                        if (adrsfound && !erroranaddress) { // it is in our database 
                            poolfound.UserADFailed(adrsfound._id,tokenamount);
                        }
                    });
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });

        } else if (log.topics[0] == autodistribDoneEventSignature && log.topics.length >= 4) {
            console.log("token autodistribDone for pool  " + log.address + " number of adused " + log.topics[1] + "  token amount received " + log.topics[2] + " number of failed " + log.topics[3]);
            let poolAdrs = log.address;
            let numberOfAdUsed = web3.eth.abi.decodeParameter('uint8', log.topics[1]);
            let tokenamountReceived = web3.eth.abi.decodeParameter('uint256', log.topics[2]);
            let numberOfFailedTransaction = web3.eth.abi.decodeParameter('uint256', log.topics[3]);

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    let tokenContract = new web3.eth.Contract(abi.erc20ABI, poolfound.tokenReceivedContractAddress);
                    tokenContract.methods.decimals().call().then((decimal, decimaleror) => {
                    tokenamountReceived = tokenamountReceived / Math.pow(10, decimal);

                    poolfound.SetautodistributionInProgress(false, tokenamountReceived, numberOfAdUsed, numberOfFailedTransaction);
                    });
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });

            //set distribution over
        } else if (log.topics[0] == fautodistribfailedEventSignature && log.topics.length >= 3) {
            console.log("refund autodistribfailed for pool  " + log.address + " user " + log.topics[1] + "  for amount " + log.topics[2]);
            let poolAdrs = log.address;
            let adrs = web3.eth.abi.decodeParameter('address', log.topics[1]);
            let tokenamount = web3.eth.abi.decodeParameter('uint256', log.topics[2]);
            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    AnAddress.findOne({ addr: adrs }, function (erroranaddress, adrsfound) {
                        if (adrsfound && !erroranaddress) { // it is in our database 
                            poolfound.RefundUserADFailed(adrsfound._id,tokenamount);
                        }
                    });
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });

        } else if (log.topics[0] == fautodistribDoneEventSignature && log.topics.length >= 3) {
            console.log("refund autodistribDone for pool  " + log.address + " number of adused " + log.topics[1] + " number of failed " + log.topics[2]);
            let poolAdrs = log.address;
            let numberOfAdUsed = web3.eth.abi.decodeParameter('uint8', log.topics[1]);
            let numberOfFailedTransaction = web3.eth.abi.decodeParameter('uint256', log.topics[2]);

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    poolfound.SetRefundAutodistributionInProgress(false, numberOfAdUsed, numberOfFailedTransaction);
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });

            //set distribution over
        } else if (log.topics[0] == NewDropOfTokenEventSignature && log.topics.length >= 3) { // NewDropOfToken(amountOfTokenNewlyReceived, TokensAmountReceived)
            console.log("New Drop of tokens for pool " + log.address + " amount " + log.topics[1] + " total token received  " + log.topics[2]);
            let poolAdrs = log.address;
            let amountOfTokenNewlyReceived = web3.eth.abi.decodeParameter('uint256', log.topics[1]);
            let TokensAmountReceived = web3.eth.abi.decodeParameter('uint256', log.topics[2]);

            APool.findOne({ address: poolAdrs }, function (errorfinding, poolfound) {
                if (poolfound && !errorfinding) { // the concerned pool has been found 
                    poolfound.NewDropOfToken(amountOfTokenNewlyReceived, TokensAmountReceived);
                }
                else if (!errorfinding && !poolfound) {
                    console.log("pool doesnt exist you are not legit ");
                }
            });
        }
    });

   


// .on("changed", function(log){  //when log is removed from the blockchain
//     console.log(log);
// });
// .on("error", function(log){  // when can not subscribe
//     console.log(log);
// });

// unsubscribes the subscription
// subscription.unsubscribe(function(error, success){
//     if(success)
//         console.log('Successfully unsubscribed!');
// });


// module.exports = conn;

const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
        jwksUri: "https://{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: '{YOUR-AUTH0-DOMAIN}',
    algorithms: ['RS256']
});

/** start server */
app.listen(port, 'localhost', () => {
    console.log(`Server started at port: ${port}`);
    // 5250 HT 5800,25 TTC charges locatives : securite parking nettoyage du site 1000 euros par mois 7.75 / m 852 mcarres 
    //                            3 mois dde franchise et pas de reduction de loyr  63000.  75euros /m2 15%   9450 honoraires.
});