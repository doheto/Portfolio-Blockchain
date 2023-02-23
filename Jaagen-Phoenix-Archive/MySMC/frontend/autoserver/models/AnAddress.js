// server/models/AnAddress.js
const mongoose = require('mongoose');
let AnAddressSchema = new mongoose.Schema(
    {
        addr: String,
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
module.exports = mongoose.model('AnAddress', AnAddressSchema)