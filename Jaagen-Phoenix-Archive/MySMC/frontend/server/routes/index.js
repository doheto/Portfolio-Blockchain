// server/routes/index.js
const user = require('./user')
const anaddress = require('./anaddress')
const factories = require('./factories')
const family = require('./family')
const kyc = require('./kyc')
const pool = require('./pool')
const statistics = require('./statistics')
module.exports = (router) => {
    user(router),
    pool(router),
    anaddress(router)
    // factories(router)
    // family(router)
    // kyc(router)
    // statistics(router)
}