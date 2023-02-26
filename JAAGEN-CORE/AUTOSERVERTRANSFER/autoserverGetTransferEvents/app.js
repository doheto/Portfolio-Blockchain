/** require dependencies */
const express = require("express");
// const routes = require('./routes/')
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const models = require("./models");
const AnAddress = models("AnAddress");
const app = express();
const router = express.Router();
const uri =
  "mongodb+srv://joshua:atZerty12@cluster0.m0hc5nn.mongodb.net/?retryWrites=true&w=majority";
const Web3 = require("web3");
var web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://sepolia.infura.io/ws/v3/a2eb608e33044b548c65b4d555e90ee3"
  )
);
// var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'));
const Contract = models("Contract");

const ERC20TransferEventABI = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      name: "from",
      type: "address"
    },
    {
      indexed: true,
      name: "to",
      type: "address"
    },
    {
      indexed: false,
      name: "value",
      type: "uint256"
    }
  ],
  name: "Transfer",
  type: "event"
};

const ERC223TransferEventABI = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      name: "from",
      type: "address"
    },
    {
      indexed: true,
      name: "to",
      type: "address"
    },
    {
      indexed: false,
      name: "value",
      type: "uint256"
    },
    {
      indexed: true,
      name: "data",
      type: "bytes"
    }
  ],
  name: "Transfer",
  type: "event"
};

const ERC721TransferEventABI = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      name: "from",
      type: "address"
    },
    {
      indexed: true,
      name: "to",
      type: "address"
    },
    {
      indexed: true,
      name: "tokenId",
      type: "uint256"
    }
  ],
  name: "Transfer",
  type: "event"
};

const ERC777TransferEventABI = {};

const ERC20TransferEventSignature = web3.eth.abi.encodeEventSignature(
  ERC20TransferEventABI
);
const ERC223TransferEventSignature = web3.eth.abi.encodeEventSignature(
  ERC223TransferEventABI
);
const ERC721TransferEventSignature = web3.eth.abi.encodeEventSignature(
  ERC721TransferEventABI
);
// const ERC777TransferEventSignature = web3.eth.abi.encodeEventSignature(ERC777TransferEventABI);

/** connect to MongoDB datastore */
try {
  mongoose.connect(uri, function(err, client) {});
} catch (error) {
  console.log("Error connecting to MongoDB " + error);
}
let port = 5010 || process.env.PORT;

/** set up routes {API Endpoints} */
// routes(router);

/** set up middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //*
app.use(helmet());
//app.use('/static',express.static(path.join(__dirname,'static')))
// app.use('/api', router)

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

var subscription = web3.eth
  .subscribe(
    "logs",
    {
      fromBlock: web3.eth.blockNumber - 2
    },
    function(error, result) {
      if (error) {
        console.log("errors  ");
        console.dir(error);
      } else {
        if (
          result.topics[0] == ERC20TransferEventSignature &&
          result.topics.length >= 3
        ) {
          let contractAddress = result.address; //web3.eth.abi.decodeParameter('address', result.address);
          let from = web3.eth.abi.decodeParameter("address", result.topics[1]);
          let to = web3.eth.abi.decodeParameter("address", result.topics[2]);
          console.log(
            "erc20 from " + from + " to " + to + " contract " + contractAddress
          );

          // Add To TmpTrx If the Address is in our DB
          AnAddress.findOne({ addr: to.toLowerCase() }, function(
            err,
            adrsfound
          ) {
            if (adrsfound) {
              adrsfound.AddtotmpTrx(contractAddress);
              console.log("added one contract to tmptrx ");
            }
          });

          // SaveContract Address If We Do Not Have It Already As Contract
          Contract.findOne({ address: contractAddress }, function(
            err,
            ctrctfound
          ) {
            if (!ctrctfound && !err) {
              new Contract({
                address: contractAddress,
                kind: "erc20"
              }).save((err, newcontract) => {
                if (err) console.log("err contract creation" + err);
                else if (!newcontract) console.log("!newcontract ");
                else {
                  console.log(" success created new erc20 contract ");
                }
              });
            }
          });
        } else if (
          result.topics[0] == ERC223TransferEventSignature &&
          result.topics.length >= 3
        ) {
          let contractAddress = result.address; //web3.eth.abi.decodeParameter('address', result.address);
          let from = web3.eth.abi.decodeParameter("address", result.topics[1]);
          let to = web3.eth.abi.decodeParameter("address", result.topics[2]);
          console.log(
            "erc223 from " + from + " to " + to + " contract " + contractAddress
          );

          // Add To TmpTrx If the Address is in our DB
          AnAddress.findOne({ addr: to.toLowerCase() }, function(
            err,
            adrsfound
          ) {
            if (adrsfound && !err) {
              console.log("added one contract to tmptrx ");
              adrsfound.AddtotmpTrx(contractAddress);
            }
          });

          // SaveContract Address If We Do Not Have It Already As Contract
          Contract.findOne({ address: contractAddress }, function(
            err,
            ctrctfound
          ) {
            if (!ctrctfound && !err) {
              new Contract({
                address: contractAddress,
                kind: "erc223"
              }).save((err, newcontract) => {
                if (err) console.log("err contract creation" + err);
                else if (!newcontract) console.log("!newcontract ");
                else {
                  console.log(" success created new erc223 contract ");
                }
              });
            }
          });
        } else if (
          result.topics[0] == ERC721TransferEventSignature &&
          result.topics.length >= 3
        ) {
          let contractAddress = result.address; //web3.eth.abi.decodeParameter('address', result.address);
          let from = web3.eth.abi.decodeParameter("address", result.topics[1]);
          let to = web3.eth.abi.decodeParameter("address", result.topics[2]);
          console.log(
            " erc721 from " +
              from +
              " to " +
              to +
              " contract " +
              contractAddress
          );

          // Add To TmpTrx If the Address is in our DB
          AnAddress.findOne({ addr: to.toLowerCase() }, function(
            err,
            adrsfound
          ) {
            if (adrsfound && !err) {
              console.log("added one contract to tmptrx ");
              adrsfound.AddtotmpTrx(contractAddress);
            }
          });

          // SaveContract Address If We Do Not Have It Already As Contract
          Contract.findOne({ address: contractAddress }, function(
            err,
            ctrctfound
          ) {
            if (!ctrctfound && !err) {
              new Contract({
                address: contractAddress,
                kind: "erc721"
              }).save((err, newcontract) => {
                if (err) console.log("err contract creation" + err);
                else if (!newcontract) console.log("!newcontract ");
                else {
                  console.log(" success created new erc721 contract ");
                }
              });
            }
          });
        }
        // else if (log.topics[0] == ERC777TransferEventSignature ) {
        //     console.log("erc777 tokens transfer");
        // }
      }
    }
  )
  .on("data", function(log) {
    //#region
    // if (log.topics[0] == ERC20TransferEventSignature) {
    //     console.log("erc20 tokens transfer");
    //     let contractAddress = log.address; //web3.eth.abi.decodeParameter('address', log.address);
    //     let from = web3.eth.abi.decodeParameter('address', log.topics[1]);
    //     let to = web3.eth.abi.decodeParameter('address', log.topics[2]);
    //     let tokenAmount = web3.eth.abi.decodeParameter('uint256', log.topics[3]);
    //     console.log("from " + from + "to " + to + "contract " + contractAddress + "for AMount " + tokenAmount);
    //     // SaveContract Address If We Do Not Have It Already As Contract
    //     // new Contract({
    //     //     address: element.address,
    //     //     kind: "erc20",
    //     // }).save((err, newcontract) => {
    //     //     if (err)
    //     //         console.log("err contract creation" + err);
    //     //     else if (!newcontract)
    //     //         console.log("!newcontract ");
    //     //     else {
    //     //         console.log(" success created new contract ");
    //     //     }
    //     // });
    //     //if to address is in our list of address then save in tmpTrx
    // } else if (log.topics[0] == ERC223TransferEventSignature ) {
    //     console.log("erc223 tokens transfer");
    // } else if (log.topics[0] == ERC721TransferEventSignature ) {
    //     console.log("erc721 tokens transfer");
    // }
    // // else if (log.topics[0] == ERC777TransferEventSignature ) {
    // //     console.log("erc777 tokens transfer");
    // // }
    //#endregion
  });

/** start server */
app.listen(port, "localhost", () => {
  console.log(`Server started at port: ${port}`);
});
