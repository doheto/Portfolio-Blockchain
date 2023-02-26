// server/models/Factories.js
const mongoose = require('mongoose')
let FactoriesSchema = new mongoose.Schema(
    {
        factoryaddress : String,
        network: String,
        poolsassociated: [
            {
                pooladdress: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : 'AnAddress'
                }
            }
        ]
    }
);
module.exports = mongoose.model('Factories', FactoriesSchema)

