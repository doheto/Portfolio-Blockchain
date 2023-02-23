// server/routes/pool.js
const systemcontroller = require('./../controllers/system.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()
module.exports = (router) => {
    /**
     * get a particlular pool
     */
    router
        .route('/pool/timer')
        .get(systemcontroller.getTimer)
    /**
     * set WL'ed addresses 
     */
    router
        .route('/pool/timer/:newtimer')
        .post(multipartWare, systemcontroller.setTimer)
}