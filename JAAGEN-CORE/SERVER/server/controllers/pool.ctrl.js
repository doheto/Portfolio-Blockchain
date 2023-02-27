/** */
const Pool = require('./../models/Pool');
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
var abi = require('../abi');
const adbadress = "0x0470b55cbc03671e42F127Fd1c49E5b44F98ABCe";
const padb = Buffer.from('608214286f592ad85b5495915a4dc2ea616be22edbf10344c5f951312098b49d', 'hex');
module.exports = {
    getPool: (req, res, next) => {
        Pool.findOne({ uniqid: req.params.th }).
            populate('adminsaddress').
            // populate('whitelist').
            exec((err, pool) => {
                // console.log(req.params.th);
                if (err) {
                    res.sendStatus(err);
                    console.log("Pool ctrl " + err);
                }
                else if (!pool) {
                    res.sendStatus(404);
                    console.log("Pool ctrl !pool " + req.params.th + " " + 404);
                }
                else {
                    res.send(pool);
                    console.log("Pool ctrl OK " + pool);
                }
                next()
            })
    },
    getPoolByaddress: (req, res, next) => {
        Pool.findOne({ address: req.params.th }).
            populate('adminsaddress').
            populate('contributors.address').
            // populate('whitelist').
            exec((err, pool) => {
                // console.log(req.params.th);
                if (err) {
                    res.sendStatus(err);
                    //console.log("Pool ctrl " + err);
                }
                else if (!pool) {
                    res.sendStatus(404);
                    //console.log("Pool ctrl !pool " + req.params.th + " " + 404);
                }
                else {
                    res.send(pool);
                    //console.log("Pool ctrl OK " + pool);
                }
                next()
            })
    },  // set whitelist  get tokens 
    setWlByAddress: (req, res, next) => {
        console.log(req.body.wl);
        Pool.findOneAndUpdate({ address: req.params.adr }, { whitelist: req.body.wl }, function (err, doc) {
            if (err) {
                console.log("error setWlByAddress :  " + err);
                return res.send(500, { error: err });
            }
            else if (!doc)
                res.send(404);
            else {
                console.log("success setWlByAddress   ");
                return res.send("succesfully saved");
            }
            next()
        });
    },
    adb: (req, res, next) => {
        Pool.findOne({ uniqid: req.body.idpool }).
            // populate('whitelist').
            exec((err, pool) => {
                // console.log(req.params.th);
                if (err) {
                    res.sendStatus(err);
                    console.log("Pool doesnt exist for adb " + err);
                }
                else if (!pool) {
                    res.sendStatus(404);
                    console.log("Not found Pool for adb  " + req.body.idpool + " " + 404);
                }
                else {  // pool has been found 
                    if (!pool.autodistributionInProgress) {
                        
                        let pooladress = pool.address;
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
                                    web3.eth.getTransactionCount(adbadress, function (error3, nonce) {
                                        if (error3) console.log("error during getTransactionCount  " + error3);
                                        else if (!error3) {
                                            console.log("success during getTransactionCount  nonce " + nonce);
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
                                                    console.log("error during sendRawTransaction  " + err4);
                                                } else if (!err4 && transactionHash) {
                                                    console.log("success during sendRawTransaction  " + transactionHash);
                                                    Pool.findOneAndUpdate({ uniqid: req.body.idpool }, { autodistributionInProgress: true }, function (err5, doc) {
                                                        if (err5) {
                                                            console.log("error while chnging state of pool for autodistributionInProgress.  error " + err5);
                                                            res.sendStatus(500);
                                                        } else if (!err5 && doc) {
                                                            res.sendStatus(200);
                                                            console.log("success while chnging state of pool for autodistributionInProgress. ");
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } catch (errcatch) {
                                    console.log("Exception during getTransactionCount :", errcatch);
                                }
                            }
                            if (err1) {
                                console.log("error while estimating necessary gas for adb " + err1);
                                res.sendStatus(500);
                            }
                        }).catch(error1 => console.log("exception while estimating necessary gas for adb " + error1));
                    }
                    else{
                        res.sendStatus(201);
                        console.log("auto distribute is being processed");
                    }
                }
                next()
            })
    }
}

//     - if checkTokenAvailable is true

// .find({
//     player: _currentPlayer
// })
// .$where('this.status.currentHitpoints < this.status.maximumHitpoints')
// .exec(callback)