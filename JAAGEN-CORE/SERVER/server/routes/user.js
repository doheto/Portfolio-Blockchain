// server/routes/user.js
const usercontroller = require('./../controllers/user.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()
module.exports = (router) => {

    /**
     * get all users
     */
    router
        .route('/users')
        .get(usercontroller.getAll)
    /**
     * add an user 
     */
    router
        .route('/user')
        .post(multipartWare, usercontroller.addUser)
    /**
     * delete an user 
     */
    router
        .route('/user')
        .delete(multipartWare, usercontroller.deleteUser)
    /**
     * get a particlular article to view
     */
    router
        .route('/user/:mail')
        .get(usercontroller.getUser) 
}