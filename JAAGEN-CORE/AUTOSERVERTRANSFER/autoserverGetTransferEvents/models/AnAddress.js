// server/models/AnAddress.js
// en backend un address cest 
// address:
// name:
// chainType : btc/ eth/ eos…
// type: imported/fatherseed/sonseed
// levelifsonseed:
// linkedto:
// fatherifsonseed:
// sonsiffatherseed:
const mongoose = require('mongoose');
let AnAddressSchema = new mongoose.Schema(
    {
        addr: String,
        name: String,
        chainType: String, //btc, eth, eos, ripple
        type: String,    //importedpk/fatherseed/sonseed
        // fatherTorF: Boolean,  
        fatherIfSonSeed : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AnAddress'
        },
        sonsIfFatherSeed : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AnAddress'
            }
        ],
        linkedTo : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AnAddress'
            }
        ],
        tokenContracts: [],
        tmpTrx: [],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        poolinto: [
            {
                pool: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Pool'
                }
            }
        ],
        poolmanagerof: [
            {
                pool: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Pool'
                }
            }
        ]
    }
);
AnAddressSchema.methods.addOwner = function (owner_id) {
    this.owner = owner_id;
    return this.save();
}
AnAddressSchema.methods.addPool = function (p_id) {
    if (this.poolinto.indexOf(p_id.toString().trim()) == -1) {
        this.poolinto.push(p_id.toString().trim());
    }
    return this.save();
}
AnAddressSchema.methods.addpoolmanagerof = function (pool_addr_id) {
    // console.log("coming in here the addresses " + this.poolmanagerof.indexOf(pool_addr_id.toString().trim()) );
    if (this.poolmanagerof.indexOf(pool_addr_id.toString().trim()) === -1) {
        this.poolmanagerof.push(pool_addr_id.toString().trim());
    }
    return this.save();
}


AnAddressSchema.methods.getOwnerAddress = function (_id) {
    AnAddress.find({ 'owner': _id }).then((AnAddress) => {
        return AnAddress;
    })
}

AnAddressSchema.methods.addAsSon = function (son_id) {
    if (this.sonsIfFatherSeed.indexOf(son_id) === -1) {
        this.sonsIfFatherSeed.push(son_id);
        this.save();
    }
}

AnAddressSchema.methods.addAsFather = function (father_id) {
    this.fatherIfSonSeed = father_id;
    this.save();
}

AnAddressSchema.methods.addALinked = function (linked_id) {
    let res = null;
    if (this.linkedTo.indexOf(linked_id) === -1) {
        this.linkedTo.push(linked_id);
        res = linked_id
        this.save();
    }
    return res;
}

AnAddressSchema.methods.AddtokenContracts = function (token_contracts) {
    if (this.tokenContracts.indexOf(token_contracts) === -1) {
        this.tokenContracts.push(token_contracts);
    }
    return this.save();
}

AnAddressSchema.methods.AddtotmpTrx = function (trx) {
    if (this.tmpTrx.indexOf(trx) === -1) {
        this.tmpTrx.push(trx);
        return this.save();
    }
}

AnAddressSchema.methods.EmptytmpTrx = function () {
    this.tmpTrx.length = 0;
    return this.save();
}


module.exports = mongoose.model('AnAddress', AnAddressSchema)


// saveNewFatherSeedAddress(address, chain, type, name, Linked?[ ])
// saveNewSonSeedAddress(addressfather, addressSon, chain, type, name)
// checkIfAddressExists(address) // return false or return whole tree of sons and linked 
// 						   // address, and names nad types and chaintypes…
// saveImportedFromPKey(address, chain, type, name, Linked?[ ] )
// saveContractsForAddress(address, contract[])