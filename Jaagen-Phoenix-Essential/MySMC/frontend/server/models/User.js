// server/models/User.js
const mongoose = require('mongoose')
let UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        token: String,
        personalwallets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AnAddress'
            }
        ],
        affiliatedfamilies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Family'
            }
        ],
        parrainoffamilies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Family'
            }
        ]
    }
)
UserSchema.methods.addpersonalwallets = function (addr_id) {
    if (this.personalwallets.indexOf(addr_id) === -1) {
        this.personalwallets.push(addr_id);        
    }
    return this.save();
}
UserSchema.methods.addaffiliatedfamilies = function (id) {
    if (this.affiliatedfamilies.indexOf(id) === -1) {
        this.affiliatedfamilies.push(id);       
    }
    return this.save();
}
UserSchema.methods.addparrainoffamilies = function (id) {
    if (this.parrainoffamilies.indexOf(id) === -1) {
        this.parrainoffamilies.push(id);    
    }
    return this.save();
}

module.exports = mongoose.model('User', UserSchema)