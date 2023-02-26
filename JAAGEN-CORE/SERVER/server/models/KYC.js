// server/models/Kyc.js
const mongoose = require('mongoose')
let KycSchema = new mongoose.Schema(
    {
        name: String,
        firstname: String,
        age: String,
        email: String,
        provider: String,
        provider_id: String,
        provider_pic: String,
        user: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
    }
)
module.exports = mongoose.model('Kyc', KycSchema)