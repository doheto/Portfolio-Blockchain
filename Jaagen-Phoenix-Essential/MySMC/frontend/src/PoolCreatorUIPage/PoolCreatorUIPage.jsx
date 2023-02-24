//#region IMPORTS
import React, { Component } from 'react';
import { WithAuthorization } from '../_components';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { route } from '../_constants';
import { fetchAddress } from '../_actions';
import { apoolABI, erc20ABI } from '../_constants';
import { withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { fetchCurrentPool } from '../_actions';
import * as Cookies from "js-cookie";
import * as axios from 'axios';
import { v1, v4 } from 'uuid';
//#endregion

//#region SOME GLOBAL VARS
//the key value is used as dynamic key to allocate the actual value in the local state object
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});
let cookiesvalue = Cookies.get('default.wallets.com.smc.wwww');
let web3Local = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));
//check if valid address and then add to cookie and then 
//set it to walletAddress voila

//if walletAddress is ok then we continue the process
var ASSOCIATED_ADR = [];
//#endregion

class MyPoolUIPage extends Component {
  componentDidMount() {
    //if cookies is present then we simply set it as wallet  
    if (cookiesvalue) {
      this.setState(byPropKey('walletAddress', cookiesvalue), () => {
        // console.log("walletAddress is " + this.state.walletAddress);
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  // 1- meditation   2- practicing the word  3- giving the word first place   4- obey the voice of the SPirit



  //handle autodistribute

  handleAutoDistribute = (event) => {
    event.preventDefault();

    // save WL by webservice
    let idpool = this.state.uniqid;
    axios.post('http://localhost:5000/api/pool/adb', {
      idpool
    })
      .then((response, errorr) => {
        console.log("success adb " + response);
        // parse response and set already in progress
      })
      .catch(function (error) {
        console.log("failed adb " + error);
      });
  }

  checkTokenAvailable = (event) => {
    event.preventDefault();
    var tokenContract = new web3Local.eth.Contract(erc20ABI, this.state.contractaddress);
    console.log(this.state.contractaddress);
    var adjustedBalance = 0;
    var adr = this.state.poolAddress;
    tokenContract.methods.decimals().call().then((decimal, decimaleror) => {
      tokenContract.methods.balanceOf(adr).call()
        .then((res, err) => {
          console.log(res);
          adjustedBalance = res / Math.pow(10, decimal);
          console.log(" balance " + res + " adjustedbalance " + adjustedBalance);

          if (parseFloat(adjustedBalance) > 0) { // tokens received
            this.setState(byPropKey('tokenAvailable', true), () => {
            });
            this.setState(byPropKey('instantNewTokenReceived', parseFloat(adjustedBalance)), () => {
            });
          } else {
            this.setState(byPropKey('tokenAvailable', false), () => {  // tokens not received
            });
          }
          this.setState(byPropKey('lastMoreDropCheck', "Last Check : " + Date() + " Amount Received : " + this.state.instantNewTokenReceived), () => {
          });
        });
    });
  }

  checkTokenAvailableInManualMode = (event) => {
    event.preventDefault();
    var tokenContract = new web3Local.eth.Contract(erc20ABI, this.state.contractaddress);
    var adjustedBalance = 0;
    var adr = this.state.poolAddress;
    tokenContract.methods.decimals().call().then((decimal, decimaleror) => {
      tokenContract.methods.balanceOf(this.state.poolAddress).call()
        .then((res, err) => {
          console.log(res);
          adjustedBalance = res / Math.pow(10, decimal);
          console.log(" balance " + res + " adjustedbalance " + adjustedBalance);
          var supposedBalance = this.state.tokenReceivedAmount - this.state.tokenWithdrawnAmount;
          //if there is new drop then currentTokenBalance is greater than supposedBalance
          if (parseFloat(adjustedBalance) > parseFloat(supposedBalance)) {

            this.setState(byPropKey('instantNewTokenReceived', parseFloat(adjustedBalance) - parseFloat(supposedBalance)), () => {
            });
            this.setState(byPropKey('step', 16), () => {
            });

            let newDropOfTokensABI = "";
            aloop:
            for (let item of apoolABI) {
              if (item.name === "newDropOfTokens") {
                newDropOfTokensABI = item;
                break aloop;
              }
            }

            var dataToCallnewDropOfTokens = web3Local.eth.abi.encodeFunctionCall(newDropOfTokensABI, [this.state.contractaddress]);
            this.setState(byPropKey('dataToCallnewDropOfTokens', dataToCallnewDropOfTokens), () => {
              console.log(this.state.dataToCallnewDropOfTokens);
            });
            web3Local.eth.estimateGas({
              from: this.state.walletAddress,
              to: this.state.poolAddress,
              data: dataToCallnewDropOfTokens,
              // value: this.state.personalContribution,
            }).then((res, err) => {
              if (res) {
                this.setState(byPropKey('gasToCallnewDropOfTokens', res), () => {
                  console.log("GAS TO USE " + this.state.gasToCallnewDropOfTokens + " RES " + res);
                });
              }
              if (err) {
                console.log("err " + err);
              }
            }).catch(error => console.log("exception msg error  " + error));
            // new drops have been received sooooo we launch the plan to call contract function : newDropOfTokens
          } else {
            // we say no new drop 
            this.setState(byPropKey('step', 15), () => {  // tokens not received
            });
          }
          this.setState(byPropKey('lastMoreDropCheck', "Last Check : " + Date() + " Amount Received : " + this.state.instantNewTokenReceived), () => {
          });
        });
    });
  }

  //handle creation of the whitelist
  handleCreateWhitelist = (event) => {
    event.preventDefault();
    // here all you have to do is moving to the page where admin enters all the addresses
    this.setState(byPropKey('step', 10), () => {
    });
  }

  handleDisableWhitelist = (event) => {
    event.preventDefault();
    // here all you have to do is moving to the page where admin enters all the addresses
    this.setState(byPropKey('step', 12), () => {
    });
  }

  handleEditWhitelist = (event) => {
    event.preventDefault();
    this.setState(byPropKey('whitelistEditMode', true), () => {
    });
    this.setState(byPropKey('step', 13), () => {
    });
  }


  //handle text Area of the whitelist
  handleTextAreaWLChange = (newValue, actionMeta) => {
    this.setState(byPropKey('textareavalue', newValue.target.value), () => {
      // here all you have to do is moving to the page where admin enters all the addresses
      let arr1 = this.state.textareavalue.trim();
      let arr = arr1.split(/\s+/g);
      arr.some((s, index) => {
        this.setState(byPropKey('continueSendWhitelist', false), () => { });
        this.setState(byPropKey('elementNotValidAddress', ''), () => { });
        this.setState(byPropKey('whitelist', arr), () => { });
        if (s != '\n' && s.length > 0 && !Web3.utils.isAddress(s)) {
          this.setState(byPropKey('continueSendWhitelist', true), () => { });
          this.setState(byPropKey('elementNotValidAddress', s), () => { });
          return true;
        }
      });
    });
  }

  //handle text Area of the whitelist
  handleTextAreaWLEditChange = (newValue, actionMeta) => {
    this.setState(byPropKey('textareavalueEdit', newValue.target.value), () => {
      // here all you have to do is moving to the page where admin enters all the addresses
      let arr1 = this.state.textareavalueEdit.trim();
      let arr = arr1.split(/\s+/g);
      arr.some((s, index) => {
        this.setState(byPropKey('continueSendWhitelistEdit', false), () => { });
        this.setState(byPropKey('elementNotValidAddressEdit', ''), () => { });
        this.setState(byPropKey('whitelist', arr), () => { });
        if (s != '\n' && s.length > 0 && !Web3.utils.isAddress(s)) {
          this.setState(byPropKey('continueSendWhitelistEdit', true), () => { });
          this.setState(byPropKey('elementNotValidAddressEdit', s), () => { });
          return true;
        }
      });
    });
  }

  handleValidateWhitelist = (event) => {
    event.preventDefault();
    // here all you have to do is moving to the page where gas details plus data details for transaction is shown
    // but before generate the secret phrase
    let wor = v1();
    // then do all the things to generate data with bool to true
    let WLABI = "";
    aloop:
    for (let item of apoolABI) {
      if (item.name === "setw") {
        WLABI = item;
        break aloop;
      }
    }

    let dataToCallWL = web3Local.eth.abi.encodeFunctionCall(WLABI, [true, wor]);
    this.setState(byPropKey('dataToCallWL', dataToCallWL), () => {
      console.log(this.state.dataToCallWL);
    });
    web3Local.eth.estimateGas({
      from: this.state.walletAddress,
      to: this.state.poolAddress,
      data: dataToCallWL,
      // value: this.state.personalContribution,
    }).then((res, err) => {
      if (res) {
        this.setState(byPropKey('gasToCallWL', res), () => {
          console.log("GAS TO USE " + this.state.gasToCallWL + " RES " + res);
        });
      }
      if (err) {
        console.log("err " + err);
      }
    }).catch(error => console.log("exception msg error  " + error));

    // save WL by webservice
    let wl = this.state.whitelist;
    axios.post('http://localhost:5000/api/pool/wl/'.concat(this.state.poolAddress), {
      wl
    })
      .then(function (response) {
        console.log("success send " + response);
      })
      .catch(function (error) {
        console.log("failed send " + error);
      });


    this.setState(byPropKey('step', 11), () => {
    });
  }

  handleValidateWhitelistEdit = (event) => {
    event.preventDefault();

    // save WL by webservice
    let wl = this.state.whitelist;
    axios.post('http://localhost:5000/api/pool/wl/'.concat(this.state.poolAddress), {
      wl
    })
      .then(function (response) {
        console.log("success send " + response);
      })
      .catch(function (error) {
        console.log("failed send " + error);
      });
    this.setState(byPropKey('whitelistEditMode', false), () => {
    });
    this.setState(byPropKey('step', 14), () => {
    });
  }


  handleValidateDisableWhitelist = (event) => {
    event.preventDefault();
    // here all you have to do is moving to the page where gas details plus data details for transaction is shown
    // but before generate the secret phrase
    let wor = '';
    // then do all the things to generate data with bool to true
    let WLABI = "";
    aloop:
    for (let item of apoolABI) {
      if (item.name === "setw") {
        WLABI = item;
        break aloop;
      }
    }

    let dataToCallWL = web3Local.eth.abi.encodeFunctionCall(WLABI, [false, wor]);
    this.setState(byPropKey('dataToCallWL', dataToCallWL), () => {
      console.log(this.state.dataToCallWL);
    });
    web3Local.eth.estimateGas({
      from: this.state.walletAddress,
      to: this.state.poolAddress,
      data: dataToCallWL,
      // value: this.state.personalContribution,
    }).then((res, err) => {
      if (res) {
        this.setState(byPropKey('gasToCallWL', res), () => {
          console.log("GAS TO USE " + this.state.gasToCallWL + " RES " + res);
        });
      }
      if (err) {
        console.log("err " + err);
      }
    }).catch(error => console.log("exception msg error  " + error));

    // save WL by webservice
    this.setState(byPropKey('whitelist', []), () => {
    });
    let wl = [];
    axios.post('http://localhost:5000/api/pool/wl/'.concat(this.state.poolAddress), {
      wl
    })
      .then(function (response) {
        console.log("success send " + response);
      })
      .catch(function (error) {
        console.log("failed send " + error);
      });


    this.setState(byPropKey('step', 11), () => {
    });
  }

  handleCancelWhitelist = (event) => {
    event.preventDefault();
    this.setState(byPropKey('step', 0), () => {
    });
  }

  // from open u can go to either cancel or Paid
  // from cancel no other state possible
  // from paid u can go to either token receive or Refund
  // from token receive just receive token or autodistribute
  // from refund (you take all fee and gas change )
  //////button left 
  handleButton1 = (event) => {
    event.preventDefault();
    if (this.state.poolStatusPossibility1.valueOf() == "Pay") { // if pay to 
      // display page where the destination address is entered for verification 
      // then next 
      // then details on what to pay : gas... 
      this.setState(byPropKey('step', 2), () => {
      });
    } else if (this.state.poolStatusPossibility1.valueOf() == 'tokensreceived') {
      this.setState(byPropKey('step', 7), () => {
      });
    } else {
    }
  }
  //renaud de gedeon 0164858452

  handleSendToDeposit = (event) => {
    event.preventDefault();
    this.setState(byPropKey('step', 3), () => {
    });

    let payToABI = "";
    aloop:
    for (let item of apoolABI) {
      if (item.name === "payTo") {
        payToABI = item;
        break aloop;
      }
    }

    var dataToCallPayToDeposit = web3Local.eth.abi.encodeFunctionCall(payToABI, [this.state.destinationaddress]);
    this.setState(byPropKey('dataToCallPayToDeposit', dataToCallPayToDeposit), () => {
      console.log(this.state.dataToCallPayToDeposit);
    });
    web3Local.eth.estimateGas({
      from: this.state.walletAddress,
      to: this.state.poolAddress,
      data: dataToCallPayToDeposit,
      // value: this.state.personalContribution,
    }).then((res, err) => {
      if (res) {
        this.setState(byPropKey('gasToCallPayToDeposit', res), () => {
          console.log("GAS TO USE " + this.state.gasToCallPayToDeposit + " RES " + res);
        });
      }
      if (err) {
        console.log("err " + err);
      }
    }).catch(error => console.log("exception msg error  " + error));
  }

  handleContractTokensReceivedConfirmation = (event) => {
    event.preventDefault();
    var tokenContract = new web3Local.eth.Contract(erc20ABI, this.state.contractaddress);
    console.log(this.state.contractaddress);
    var adjustedBalance = 0;
    var adr = this.state.poolAddress;
    tokenContract.methods.decimals().call().then((decimal, decimaleror) => {
      tokenContract.methods.balanceOf(this.state.poolAddress).call()
        .then((res, err) => {
          console.log(res);
          console.log(err);
          console.log(this.state.poolAddress);
          console.log(adr);
          adjustedBalance = res / Math.pow(10, decimal);
          console.log(" balance " + res + " adjustedbalance " + adjustedBalance);


          if (parseFloat(adjustedBalance) > 0) { // tokens received
            this.setState(byPropKey('instantNewTokenReceived', parseFloat(adjustedBalance)), () => {
            });
            this.setState(byPropKey('step', 8), () => {
            });


            let confirmTokensABI = "";
            aloop:
            for (let item of apoolABI) {
              if (item.name === "confirmTokens") {
                confirmTokensABI = item;
                break aloop;
              }
            }

            var dataToCallConfirmTokens = web3Local.eth.abi.encodeFunctionCall(confirmTokensABI, [this.state.contractaddress]);
            this.setState(byPropKey('dataToCallConfirmTokens', dataToCallConfirmTokens), () => {
              console.log(this.state.dataToCallConfirmTokens);
            });
            web3Local.eth.estimateGas({
              from: this.state.walletAddress,
              to: this.state.poolAddress,
              data: dataToCallConfirmTokens,
              // value: this.state.personalContribution,
            }).then((res, err) => {
              if (res) {
                this.setState(byPropKey('gasToCallConfirmTokens', res), () => {
                  console.log("GAS TO USE " + this.state.gasToCallConfirmTokens + " RES " + res);
                });
              }
              if (err) {
                console.log("err " + err);
              }
            }).catch(error => console.log("exception msg error  " + error));
          } else {
            this.setState(byPropKey('step', 9), () => {  // tokens not received
            });
          }
        });
    });

    // tokenContract.methods.name().call().then((res1, err1) => {
    //   console.log("name " + res1);
    // });
    // tokenContract.methods.symbol().call().then((res2, err2) => {
    //   console.log("symbol " + res2);
    // });
  }

  /////button right 
  handleButton2 = (event) => {
    event.preventDefault();
    if (this.state.poolStatusPossibility2.valueOf() == 'Cancel') {
      this.setState(byPropKey('step', 4), () => {
      });

      let cancelABI = "";
      aloop:
      for (let item of apoolABI) {
        if (item.name === "stater") {
          cancelABI = item;
          break aloop;
        }
      }

      var dataToCallCancel = web3Local.eth.abi.encodeFunctionCall(cancelABI, [2, '0x0000000000000000000000000000000000000000']);
      this.setState(byPropKey('dataToCallCancel', dataToCallCancel), () => {
        console.log(this.state.dataToCallCancel);
      });
      web3Local.eth.estimateGas({
        from: this.state.walletAddress,
        to: this.state.poolAddress,
        data: dataToCallCancel,
        // value: this.state.personalContribution,
      }).then((res, err) => {
        if (res) {
          this.setState(byPropKey('gasToCallCancel', res), () => {
            console.log("GAS TO USE " + this.state.gasToCallCancel + " RES " + res);
          });
        }
        if (err) {
          console.log("err " + err);
        }
      }).catch(error => console.log("exception msg error  " + error));

    } else if (this.state.poolStatusPossibility2.valueOf() == 'refund') {
      this.setState(byPropKey('step', 5), () => {
      });
    }
    else {
      this.setState(byPropKey('step', 2), () => {
      });
    }
  }

  handleSendToRefund = (event) => {
    event.preventDefault();
    this.setState(byPropKey('step', 6), () => {
    });

    let refundABI = "";
    aloop:
    for (let item of apoolABI) {
      if (item.name === "stater") {
        refundABI = item;
        break aloop;
      }
    }

    var dataToCallRefund = web3Local.eth.abi.encodeFunctionCall(refundABI, [5, this.state.refundaddress]);
    this.setState(byPropKey('dataToCallRefund', dataToCallRefund), () => {
      console.log(this.state.dataToCallRefund);
    });
    web3Local.eth.estimateGas({
      from: this.state.walletAddress,
      to: this.state.poolAddress,
      data: dataToCallRefund,
      // value: this.state.personalContribution,
    }).then((res, err) => {
      if (res) {
        this.setState(byPropKey('gasToCallRefund', res), () => {
          console.log("GAS TO USE " + this.state.gasToCallRefund + " RES " + res);
        });
      }
      if (err) {
        console.log("err " + err);
      }
    }).catch(error => console.log("exception msg error  " + error));
  }

  /////
  componentWillReceiveProps(nextProps) {

    if (nextProps.currentPool.currentpool) {

      //Make sure that the current connected user is the owner of the pool before displaying it 
      if (!this.state.isWalletAddressInAdminsWallet) {
        const { address } = this.props;
        ASSOCIATED_ADR = [];
        if (address.address) {
          // do we have a walletAddress ? meaning cookie 
          // if yes then we verify that this address is in the associated address  
          // if it is in then we verify it is in the admins address
          // if yes then we set cookie and walletaddress and isWalletAddressInAdminsWallet
          if (this.state.walletAddress.length > 0 && Web3.utils.isAddress(this.state.walletAddress)) {
            // console.log("found1.... " + this.state.walletAddress);
            thisloop1:
            for (let element of address.address) {
              ASSOCIATED_ADR.push({ value: element.addr, label: element.addr });
              if (element.addr.valueOf() == this.state.walletAddress.valueOf()) {
                for (let elt of nextProps.currentPool.currentpool.adminsaddress) {
                  if (this.state.walletAddress.valueOf() == elt.addr.valueOf()) {
                    Cookies.remove('default.wallets.com.smc.wwww');
                    // console.log("found1 2 " + this.state.walletAddress);
                    Cookies.set('default.wallets.com.smc.wwww', this.state.walletAddress);
                    this.setState(byPropKey('isWalletAddressInAdminsWallet', true), () => {
                    });
                    break thisloop1;
                  }
                }
              }
            }
          }
          if (!this.state.isWalletAddressInAdminsWallet) { // if not then we compare directly the first associated addr matching admin is set as walletAddress and cookie
            thisloop:
            for (let element of address.address) {
              ASSOCIATED_ADR.push({ value: element.addr, label: element.addr });
              for (let elt of nextProps.currentPool.currentpool.adminsaddress) {
                // console.log("element of adr.adr " + element.addr + " elt of currentpool.adminsaddress  " + elt.addr);
                if (element.addr.length > 0 && element.addr.valueOf() == elt.addr.valueOf()) {
                  Cookies.remove('default.wallets.com.smc.wwww');
                  this.setState(byPropKey('walletAddress', element.addr), () => {
                    // console.log(element.addr);
                    // console.log("found2 " + this.state.walletAddress);
                    console.log("setting cookie");
                    Cookies.set('default.wallets.com.smc.wwww', element.addr);
                    this.setState(byPropKey('isWalletAddressInAdminsWallet', true), () => {
                      // console.log("isWalletAddressInAdminsWallet 2 ... " + this.state.isWalletAddressInAdminsWallet);
                      if (!this.state.isWalletAddressInAdminsWallet) {
                        // console.log("isWalletAddressInAdminsWallet not found at all .. removing cookie");
                        Cookies.remove('default.wallets.com.smc.wwww');
                        this.setState(byPropKey('walletAddress', ''), () => { });
                      }
                    });
                  });
                  break thisloop;
                }
              }
            }
          }
        }
      }

      if (!this.state.whitelistEditMode) {
        this.setState(byPropKey('whitelisttmp', nextProps.currentPool.currentpool.whitelist), () => {
        });
      }

      this.setState(byPropKey('refundedAmount', nextProps.currentPool.currentpool.refundedAmount), () => {
      });
      this.setState(byPropKey('WithdrawnAmountRefund', nextProps.currentPool.currentpool.WithdrawnAmountRefund), () => {
      });
      this.setState(byPropKey('numberOfRefundsDone', nextProps.currentPool.currentpool.numberOfRefundsDone), () => {
      });
      this.setState(byPropKey('refundautodistributionInProgress', nextProps.currentPool.currentpool.refundautodistributionInProgress), () => {
      });


      this.setState(byPropKey('whitelistState', nextProps.currentPool.currentpool.whitelistrequired), () => {
      });
      this.setState(byPropKey('uniqid', nextProps.currentPool.currentpool.uniqid), () => {
      });
      this.setState(byPropKey('tokenReceivedAmount', nextProps.currentPool.currentpool.tokenReceivedAmount), () => {
      });
      this.setState(byPropKey('tokenWithdrawnAmount', nextProps.currentPool.currentpool.tokenWithdrawnAmount), () => {
      });

      this.setState(byPropKey('poolStatusGlobal', nextProps.currentPool.currentpool.state), () => {
      });
      this.setState(byPropKey('poolCurrentRaised', nextProps.currentPool.currentpool.currentlyraised), () => {
      });
      this.setState(byPropKey('amountReceivedByAdmin', nextProps.currentPool.currentpool.amountReceivedByAdmin), () => {
      });
      this.setState(byPropKey('amountSentToDestination', nextProps.currentPool.currentpool.amountSentToDestination), () => {
      });
      this.setState(byPropKey('poolTotalAllocation', Web3.utils.fromWei(nextProps.currentPool.currentpool.total)), () => {
      });

      this.setState(byPropKey('poolCurrentNumberOfRaisers', nextProps.currentPool.currentpool.contributors.length), () => { });
      this.setState(byPropKey('poolStatusPossibility2', nextProps.currentPool.currentpool.adminPossibleAction2), () => { });
      if (nextProps.currentPool.currentpool.adminPossibleAction2.valueOf() == 'Cancel') {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
        });
      } if (nextProps.currentPool.currentpool.state.valueOf() == "paid") {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
        });
      } if (nextProps.currentPool.currentpool.state.valueOf() == "cancelled") {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
        });
      } if (nextProps.currentPool.currentpool.state.valueOf() == "refund") {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
        });
      }
      if (nextProps.currentPool.currentpool.state.valueOf() == "tokensreceived") {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
        });
        this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
        });
      }


      this.setState(byPropKey('mytransactions', nextProps.currentPool.currentpool.contributors), () => {
      });

      this.setState(byPropKey('poolCurrentRaisedPercentage', ((this.state.poolCurrentRaised * 100) / nextProps.currentPool.currentpool.total)), () => {
      });

      this.setState(byPropKey('maxPerContributor', Web3.utils.fromWei(nextProps.currentPool.currentpool.maxcontribution)), () => {
      });
      this.setState(byPropKey('minPerContributor', Web3.utils.fromWei(nextProps.currentPool.currentpool.mincontribution)), () => {
      });

      this.setState(byPropKey('poolAddress', nextProps.currentPool.currentpool.address), () => {
      });

      if (nextProps.currentPool.currentpool.destinationaddress != '0x0000000000000000000000000000000000000000') {
        this.setState(byPropKey('destinationaddress', nextProps.currentPool.currentpool.destinationaddress), () => {
        });
      } else {
        this.setState(byPropKey('destinationaddress', ''), () => {
        });
      }

      this.setState(byPropKey('autodistributionNumber', nextProps.currentPool.currentpool.numberOfAutodistrib), () => {
      });
      this.setState(byPropKey('autodistributionNumberUsed', nextProps.currentPool.currentpool.numberOfAutodistribUsed), () => {
      });
      this.setState(byPropKey('autodistributionInProgress', nextProps.currentPool.currentpool.autodistributionInProgress), () => {
      });
      this.setState(byPropKey('personalContributionCREATORFEE', nextProps.currentPool.currentpool.managerFee), () => {
      });
      this.setState(byPropKey('personalContributionSERVICEFEE', (nextProps.currentPool.currentpool.serviceFeePercentage / 100).toFixed(2)), () => {
      });

      this.setState(byPropKey('poolStatusPossibility1', nextProps.currentPool.currentpool.adminPossibleAction1), () => {
        // console.dir(this.state.poolStatusPossibility1);
        if (nextProps.currentPool.currentpool.adminPossibleAction1.valueOf() == "Pay") {
          if (this.state.poolCurrentRaised.toFixed(2) > 0) {
            this.setState(byPropKey('ispoolStatusPossibility1Disabled', false), () => { });
          } else {
            this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => { });
          }
        } if (nextProps.currentPool.currentpool.state.valueOf() == "paid") {
          this.setState(byPropKey('ispoolStatusPossibility1Disabled', false), () => { });
        } if (nextProps.currentPool.currentpool.state.valueOf() == "cancelled") {
          this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
          });
        } if (nextProps.currentPool.currentpool.state.valueOf() == "refund") {
          this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
          });
        }

      });

      if (nextProps.currentPool.currentpool.state.valueOf() == "refund") {
        this.setState(byPropKey('EthReceivedForRefund', nextProps.currentPool.currentpool.refundedAmount), () => {
        });
      }
    }
  }

  // changing the wallet displayed to manage the pool
  handleChangeWallet = (newValue, actionMeta) => {
    // this.setState(byPropKey('walletAddress', newValue.target.value), () => {
    // });
    // if (newValue.target.value.length > 0 && Web3.utils.isAddress(newValue.target.value)) {
    //   Cookies.remove('default.wallets.com.smc.wwww');
    //   this.setState(byPropKey('walletAddress', newValue.target.value), () => {
    //     console.log("setting cookie");
    //     Cookies.set('default.wallets.com.smc.wwww', this.state.walletAddress);
    //     // this.setState(byPropKey('isNotPresentOrInvalid', false), () => {
    //     //   console.log("isNotPresentOrInvalid is " + this.state.isNotPresentOrInvalid);
    //     // });
    //   });
    // }
  }

  constructor(props) {
    super(props);
    //getting current user associated addresses
    this.props.dispatch(fetchAddress());
    // getting all details about currentpool
    this.props.dispatch(fetchCurrentPool(props.match.params.poolid));

    this.interval = setInterval(
      () => {
        this.props.dispatch(fetchCurrentPool(props.match.params.poolid));
      }
      , 60000);

    this.state = {
      //isNotPresentOrInvalid: true,
      poolTitle: 'Pool Title Def Valededede Edit',
      tokenReceivedAmount: 0,
      tokenWithdrawnAmount: 0,
      instantNewTokenReceived: 0,
      refundedAmount:0,
      WithdrawnAmountRefund:0,
      numberOfRefundsDone:0,
      refundautodistributionInProgress:false,
      walletAddress: '',
      uniqid: props.match.params.uniqid,
      isWalletAddressInAdminsWallet: false,
      poolDescription: 'Pool Descriptiondedede Def Val',
      currency: props.match.params.currency,
      personalContribution: 0,
      personalContributionCREATORFEE: 0,
      personalContributionSERVICEFEE: 0,
      poolStatusPossibility1: '',
      ispoolStatusPossibility1Disabled: false,
      poolStatusPossibility2: '',
      ispoolStatusPossibility2Disabled: false,
      poolStatusGlobal: '',
      lastMoreDropCheck: 'euhmm ... Never ',
      poolCurrentRaised: '',
      amountSentToDestination: '',
      amountReceivedByAdmin: '',
      poolCurrentNumberOfRaisers: '',
      poolCurrentRaisedPercentage: '',
      poolCreatedBy: 'G Def Value',
      poolTotalAllocation: '',
      maxPerContributor: '',
      currentmaxPerContributor: '',
      minPerContributor: '',
      fees: '',
      kycActivated: 'false default',
      autodistributionNumber: 0,
      autodistributionNumberUsed: 0,
      autodistributionInProgress: true,
      tokenAvailable: false,
      poolAddress: '',
      mytransactions: [],
      poolid: props.match.params.poolid,
      error: null,
      askaddress: false,
      step: 0,
      personalContributionToBe: 0,
      destinationaddress: '',
      refundaddress: '',
      contractaddress: '',
      dataToCallPayToDeposit: '',
      dataToCallConfirmTokens: '',
      dataToCallnewDropOfTokens: '',
      dataToCallCancel: '',
      dataToCallRefund: '',
      dataToCallWL: '',
      gasToCallPayToDeposit: 0,
      gasToCallCancel: 0,
      gasToCallConfirmTokens: 0,
      gasToCallnewDropOfTokens: 0,
      gasToCallRefund: 0,
      gasToCallWL: 0,
      EthReceivedForRefund: 0,
      whitelistState: false,
      whitelist: [],
      whitelisttmp: [],
      whitelistEditMode: false,
      textareavalue: '',
      continueSendWhitelist: false,
      elementNotValidAddress: '',
      continueSendWhitelistEdit: false,
      elementNotValidAddressEdit: '',
      textareavalueEdit: '',
    };
  }
  // toutes les choses qui font que deux personnes sortent ensemble il ny avait rien de tt ca
  // pas de jeu , pas de discussion, des discussions plates
  render() {
    //#region init state
    const {
      poolTitle,
      // isNotPresentOrInvalid,
      refundedAmount,
      WithdrawnAmountRefund,
      numberOfRefundsDone,
      refundautodistributionInProgress,
      walletAddress,
      tokenReceivedAmount,
      tokenWithdrawnAmount,
      uniqid,
      instantNewTokenReceived,
      isWalletAddressInAdminsWallet,
      poolDescription,
      currency,
      dataToCallConfirmTokens,
      dataToCallnewDropOfTokens,
      personalContribution,
      personalContributionCREATORFEE,
      personalContributionSERVICEFEE,
      poolStatusPossibility1,
      ispoolStatusPossibility1Disabled,
      poolStatusPossibility2,
      ispoolStatusPossibility2Disabled,
      poolStatusGlobal,
      poolCurrentRaised,
      amountSentToDestination,
      amountReceivedByAdmin,
      poolCurrentNumberOfRaisers,
      poolCurrentRaisedPercentage,
      poolCreatedBy,
      poolTotalAllocation,
      maxPerContributor,
      currentmaxPerContributor,
      minPerContributor,
      fees,
      kycActivated,
      autodistributionNumber,
      autodistributionNumberUsed,
      autodistributionInProgress,
      tokenAvailable,
      poolAddress,
      mytransactions,
      poolid,
      error,
      askaddress,
      step,
      personalContributionToBe,
      destinationaddress,
      refundaddress,
      contractaddress,
      dataToCallPayToDeposit,
      dataToCallCancel,
      dataToCallRefund,
      dataToCallWL,
      gasToCallPayToDeposit,
      gasToCallCancel,
      gasToCallConfirmTokens,
      gasToCallnewDropOfTokens,
      gasToCallRefund,
      gasToCallWL,
      EthReceivedForRefund,
      whitelistState,
      whitelist,
      whitelisttmp,
      whitelistEditMode,
      lastMoreDropCheck,
      textareavalue,
      continueSendWhitelist,
      elementNotValidAddress,
      continueSendWhitelistEdit,
      elementNotValidAddressEdit,
      textareavalueEdit,
    } = this.state;
    //#endregion


    var regexp = /^\d+(\.\d{1,2})?$/;
    var isDestinationAddressValid = destinationaddress.length <= 0 || Web3.utils.isAddress(destinationaddress) == false || destinationaddress == '0x0000000000000000000000000000000000000000';
    var isRefundAddressValid = refundaddress.length <= 0 || Web3.utils.isAddress(refundaddress) == false || refundaddress == '0x0000000000000000000000000000000000000000';
    var isContractAddressValid = contractaddress.length <= 0 || Web3.utils.isAddress(contractaddress) == false || contractaddress == '0x0000000000000000000000000000000000000000';
    var whitelistButtonsDisabled = !(poolStatusGlobal == "open");
    var checkTokenavailableButtonDisabled = !(poolStatusGlobal == "tokensreceived");

    if (!isWalletAddressInAdminsWallet) {
      return (
        <div>u are not the owner !!</div>
      );
    }
    else {
      if (step == 0) { //the normal stuff plain page 
        // Your displayed html
        return (
          //#region JSX
          <div>
            {/* //if walletAddress is ok then we continue the process */}
            <header>
              <br></br>
              <label> Title of the pool, you can edit it if you desire </label>
              <br></br>
              <input size="50" type="text" value={poolTitle} />
              <br></br>
              <br></br>
              <div>
                <button onClick={this.handleCopyContributorLink}><span>Copy Contributor Link</span></button>
                <button onClick={this.handleContributorView}><span>Contributor View</span></button>
                <button onClick={this.handleChangeWallet}><span>Change wallet</span></button>
              </div>
            </header>
            <div>
              <section>
                <div>
                  <img />
                </div>
                <div>
                  <h3>
                    MY {currency} WALLET
                    <a target="_blank" href="https://etherscan.io/address/0x4fc046ba137c6b75e98b56cbb33ca58869cc5161">
                      {/* <img /> */}
                    </a>
                  </h3>
                  <div><em>{walletAddress}</em></div>
                </div>
              </section>

              <section>
                <div>
                  <div>
                    <h3>DESCRIPTION</h3>
                    <div>
                      <label> Description of the pool, you can edit it if you desire </label>
                      <br></br>
                      <input size="50" type="text" value={poolDescription} />
                    </div>
                  </div>
                  <br></br>
                </div>
              </section>

              <section>
                <h1>Status : {poolStatusGlobal}</h1>
                <h4>Amount Raised : {poolCurrentRaised}</h4>
                <h4>Amount Sent To Admin : {amountReceivedByAdmin}</h4>
                <h4>Number of Contributors : {poolCurrentNumberOfRaisers}</h4>
                <h4>Filled Percentage : {poolCurrentRaisedPercentage}</h4>
                <h4>Fees : </h4>
                <ul>
                  <li>Creator fees : {personalContributionCREATORFEE} %</li>
                  <li>Service fees : {personalContributionSERVICEFEE} %</li>
                </ul>

                {poolStatusGlobal == "refund" ? (
                  <div>
                    <h4>REFUND DETAILS</h4>
                    <div>Refund Amount Received for the Whole pool : {EthReceivedForRefund}</div>
                  </div>
                ) : (null)}

                <div>
                  <button onClick={this.handleButton1} disabled={ispoolStatusPossibility1Disabled} style={
                    {
                      borderRadius: '4px',
                      width: '120px',
                      border: 'solid 1px #d8dde3',
                      backgroundColor: ispoolStatusPossibility1Disabled ? '#FF0000' : '#0000FF',
                    }
                  } >
                    {poolStatusPossibility1}
                  </button>
                  <button onClick={this.handleButton2} disabled={ispoolStatusPossibility2Disabled} style={
                    {
                      borderRadius: '4px',
                      width: '120px',
                      border: 'solid 1px #d8dde3',
                      backgroundColor: ispoolStatusPossibility2Disabled ? '#FF0000' : '#0000FF',
                    }
                  }>
                    {poolStatusPossibility2}
                  </button>
                </div>

                <h1>Other Details</h1>
                <h4>Pool Capacity : {poolTotalAllocation}  {currency}</h4>
                <h4>Max Per Contributor : {maxPerContributor}  {currency}</h4>
                <h4>Min Per Contributor : {minPerContributor}  {currency}</h4>
                <h4>KYC Status : {kycActivated}</h4>
                <h4>AUTO-DISTRIBUTION Status : {autodistributionNumber}</h4>
                <h4>Contract Address : {poolAddress}</h4>
                <h4>Admins : {poolCreatedBy}</h4>

              </section>

              <section>
                <h3>TRANSACTIONS</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody >
                    {mytransactions.map(mytransactions =>
                      <tr >
                        <td>{mytransactions.action}</td>
                        <td>{mytransactions.amount}</td>
                      </tr >
                    )}
                  </tbody >
                </table>
              </section>

              <section>
                <h3>WHITELIST MANAGER</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Addresses</th>
                    </tr>
                  </thead>

                  {whitelistState ? (
                    <tbody >
                      {whitelisttmp.map(x =>
                        <tr >
                          <td>{x}</td>
                        </tr >
                      )}
                      <button onClick={this.handleDisableWhitelist} disabled={whitelistButtonsDisabled} style={
                        {
                          borderRadius: '4px',
                          width: '120px',
                          border: 'solid 1px #d8dde3',
                          backgroundColor: whitelistButtonsDisabled ? '#FF0000' : '#0000FF',
                        }
                      } >
                        DISABLE WHITELIST
                      </button>

                      <button onClick={this.handleEditWhitelist} disabled={whitelistButtonsDisabled} style={
                        {
                          borderRadius: '4px',
                          width: '120px',
                          border: 'solid 1px #d8dde3',
                          backgroundColor: whitelistButtonsDisabled ? '#FF0000' : '#0000FF',
                        }
                      } >
                        EDIT WHITELIST
                      </button>

                    </tbody >
                  ) : (
                      <button onClick={this.handleCreateWhitelist} disabled={whitelistButtonsDisabled} style={
                        {
                          borderRadius: '4px',
                          width: '120px',
                          border: 'solid 1px #d8dde3',
                          backgroundColor: whitelistButtonsDisabled ? '#FF0000' : '#0000FF',
                        }
                      }>
                        CREATE WHITELIST
                    </button>
                    )
                  }

                </table>
              </section>

              <section>
                <h3>TOKEN MANAGER</h3>

                {poolStatusGlobal == "tokensreceived" ? (
                  <div>
                    <h6>Token Name : {autodistributionNumber}</h6>
                    <h6>Token Symbol : {autodistributionNumber}</h6>
                    <h6>Token  Contract Address : {autodistributionNumber}</h6>
                    <h6>Total token Received : {autodistributionNumber}</h6>
                    <h6>Total token Withdrawn : {autodistributionNumber}</h6>
                    <h6>Total token Remaining : {autodistributionNumber}</h6>

                    {autodistributionNumber > 0 ? (
                      <div>
                        <h5>TOKEN AUTODISTRIBUTE MANAGER</h5>
                        <h6>NUMBER OF AUTO-DISTRIBUTION : {autodistributionNumber}</h6>
                        <h6>NUMBER OF AUTO-DISTRIBUTION USED : {autodistributionNumberUsed}</h6>

                        {autodistributionNumber >= autodistributionNumberUsed ? (
                          <div>
                            {<button onClick={this.checkTokenAvailable} disabled={checkTokenavailableButtonDisabled} style={
                              {
                                borderRadius: '4px',
                                width: '120px',
                                border: 'solid 1px #d8dde3',
                                backgroundColor: checkTokenavailableButtonDisabled ? '#FF0000' : '#0000FF',
                              }
                            }>
                              CHECK IF MORE TOKENS ARE AVAILABLE
                                </button> }
                            <h6>{lastMoreDropCheck}</h6>
                            {tokenAvailable ? (
                              <div>
                                <h5> TOKENS ARE AVAILABLE ! Auto Distribution should start soon ! </h5>
                                {/* <button onClick={this.handleAutoDistribute}  >
                                          AUTODISTRIBUTE TOKEN
                                      </button> */}
                              </div>
                            ) : (<h5>TOKENS ARE NOT AVAILABLE</h5>)}
                            {autodistributionInProgress ? (
                              <h5>TOKEN AUTO DISTRIBUTION IN PROGRESS</h5>
                            ) : (<h5></h5>)}
                          </div>
                        ) : (
                            <div>
                              <h5>All autodistribute has been used ! User can only withdraw manually now if tokens are sent  </h5>
                              {/* <button onClick={this.checkTokenAvailableInManualMode} disabled={checkTokenavailableButtonDisabled} style={
                                {
                                  borderRadius: '4px',
                                  width: '120px',
                                  border: 'solid 1px #d8dde3',
                                  backgroundColor: checkTokenavailableButtonDisabled ? '#FF0000' : '#0000FF',
                                }
                              }>
                                CHECK IF MORE TOKENS ARE AVAILABLE
                              </button> */}
                              <h6>{lastMoreDropCheck}</h6>
                            </div>
                          )}
                      </div>
                    ) : (
                        <div>
                          <h6>Autodistribution is not activated, Manual Mode</h6>
                          <button onClick={this.checkTokenAvailableInManualMode} disabled={checkTokenavailableButtonDisabled} style={
                            {
                              borderRadius: '4px',
                              width: '120px',
                              border: 'solid 1px #d8dde3',
                              backgroundColor: checkTokenavailableButtonDisabled ? '#FF0000' : '#0000FF',
                            }
                          }>
                            CHECK IF MORE TOKENS ARE AVAILABLE
                        </button>
                          <h6>{lastMoreDropCheck}</h6>
                        </div>
                      )
                    }
                  </div>
                ) : (<h6>We are not yet in tokens received state</h6>)}
              </section>

              <section>
                <h3>REFUND MANAGER</h3>
                {poolStatusGlobal == "refund" ? (
                  <div>
                    <h6>Total sent  : {amountSentToDestination}</h6>
                    <h6>Total refund received : {refundedAmount}</h6>
                    <h6>total refund withdrawn : {WithdrawnAmountRefund}</h6>
                    <h6>number of refunds done : {numberOfRefundsDone}</h6>

                    {autodistributionNumber > 0 ? (
                      <div>
                        <h6>Automatic Refund Mode</h6>
                        <h6>NUMBER OF AUTO-DISTRIBUTION : {autodistributionNumber}</h6>
                        <h6>NUMBER OF AUTO-DISTRIBUTION USED : {autodistributionNumberUsed}</h6>

                        {autodistributionNumber >= autodistributionNumberUsed ? (
                          <div>
                            {refundautodistributionInProgress ? (
                              <h5>REFUND AUTO DISTRIBUTION IN PROGRESS</h5>
                            ) : (<h5>REFUND AUTO DISTRIBUTION NOT IN PROGRESS, so it was already done</h5>)}
                          </div>
                        ) : (
                            <h5>All autodistribute has been used ! Manual Refund Mode : inform your members to withdraw manually as refund arrive  </h5>
                          )}

                      </div>
                    ) : (<h6> Manual Refund Mode : inform your members to withdraw manually as refund arrive </h6>)}
                  </div>
                ) : (
                    <h6>we are not in refund mode</h6>
                  )}
              </section>
            </div>
          </div>
          //#endregion  
        );
      }
      else if (step == 2) { //pre final for send funds to  
        return (
          <div>
            <section>
              <label > Please enter or confirm the address receiving the funds</label>
              <input value={destinationaddress}
                onChange={event => this.setState(byPropKey('destinationaddress', event.target.value))}
                type="text"
                placeholder="destination address"
              />
              {isDestinationAddressValid ? (
                <div>Please enter a valid Address</div>
              ) : (null)}
            </section>

            <button onClick={this.handleSendToDeposit} disabled={isDestinationAddressValid}
              style={
                {
                  borderRadius: '2px',
                  width: '60px',
                  border: 'solid 1px #d8dde3',
                  backgroundColor: isDestinationAddressValid ? '#FF0000' : '#0000FF',
                }
              } >
              Submit
                </button>
          </div>
        );
      }
      else if (step == 3) { //final for send funds to 
        return (
          <div>
            Gas {gasToCallPayToDeposit}  and data {dataToCallPayToDeposit}
          </div>
        );
      }
      else if (step == 4) { //final to cancel pool 
        return (
          <div>
            <h2>A POOL CANCELLATION CAN NOT BE UNDONE, PLEASE BE SURE OF WHAT YOU ARE DOING </h2>
            <h2>IF U DO KNOW WHAT U ARE DOING PLEASE SEND TO THE POOL {poolAddress} USING FOLLOWING DETAILS </h2>
            Gas {gasToCallCancel}  and data {dataToCallCancel}
          </div>
        );
      }
      else if (step == 5) { //pre final for refunds  
        return (
          <div>
            <section>
              <label > Please enter or confirm the address sending the funds for the refund</label>
              <input value={refundaddress}
                onChange={event => this.setState(byPropKey('refundaddress', event.target.value))}
                type="text"
                placeholder="refundaddress address"
              />
              {isRefundAddressValid ? (
                <div>Please enter a valid Address</div>
              ) : (null)}
            </section>

            <button onClick={this.handleSendToRefund} disabled={isRefundAddressValid}
              style={
                {
                  borderRadius: '2px',
                  width: '60px',
                  border: 'solid 1px #d8dde3',
                  backgroundColor: isRefundAddressValid ? '#FF0000' : '#0000FF',
                }
              } >
              Submit
                </button>
          </div>
        );
      }
      else if (step == 6) { //final for refunds 
        return (
          <div>
            Gas {gasToCallRefund}  and data {dataToCallRefund}
          </div>
        );
      }
      else if (step == 7) { //pre final for tokensreceived  
        return (
          <div>
            <section>
              <label > Please enter or confirm the contract address of the tokens received. Please make sure that the tokens have indeed been received</label>
              <input value={contractaddress}
                onChange={event => this.setState(byPropKey('contractaddress', event.target.value))}
                type="text"
                placeholder="contractaddress address"
              />
              {isContractAddressValid ? (
                <div>Please enter a valid Contract Address</div>
              ) : (null)}
            </section>

            <button onClick={this.handleContractTokensReceivedConfirmation} disabled={isContractAddressValid}
              style={
                {
                  borderRadius: '2px',
                  width: '60px',
                  border: 'solid 1px #d8dde3',
                  backgroundColor: isContractAddressValid ? '#FF0000' : '#0000FF',
                }
              } >
              Submit
                </button>
          </div>
        );
      }
      else if (step == 8) { //final for send funds to 
        return (
          <div>
            AMount of token received : {instantNewTokenReceived}  Gas {gasToCallConfirmTokens}  and data {dataToCallConfirmTokens}
          </div>
        );
      }
      else if (step == 16) { //final for send funds to 
        return (
          <div>
            New Drop received amount is : {instantNewTokenReceived}. To confirm those tokens : Gas {gasToCallnewDropOfTokens}  and data {dataToCallnewDropOfTokens}
          </div>
        );
      }
      else if (step == 9) { //final to cancel pool 
        return (
          <div>
            <h2>  Such Tokens Have not been received  </h2>
          </div>
        );
      }
      else if (step == 15) { //final to cancel pool 
        return (
          <div>
            <h2>   There is no new Drop of those tokens </h2>
          </div>
        );
      }
      else if (step == 10) { //page of entering addresses 
        return (
          <div>
            <textarea value={textareavalue} onChange={this.handleTextAreaWLChange} type="text" />
            {continueSendWhitelist ? (
              <div> {elementNotValidAddress} is not a valid {currency} Address</div>
            ) : (null)}

            <button onClick={this.handleCancelWhitelist} >
              Cancel
          </button>
            <button onClick={this.handleValidateWhitelist} disabled={continueSendWhitelist}
              style={
                {
                  borderRadius: '2px',
                  width: '60px',
                  border: 'solid 1px #d8dde3',
                  backgroundColor: continueSendWhitelist ? '#FF0000' : '#0000FF',
                }
              } >
              Submit
          </button>
          </div>
        );
      }
      else if (step == 11) { //final for send funds to 
        return (
          <div>
            Gas {gasToCallWL}  and data {dataToCallWL}
          </div>
        );
      }
      else if (step == 12) { //page of entering addresses 
        return (
          <div>
            <h4>Are You Sure ? </h4>

            <button onClick={this.handleCancelWhitelist} >
              Cancel
          </button>
            <button onClick={this.handleValidateDisableWhitelist}  >
              Disable Whitelist
          </button>
          </div>
        );
      }
      else if (step == 13) { //page of editing Whitelist 
        return (
          <div>
            <textarea defaultValue={whitelisttmp} onChange={this.handleTextAreaWLEditChange} type="text" />
            {continueSendWhitelistEdit ? (
              <div> {elementNotValidAddressEdit} is not a valid {currency} Address</div>
            ) : (null)}

            <button onClick={this.handleCancelWhitelist} >
              Cancel
          </button>
            <button onClick={this.handleValidateWhitelistEdit} disabled={continueSendWhitelistEdit}
              style={
                {
                  borderRadius: '2px',
                  width: '60px',
                  border: 'solid 1px #d8dde3',
                  backgroundColor: continueSendWhitelistEdit ? '#FF0000' : '#0000FF',
                }
              } >
              Submit
          </button>
          </div>
        );
      }
      else if (step == 14) {
        return (
          <div>
            Whitelist successfully Edited
          </div>
        );
      }
    }
  }
}


// #region PAGE CONFIGURATION
// connecting your component to the redux manager   
const mapStateToProps = (state) => ({
  state: state,
  address: state.getIn(['addressState', 'items']),//state.addressState.items,
  authUser: state.getIn(['sessionState', 'authUser']), //state.sessionState.authUser,
  currentPool: state.getIn(['currentPoolState', 'items']),//state.currentPoolState.items,
});

const authCondition = (authUser) => !!authUser; // make sure the user is authentified
const MyPoolUIPageWithRouter = withRouter(MyPoolUIPage);

const MyPoolUIPageWithAuthorization = compose(
  WithAuthorization(authCondition),
  connect(mapStateToProps) //if u had many actions, mapDispatchToProps)
)(MyPoolUIPageWithRouter);

export { MyPoolUIPageWithAuthorization as PoolCreatorUIPage };

// #endregion