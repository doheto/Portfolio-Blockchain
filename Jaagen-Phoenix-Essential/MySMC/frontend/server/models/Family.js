// server/models/Family.js
const mongoose = require('mongoose')
let FamilySchema = new mongoose.Schema(
    {
        owners: String, //should be user
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AnUser'
            }
        ],
        members: [
            {
                address: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'AnUser'
                },
                level: String                
            }
        ],
        address: String,
        balance: Number,
        mincontribution: Number,
        projects: [
            {
                id: Number,
                name: String,
                description: String,
                deadline: Date,
                fees: Number,
                Distribution: Date,
            }
        ],
        familyfees: [
            {
                levelname: String,
                amount: Number
            }
        ],
        kycrequired: Boolean,
        autocontribution: Boolean,
        contributors: [
            {
                address: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'AnAddress'
                },
                balance: Number,
                history: [
                    {
                        action: String,
                        amount: Number,
                        projectid : Number  //add some color in the UI so that people really makes difference between projects
                    }
                ]
            }
        ]
    }
);

module.exports = mongoose.model('Family', FamilySchema)