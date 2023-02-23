/** require dependencies */
const express = require("express");
const routes = require('./routes/');
// const mongoose = require('../server/app');
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
//const cloudinary = require('cloudinary')
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
// var extPool = require('./../server/models/Pool');
const models = require('./models');
const extPool = models('Pool');
const TheSystem = models('System');
const app = express();
const router = express.Router();
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/medium";
const uri = "mongodb+srv://scm:scm2486@mynodb-xmzfv.mongodb.net/test?retryWrites=true";
var abi = require('./abi');

const eth_tx = require('ethereumjs-tx');
const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));

var adbABI = {
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
const adbadress = "0x0470b55cbc03671e42F127Fd1c49E5b44F98ABCe";
const padb = Buffer.from('608214286f592ad85b5495915a4dc2ea616be22edbf10344c5f951312098b49d', 'hex');

/** connect to MongoDB datastore */
try {
    mongoose.connect(uri, function (err, client) {
    })
} catch (error) {
    console.log("Error connecting to MongoDB " + error);
}

let port = 5005 || process.env.PORT
/** set up routes {API Endpoints} */
routes(router);

/** set up middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  //* 
app.use(helmet());
app.use('/api', router);

var timer = 1800000;//ms is the unit  30 min = 1800000ms


new TheSystem({
    id: 1,
    timer: 1800000,
}).save((err, newElt) => {
    if (err) {

    }
    else if (!newElt) {

    }
    else {
        console.log(" success created new systemelt ");
    }
});

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
});

function loop() {
    var tokenContract = "";
    var adjustedBalance = 0;
    extPool.find({ autodistributionInProgress: false }).
        where('numberOfAutodistrib').gt('numberOfAutodistribUsed').gt(0).
        where("tokenReceivedContractAddress").ne("").
        populate('adminsaddress').
        exec((err, poopool) => {
            if (err) {
                console.log("poopool ctrl error " + err);
            }
            else if (!poopool) {
                console.log("poopool ctrl !poopool " + poopool);
            }
            else {
                poopool.forEach(function(tpool){
                    //check them making sure that tokens are available. if not remove them from list 
                    tokenContract = "";
                    adjustedBalance = 0;
                    let pooladress = tpool.address;
                    console.log("checcking balance for " + pooladress);
                    try {
                        tokenContract = new web3.eth.Contract(abi.erc20ABI, tpool.tokenReceivedContractAddress);
                        adjustedBalance = 0;
                        tokenContract.methods.decimals().call().then((decimal, decimaleror) => {
                            tokenContract.methods.balanceOf(pooladress).call()
                                .then((res, err) => {
                                    adjustedBalance = res / Math.pow(10, decimal);
                                    if (parseFloat(adjustedBalance) > 0) { // tokens received
                                        console.log("tokens received for so  processing " + pooladress + "volume " + adjustedBalance);

                                        if (!tpool.autodistributionInProgress) {

                                            var dataToCallAdb = web3.eth.abi.encodeFunctionCall(adbABI, []);
                                            web3.eth.estimateGas({
                                                from: adbadress,
                                                to: pooladress,
                                                data: dataToCallAdb,
                                                // value: 0,
                                            }).then((res1, err1) => {
                                                if (res1) {
                                                    console.log("success while estimating necessary gas for adb " + res1);
                                                    // var MyContract = new web3.eth.Contract(abi.poolABI, pooladress);
                                                    try {
                                                            var poolad_ = pooladress.replace(/['"]+/g, '');
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
                                                                console.log("success Transaction receipt transactionHash: ", receipt.transactionHash)
                                                                let TimeOfadbSentVar = {
                                                                    Time: Date.now(),
                                                                    success: true,
                                                                    Tx: receipt.transactionHash,
                                                                    MoreDetails: "",
                                                                }
                                                                //updating what happenned into the tpool
                                                                extPool.findOneAndUpdate({ uniqid: tpool.uniqid }, { $set: { autodistributionInProgress: true }, $push: { TimeOfTadbSent: TimeOfadbSentVar } }, { new: true }, function (err5, doc) {
                                                                    if (err5) {
                                                                        console.log("error while chnging state of tpool for autodistributionInProgress.  error " + err5);
                                                                    } else if (!err5 && doc) {
                                                                        console.log("success while chnging state of tpool for autodistributionInProgress. ");
                                                                    }
                                                                });
                                                            })
                                                            .catch(err => { 
                                                                console.error("errrrrrotrrroo during sendRawTransaction" + err);
                                                                let TimeOfadbSentVar = {
                                                                    Time: Date.now(),
                                                                    success: False,
                                                                    Tx: "",
                                                                    MoreDetails: err,
                                                                }
                                                                //updating what happenned into the tpool
                                                                extPool.findOneAndUpdate({ uniqid: tpool.uniqid }, { $set: { autodistributionInProgress: false }, $push: { TimeOfTadbSent: TimeOfadbSentVar } }, { new: true }, function (err5, doc) {
                                                                    if (err5) {
                                                                        console.log("FALSE ADB error while chnging state of tpool for autodistributionInProgress.  error " + err5);
                                                                    } else if (!err5 && doc) {
                                                                        console.log("FALSE ADB success while chnging state of tpool for autodistributionInProgress. ");
                                                                    }
                                                                });
                                                            });
                                                    } catch (errcatch) {
                                                        console.log("Exception during sendtransaction :", errcatch);
                                                    }
                                                }
                                                if (err1) {
                                                    console.log("error while estimating necessary gas for adb " + err1);
                                                }
                                            }).catch(error1 => console.log("exception while estimating necessary gas for adb " + error1));
                                        }
                                        else {
                                            console.log("auto distribute is being processed");
                                        }

                                    } else {
                                        console.log("passing on " + pooladress + " for no tokens have been received ");
                                    }
                                });
                        });
                    } catch (error) {
                        console.log("error while evaluating for " + pooladress + " error : " + error);
                    }
                });
            }
        });

    TheSystem.findOne({ id: 1 }).
        exec((err, sys) => {
            if (err) {
                // console.log("sys ctrl " + err);
            }
            else if (!sys) {
                // console.log("sys ctrl !sys " + 404);
            }
            else {
                // console.log("sys ctrl OK " + sys);
                timer = sys.timer;
            }
        });
        console.log("timer " + timer);
    setTimeout(loop, timer);
}

loop();
