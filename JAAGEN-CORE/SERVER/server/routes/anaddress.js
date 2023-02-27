const addresscontroller = require('./../controllers/anaddress.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()
module.exports = (router) => {
    /**
     * set WL'ed addresses 
     */
    router
        .route('/address')
        .post(multipartWare, addresscontroller.setHAddress)
    /**
     * get if a wallet name exist
     */
    router
        .route('/address/isadressexist/:th')
        .get(addresscontroller.isAdressNameExist)
    /**
     * get name of address
     */
    router
        .route('/address/getnameofaddress/:th')
        .get(addresscontroller.getnameofaddress)
    /**
     * saveNewFatherSeedAddress  
     */
    router
        .route('/address/savenewfatherseedaddress')
        .post(multipartWare, addresscontroller.saveNewFatherSeedAddress)
    /**
     * saveNewSonSeedAddress  
     */
    router
        .route('/address/savenewsonseedaddress')
        .post(multipartWare, addresscontroller.saveNewSonSeedAddress)
    /**
     * checkIfSeedImportedAddressExists  
     */
    router
        .route('/address/checkifseedimportedaddressexists/:adr')
        .get(addresscontroller.checkIfSeedImportedAddressExists)
    /**
     * saveImportedFromPKey  
     */
    router
        .route('/address/saveimportedfrompkey')
        .post(multipartWare, addresscontroller.saveImportedFromPKey)
    /**
     * saveContractsForAddress  
     */
    router
        .route('/address/savecontractsforaddress')
        .post(multipartWare, addresscontroller.saveContractsForAddress)
    /**
     * getTmpContractsTx  
     */
    router
    .route('/address/getTmpContractsTx/:adr')
    .get(addresscontroller.getTmpContractsTx)
}

// saveNewFatherSeedAddress(address, chain, type, name, Linked?[ ])  // we juste created by generating seed nd addresses 
// saveNewSonSeedAddress(addressfather, addressSon, chain, type, name)  // we create sons by clicking PLUS button 
// check if address name exits....
// checkIfSeedImportedAddressExists(address, linked[]?) // return false or return whole tree of sons and linked  
// 						   // address, and names nad types and chaintypes…
                            // we use this when we want to import seed already generated. so in the case of Restore 
                            // or already a seed present and we import another one that was already existant. in that case we just
                            // import it and use it and 
                            //dont give possibility to generate from it but rather from the original seed present. 
                            // question is : if it is restore no problem appart from until which level do we get the linked i think 2 for a start. 
                            // if it is add existing from seed then u send also the main wallet that were there, then he returns all he has linked
                            //and he saves now the linked : go through all the addresses and get all corresponding _ids. a.link_list(list)  
                            //foreach link for b
// saveImportedFromPKey(address, chain, type, name, Linked?[ ] )
// saveContractsForAddress(address, contract[])