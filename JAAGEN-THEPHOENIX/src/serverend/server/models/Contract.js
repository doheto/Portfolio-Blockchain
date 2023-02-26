// server/models/Contract.js
const mongoose = require('mongoose')
let ContractSchema = new mongoose.Schema(
    {
        address: String,
        symbol: String,
        decimal: Number,
        type: String,
        kind: String,
    }
);
module.exports = mongoose.model('Contract', ContractSchema)