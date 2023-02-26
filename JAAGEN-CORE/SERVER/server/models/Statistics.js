// server/models/Statistics.js
const mongoose = require('mongoose')
let StatisticsSchema = new mongoose.Schema(
    {
        poolorfamilyaddress: String, 
        topcontrib: [
            {
                address: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'AnAddress'
                }
            }
        ],
        mediancontrib: [
            {
                address: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'AnAddress'
                }
            }
        ],
        rushhour: [
            {
                hours: Date
            }
        ]
    }
)
module.exports = mongoose.model('Statistics', StatisticsSchema)