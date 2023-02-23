/** */
// here u need to launch local geth with minimum peers and cache possible and make sure that this address is coinbase here
const Web3 = require('web3');
const Personal = require('web3-eth-personal');
const personal = new Personal(new Web3.providers.HttpProvider('http://localhost:8545'));
// const anAddress = require('./../models/AnAddress');
const models = require('../models');  // a global object
const anAddress = models('AnAddress');

module.exports = {
    setHAddress: (req, res, next) => {
        console.log(req.body.hash);
        personal.sign(req.body.hash, "0xbf18b2918a36463d7a84f111d616c65392e91825", "passphrase", function (err, resultat) {
            if (err) { 
                // console.log("error hhhAddress :  " + err);
                return res.send(500, { error: err });
            }
            else if (!resultat)
                res.send(404);
            else {
                // console.log("success hhhAddress   " + resultat);
                return res.send(resultat);
            }
            next()
        });
    },
    isAdressNameExist: (req, res, next) => {
        anAddress.findOne({ name: req.params.th }).
            exec((err, theaddrs) => {
                // console.log(req.params.th);
                if (err) {
                    //res.sendStatus(err);
                    res.sendStatus(404);
                    //console.log("theaddrs ctrl " + err);
                }
                else if (!theaddrs) {
                    res.send(req.params.th);
                    //console.log("theaddrs ctrl !theaddrs " + req.params.th + " " + 404);
                }
                else {
                    // res.send(theaddrs);
                    res.sendStatus(404);
                    //console.log("theaddrs ctrl OK " + theaddrs);
                }
                next()
            })
    },
    getnameofaddress: (req, res, next) => {
        anAddress.findOne({ addr: req.params.th }).
            exec((err, theaddrs) => {
                // console.log(req.params.th);
                if (err) {
                    //res.sendStatus(err);
                    res.sendStatus(404);
                    //console.log("theaddrs ctrl " + err);
                }
                else if (!theaddrs) {
                    res.sendStatus(501);
                    //console.log("theaddrs ctrl !theaddrs " + req.params.th + " " + 404);
                }
                else {
                    res.send(theaddrs);
                    // res.sendStatus(404);
                    //console.log("theaddrs ctrl OK " + theaddrs);
                }
                next()
            })
    },
    saveNewFatherSeedAddress: (req, res, next) => {
        new anAddress({ 
            addr: req.body.adr,
            chainType : req.body.chain,
            type : 'fatherseed',
            name : req.body.name,
            // fatherTorF : true,
            linkedTo : req.body.linkedTo,
        }).save((anothererr, newlycreatedaddress) => {
            if (anothererr) {
                console.log("err " + anothererr);
                res.sendStatus(err);
            }
            else if (!newlycreatedaddress) {
                console.log("!newlycreatedaddress ");
                res.sendStatus(404);
            }
            else {
                console.log("success saveNewFatherSeedAddress ");
                res.send("succesfully saved");
            }
            next()
        });
    },
    saveNewSonSeedAddress: (req, res, next) => {
        new anAddress({ 
            addr: req.body.adr,
            chainType : req.body.chain,
            type : 'sonseed',
            name : req.body.name,
            // fatherTorF : false,
        }).save((anothererr, newlycreatedaddress) => {
            if (anothererr) {
                console.log("err " + anothererr);
                res.sendStatus(err);
            }
            else if (!newlycreatedaddress) {
                console.log("!newlycreatedaddress ");
                res.sendStatus(404);
            }
            else {
                AnAddress.findOne({ addr: req.body.addressfather }, function (erroranaddress, adrsfound) {
                    if (adrsfound && !erroranaddress) {
                        newlycreatedaddress.addAsFather(adrsfound._id);
                        adrsfound.addAsSon(newlycreatedaddress._id);
                    }
                });
                console.log("success saveNewFatherSeedAddress ");
                res.send("succesfully saved");
            }
            next()
        });
    },
    checkIfSeedImportedAgetTmpContractsTxddressExists: (req, res, next) => {
        anAddress.findOne({ addr: req.params.adr }).
            exec((err, thaAddr) => {
                if (err) {
                    res.sendStatus(404);
                }
                else if (!thaAddr) {
                    res.sendStatus(501);
                }
                else {
                    res.send(thaAddr);
                    thaAddr.EmptytmpTrx();
                }
                next()
            })
    },
    checkIfSeedImportedAddressExists: (req, res, next) => {
        anAddress.findOne({ addr: req.params.adr }).
            populate({
                path: 'linkedTo',
                populate: { path: 'linkedTo' } //getting linkedTo of the linkedTo  just 2 levels because people might not like you tracking their things the whole of them owning their keys is tha we do not know 
            }).
            populate('sonsIfFatherSeed').
            exec((err, thaAddr) => {
                // console.log(req.params.th);
                if (err) {
                    res.sendStatus(err);
                    //console.log("thaAddr ctrl " + err);
                }
                else if (!thaAddr) {
                    console.log("imported from seed non existant");

                    // so in that case we create it 

                    res.sendStatus(404);
                    //the protocol here is that you get first address and sedn us here if we do not have 
                    // we return 404 and you ask the name then save and send all save as fatherseed...
                    //console.log("thaAddr ctrl !thaAddr " + req.params.th + " " + 404);
                }
                else {
                    res.send(thaAddr);
                    // u need here to go through the list find the ids and put it in a corresponding list
                    // save it in the linkedTo of this address
                    // then go through the list of ids and for each add to their linkedTo the ids of this Address
                    if (req.body.thelinked.length>0) {
                        var addr_id_list = []
                        for (let index = 0; index < req.body.thelinked.length; index++) {
                            anAddress.findOne({ addr: req.body.thelinked[index] }).
                            exec((err2, thaAddr2) => {
                                if (err2) {
                                } else if (!thaAddr2) {
                                }
                                else {
                                    // if (thaAddr2.linkedTo.indexOf(thaAddr._id) == -1) {
                                    if (thaAddr2.addALinked(thaAddr._id) == thaAddr._id) {
                                        // thaAddr2.linkedTo.push(thaAddr._id);
                                        // thaAddr2.addALinked(thaAddr._id);
                                        addr_id_list.push(thaAddr2._id);
                                    }
                                }
                            })
                        }
                        addr_id_list.forEach( v => 
                        {
                            thaAddr.addALinked(v);
                            // if (thaAddr.linkedTo.indexOf(v) == -1) {
                            //     thaAddr.linkedTo.push(v)
                            // }
                        });
                    }
                    //console.log("thaAddr ctrl OK " + thaAddr);
                }
                next()
            })
    }, 
    saveImportedFromPKey: (req, res, next) => {  //address, chain, type, name, Linked?[ ]
        new anAddress({ 
            addr: req.body.adr,
            chainType : req.body.chain,
            type : 'importedpk',
            name : req.body.name,
            // fatherTorF : true,
            linkedTo : req.body.linkedTo,
        }).save((anothererr, newlycreatedaddress) => {
            if (anothererr) {
                console.log("err " + anothererr);
                res.sendStatus(err);
            }
            else if (!newlycreatedaddress) {
                console.log("!newlycreatedaddress ");
                res.sendStatus(404);
            }
            else {
                console.log("success saveNewFatherSeedAddress ");
                res.send("succesfully saved");
            }
            next()
        });
    },
    saveContractsForAddress: (req, res, next) => {  // saveContractsForAddress(address, contract[])
        anAddress.findOne({ addr: req.body.adr }).
            exec((err, thaAddr) => {
                if (err) {
                    res.sendStatus(err);
                    console.log("thaAddr ctrl " + err);
                }
                else if (!thaAddr) {
                    res.sendStatus(404);
                    console.log("thaAddr ctrl !thaAddr " + req.params.th + " " + 404);
                }
                else {
                    req.body.contracts.forEach( v => 
                        {
                            thaAddr.AddtokenContracts(v);
                        });
                    // res.send(thaAddr);
                    console.log("thaAddr ctrl OK " + thaAddr);
                }
                next()
            })
    },
    //we should have an unlink feature
}
// checkIfSeedImportedAddressExists(address) // return false or return whole tree of sons and linked 
// 						   // address, and names nad types and chaintypes…
// saveImportedFromPKey(address, chain, type, name, Linked?[ ] )
// saveContractsForAddress(address, contract[])

// User.
//   findOne({ name: 'Val' }).
//   populate({
//     path: 'friends',
//     // Get friends of friends - populate the 'friends' array for every friend
//     populate: { path: 'friends' }
//   });