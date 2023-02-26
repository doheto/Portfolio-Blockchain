/** require dependencies */
const express = require("express")
const mongoose = require('mongoose')
const Contract = require('./models/Contract');

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/medium"
const uri = "mongodb+srv://scm:scm2486@mynodb-xmzfv.mongodb.net/test?retryWrites=true";

var contractsjson = require('./contracts');

const app = express()

/** connect to MongoDB datastore */
var conn = '';
try {
    conn = mongoose.connect(uri, function (err, client) {
    })
} catch (error) {
    console.log("Error connecting to MongoDB " + error)
}
let port = 5001 || process.env.PORT




contractsjson.contracts.forEach(element => {
    new Contract({
        address: element.address,
        symbol: element.symbol,
        decimal: element.decimal,
        type: element.type,
    }).save((err, newcontract) => {
        if (err)
            console.log("err contract creation" + err);
        else if (!newcontract)
            console.log("!newcontract ");
        else {
            console.log(" success created new contract ");
        }
    });
});

/** start server */
app.listen(port, 'localhost', () => {
    console.log(`Server started at port: ${port}`);
    // 5250 HT 5800,25 TTC charges locatives : securite parking nettoyage du site 1000 euros par mois 7.75 / m 852 mcarres 
    //                            3 mois dde franchise et pas de reduction de loyr  63000.  75euros /m2 15%   9450 honoraires.
});