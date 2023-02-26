// server/routes/pool.js
const poolcontroller = require('./../controllers/pool.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()
module.exports = (router) => {
    /**
     * get a particlular pool
     */
    router
        .route('/pool/:th')
        .get(poolcontroller.getPool)
    /**
     * get a particlular pool by its address
     */
    router
        .route('/pool/byadr/:th')
        .get(poolcontroller.getPoolByaddress)
    /**
     * set WL'ed addresses 
     */
    router
        .route('/pool/wl/:adr')
        .post(multipartWare, poolcontroller.setWlByAddress)

    /**
     * auto distribute 
     */
    router
        .route('/pool/adb') 
        .post(multipartWare, poolcontroller.adb)
}