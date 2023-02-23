import React, { Component } from 'react';
import { WithAuthorization } from '../_components';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { route } from '../_constants';
import { withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { apoolABI, erc20ABI } from '../_constants';
import { fetchCurrentPool } from '../_actions';
import * as Cookies from "js-cookie";
import * as axios from 'axios';
import * as util from 'ethereumjs-util';
import * as ethereumjs from 'ethereumjs-abi';
import * as Personal from 'web3-eth-personal';
//the key value is used as dynamic key to allocate the actual value in the local state object
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

let cookiesvalue = Cookies.get('default.wallets.com.smc.wwww');
let web3Local = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));
let personal = new Personal(new Web3.providers.HttpProvider('http://localhost:8545'));
let regexp = /^\d+(\.\d{1,2})?$/;
//check if valid address and then add to cookie and then 
//set it to walletAddress voila

//if walletAddress is ok then we continue the process


class MyPoolUIPage extends Component {
  componentDidMount() {
    //if cookies is present then we display main page 
    if (cookiesvalue) {
      this.setState(byPropKey('walletAddress', cookiesvalue), () => {
        // console.log("walletAddress is " + this.state.walletAddress);
      });
      // console.log("yeah cookie miam miam " + cookiesvalue);
      this.setState(byPropKey('isNotPresentOrInvalid', false), () => {
        // console.log("isNotPresentOrInvalid is " + this.state.isNotPresentOrInvalid);
      });
    }
    // if not we display the page to ask him to enter his address 
    //and we control it then display main page 
    else {
      console.log("owwww no hungerrrrr ");
      this.setState(byPropKey('isNotPresentOrInvalid', true), () => {
        // console.log("isNotPresentOrInvalid is " + this.state.isNotPresentOrInvalid);
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  //////deposit 
  handleButton1 = (event) => {
    event.preventDefault();
    this.setState(byPropKey('step', 4), () => {
    });
  }

  handleAmountToDepositClick = (event) => {
    event.preventDefault();

    if (!this.state.whitelistState) {
      // var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));

      let depositABI = "";
      for (let item of apoolABI) {
        if (item.name === "deposit") {
          depositABI = item;
        }
      }

      var dataToCallContribute = web3Local.eth.abi.encodeFunctionCall(depositABI, []);
      this.setState(byPropKey('dataToCallContribute', dataToCallContribute), () => {
        console.dir(this.state.dataToCallContribute);
      });

      web3Local.eth.estimateGas({
        from: this.state.walletAddress,
        to: this.state.poolAddress,
        data: dataToCallContribute,
        value: Web3.utils.toWei(this.state.personalContributionToBe),
      }).then((res, err) => {
        if (res) {
          this.setState(byPropKey('gasToCallContribute', res), () => {
            console.log("GAS TO USE " + this.state.gasToCallContribute + " RES " + res);
          });
        }
        if (err) {
          console.log("error " + err);
        }
      }).catch(error => console.log("exception : " + error));

    } else if (this.state.whitelistState && this.state.isUserWhitelisted) {
      let depositWlABI = "";
      for (let item of apoolABI) {
        if (item.name === "alloweddeposit") {
          depositWlABI = item;
        }
      }


      // signature determinism
      // Message to sign : contract address + address to give access
      var hash = "0x" + ethereumjs.soliditySHA3(
        ["address", "address"],
        [this.state.walletAddress, this.state.poolAddress]
      ).toString("hex");
      // () => {
      axios.post('http://localhost:5000/api/address', {hash})
        .then((response, errorres) => {
          console.log("success send ");
          // console.dir(response);
          var dataToCallContributeWL = web3Local.eth.abi.encodeFunctionCall(depositWlABI, [response.data]);
          this.setState(byPropKey('dataToCallContributeWL', dataToCallContributeWL), () => {
            console.dir(this.state.dataToCallContributeWL);
          });
          web3Local.eth.estimateGas({
            from: this.state.walletAddress,
            to: this.state.poolAddress,
            data: dataToCallContributeWL,
            value: Web3.utils.toWei(this.state.personalContributionToBe),
          }).then((res, err) => {
            if (res) {
              this.setState(byPropKey('gasToCallContributeWL', res), () => {
                console.log("GAS TO USE " + this.state.gasToCallContributeWL + " RES " + res);
              });
            }
            if (err) {
              console.log("error " + err);
            }
          }).catch(error => console.log("exception : " + error));
        })
        .catch(function (error) {
          console.log("failed send " + error);
        });
    }
    this.setState(byPropKey('step', 5), () => {
    });

  }


  // this.state.minPerContributor
  // this.state.currentmaxPerContributor
  handleAmountToDeposit = (newValue, actionMeta) => {
    this.setState(byPropKey('personalContributionToBe', newValue.target.value), () => {
    });
  }

  /////withdraw
  handleButton2 = (event) => {
    event.preventDefault();
    if (this.state.poolStatusGlobal == "refund" || this.state.poolStatusGlobal == "tokensreceived") {
      // this.setState(byPropKey('step', 5), () => {
      // });
      this.handleAmountToWithdrawClick(null);
    }
    else {
      this.setState(byPropKey('step', 2), () => {
      });
    }

  }

  handleAmountToWithdrawClick = (event) => {
    if (event != null) {
      event.preventDefault();
    }
    this.setState(byPropKey('step', 3), () => {
    });
    // var web3Local = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));
    let withdrawABI = "";
    aloop:
    for (let item of apoolABI) {
      if (item.name === "withdraw") {
        withdrawABI = item;
        break aloop;
      }
    }

    if (this.state.poolStatusGlobal == "refund") {
      var dataToCallWithdraw = web3Local.eth.abi.encodeFunctionCall(withdrawABI, [web3Local.utils.toWei(this.state.AvailableRefundAmount.toString())]);
    } else if (this.state.poolStatusGlobal == "tokensreceived") {
      var dataToCallWithdraw = web3Local.eth.abi.encodeFunctionCall(withdrawABI, [this.state.tokenavailable.toString()]);
    }
    else {
      var dataToCallWithdraw = web3Local.eth.abi.encodeFunctionCall(withdrawABI, [web3Local.utils.toWei(this.state.amountToWithdraw.toString())]);
    }

    this.setState(byPropKey('dataToCallWithdraw', dataToCallWithdraw), () => {
      console.dir(this.state.dataToCallWithdraw);
    });
    web3Local.eth.estimateGas({
      from: this.state.walletAddress,
      to: this.state.poolAddress,
      data: dataToCallWithdraw,
      // value: this.state.personalContribution,
    }).then((res, err) => {
      if (res) {
        this.setState(byPropKey('gasToCallWithdraw', res), () => {
          console.log("GAS TO USE " + this.state.gasToCallWithdraw + " RES " + res);
        });
      }
      if (err) {
        console.log("err " + err);
      }
    }).catch(error => console.log("exception msg error  " + error));
  }

  handleAmountToWithdraw = (newValue, actionMeta) => {
    if (this.state.poolStatusGlobal == "refund") {
      // this.setState(byPropKey('amountToWithdrawRefund', newValue.target.value), () => {
      //   //console.log(`new net amount:`, this.state.netamount);
      // });
    } else {
      this.setState(byPropKey('amountToWithdraw', newValue.target.value), () => {
        //console.log(`new net amount:`, this.state.netamount);
      });
    }
  }


  /////
  componentWillReceiveProps(nextProps) {

    if (nextProps.currentPool.currentpool) {

      this.setState(byPropKey('poolStatusGlobal', nextProps.currentPool.currentpool.state), () => {
        // console.dir(this.state.poolStatusGlobal); 
      });
      this.setState(byPropKey('poolCurrentRaised', nextProps.currentPool.currentpool.currentlyraised), () => {
        // console.dir(this.state.poolCurrentRaised);
      });

      this.setState(byPropKey('poolCurrentNumberOfRaisers', nextProps.currentPool.currentpool.contributors.length), () => {
      });

      this.setState(byPropKey('poolTotalAllocation', Web3.utils.fromWei(nextProps.currentPool.currentpool.total)), () => {
      });
      this.setState(byPropKey('poolCurrentRaisedPercentage', ((this.state.poolCurrentRaised * 100) / nextProps.currentPool.currentpool.total)), () => {
        // console.dir(this.state.poolCurrentRaisedPercentage);
      });

      this.setState(byPropKey('minPerContributor', Web3.utils.fromWei(nextProps.currentPool.currentpool.mincontribution)), () => {
        // console.dir(this.state.minPerContributor);
      });

      this.setState(byPropKey('maxPerContributor', Web3.utils.fromWei(nextProps.currentPool.currentpool.maxcontribution)), () => {
      });

      if ((this.state.poolTotalAllocation - this.state.poolCurrentRaised) < this.state.maxPerContributor) {
        this.setState(byPropKey('currentmaxPerContributor', (this.state.poolTotalAllocation - this.state.poolCurrentRaised).toFixed(2)), () => {
        });
      } else {
        this.setState(byPropKey('currentmaxPerContributor', Web3.utils.fromWei(nextProps.currentPool.currentpool.maxcontribution)), () => {
        });
      }

      this.setState(byPropKey('whitelistState', nextProps.currentPool.currentpool.whitelistrequired), () => {
        if (this.state.whitelistState) {
          let fnd = false;
          // check if this address is whitelisted  isUserWhitelisted
          for (let item of nextProps.currentPool.currentpool.whitelist) {
            if (item == this.state.walletAddress) {
              // console.log("this dude is wled");
              this.setState(byPropKey('isUserWhitelisted', true), () => { });
              fnd = true;
              break;
            }
          }
          if (!fnd) {
            this.setState(byPropKey('isUserWhitelisted', false), () => {
              //  console.log("this dude aint wled"); 
            });
            if (nextProps.currentPool.currentpool.state.valueOf() == "open" && this.state.poolStatusPossibility1.valueOf() == 'contribute') {
              this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
              });
            }
          }
        }
      });

      this.setState(byPropKey('poolAddress', nextProps.currentPool.currentpool.address), () => {
        // console.dir(this.state.poolAddress);
      });
      this.setState(byPropKey('autodistributionNumber', nextProps.currentPool.currentpool.numberOfAutodistrib), () => {
        // console.dir(this.state.autodistributionNumber);
      });
      this.setState(byPropKey('personalContributionCREATORFEE', nextProps.currentPool.currentpool.managerFee), () => {
        // console.dir(this.state.personalContributionCREATORFEE);
      });
      this.setState(byPropKey('personalContributionSERVICEFEE', (nextProps.currentPool.currentpool.serviceFeePercentage / 100).toFixed(2)), () => {
        // console.dir(this.state.personalContributionSERVICEFEE);
      });

      this.setState(byPropKey('poolStatusPossibility2', nextProps.currentPool.currentpool.userPossibleAction2), () => {
      });

      this.setState(byPropKey('poolStatusPossibility1', nextProps.currentPool.currentpool.userPossibleAction1), () => {
      });

      this.setState(byPropKey('maxcontrib', nextProps.currentPool.currentpool.maxcontribution), () => {
      });

      if (nextProps.currentPool.currentpool.state.valueOf() == "paid") {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
        });
        this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
        });
      }

      if (nextProps.currentPool.currentpool.state.valueOf() == "cancelled") {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
        });
        this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
        });
      }

      if (nextProps.currentPool.currentpool.state.valueOf() == "refund") {
        this.setState(byPropKey('EthReceivedForRefund', nextProps.currentPool.currentpool.refundedAmount), () => {
        });
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
        });
        this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
        });
        // we must calculate the LegalRefundAMount = balance*EthReceivedForRefund / poolCurrentRaised
        // availablerefund = LegalRefundAMount - item.RefundWithdrawn
        // then if available is > 0 then withdraw is activate 
        //if not then u know... 
        if (nextProps.currentPool.currentpool.contributors.length > 0) {
          let found = false;
          loop1:
          for (let item of nextProps.currentPool.currentpool.contributors) {
            if (item.address.addr == this.state.walletAddress) {
              this.setState(byPropKey('personalContribution', item.balance), () => {
                this.setState(byPropKey('LegalRefundAmount', ((this.state.personalContribution * this.state.EthReceivedForRefund) / this.state.poolCurrentRaised)), () => {
                  this.setState(byPropKey('AvailableRefundAmount', this.state.LegalRefundAmount - item.RefundWithdrawn), () => {
                    if (this.state.AvailableRefundAmount > 0) {
                      this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
                      })
                    }
                    else {
                      this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
                      })
                    }
                  });
                });
              });
              this.setState(byPropKey('mytransactions', item.history), () => {
                // console.dir(item.history);
              });
              found = true;
              break loop1;
            }
          }
          if (!found) {
            this.setState(byPropKey('personalContribution', 0), () => {
              this.setState(byPropKey('LegalRefundAmount', 0), () => {
              });
              this.setState(byPropKey('AvailableRefundAmount', 0), () => {
              });
              this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
              });
            });
          }
        }
        // if current raised is at 0 then disable withdraw
        if (this.state.poolStatusPossibility2.valueOf() == 'withdraw' && this.state.poolCurrentRaised.valueOf() == 0) {
          this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
          })
        }
        if (this.state.EthReceivedForRefund == 0) {
          this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
          })
        }

        // if we still have autodistrib available then deactivate the withdraw button 
        if (nextProps.currentPool.currentpool.numberOfAutodistrib-nextProps.currentPool.currentpool.numberOfAutodistribUsed > 0) {
          this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
          });
        }
      }

      if (nextProps.currentPool.currentpool.state.valueOf() == "open" || nextProps.currentPool.currentpool.state.valueOf() == "cancelled") {
        //if current raised is lower than mintocontribute in one shot then disable button 1 
        if (this.state.poolStatusPossibility1.valueOf() == 'contribute' && ((this.state.poolTotalAllocation - this.state.poolCurrentRaised) < this.state.minPerContributor)) {
          this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
          });
        }
        if (nextProps.currentPool.currentpool.contributors.length > 0) {
          let found = false;
          loop1:
          for (let item of nextProps.currentPool.currentpool.contributors) {
            if (item.address.addr == this.state.walletAddress) {
              this.setState(byPropKey('personalContribution', item.balance), () => {
                // console.log("item.balance " + item.balance);
                this.setState(byPropKey('poolStatusPossibility2', nextProps.currentPool.currentpool.userPossibleAction2), () => {
                  if (this.state.poolStatusPossibility2.valueOf() == 'withdraw' && this.state.personalContribution == 0) {
                    this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
                    })
                  } else if (this.state.poolStatusPossibility2.valueOf() == 'withdraw' && this.state.personalContribution > 0) {
                    this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
                    })
                  }
                });
              });
              this.setState(byPropKey('mytransactions', item.history), () => {
                // console.dir(item.history);
              });
              found = true;
              break loop1;
            }
          }
          if (!found) {
            this.setState(byPropKey('personalContribution', 0), () => {
              this.setState(byPropKey('poolStatusPossibility2', nextProps.currentPool.currentpool.userPossibleAction2), () => {
                this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
                });
              });
            });
          }
        }
        // if current raised is at 0 then disable withdraw
        if (this.state.poolStatusPossibility2.valueOf() == 'withdraw' && this.state.poolCurrentRaised.valueOf() == 0) {
          this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
          })
        }
      }

      if (nextProps.currentPool.currentpool.state.valueOf() == "tokensreceived") {
        this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
        });
        this.setState(byPropKey('ispoolStatusPossibility1Disabled', true), () => {
        });
        this.setState(byPropKey('tokenSymbol', nextProps.currentPool.currentpool.tokenSymbol), () => {
        });

        if (nextProps.currentPool.currentpool.contributors.length > 0) {
          let found = false;
          loop1:
          for (let item of nextProps.currentPool.currentpool.contributors) {
            if (item.address.addr == this.state.walletAddress) {
              this.setState(byPropKey('personalContribution', item.balance), () => {
                // console.log("item.balance " + item.balance);
                this.setState(byPropKey('poolStatusPossibility2', nextProps.currentPool.currentpool.userPossibleAction2), () => {
                  if (this.state.poolStatusPossibility2.valueOf() == 'withdraw tokens' && this.state.personalContribution == 0) {
                    this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
                    })
                  } else if (this.state.poolStatusPossibility2.valueOf() == 'withdraw tokens' && this.state.personalContribution > 0) {
                    let tokenLegalForWithdraw = (this.state.personalContribution * nextProps.currentPool.currentpool.tokenReceivedAmount) / nextProps.currentPool.currentpool.currentlyraised
                    let tokenavailable = tokenLegalForWithdraw - item.tokenWithdrawn;
                    if (tokenavailable > 0) {

                      //in case we still have autodistribution available then withdraw button must be disabled
                      if (nextProps.currentPool.currentpool.numberOfAutodistrib-nextProps.currentPool.currentpool.numberOfAutodistribUsed > 0) {
                        this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
                        });
                      } else {
                        this.setState(byPropKey('ispoolStatusPossibility2Disabled', false), () => {
                          this.setState(byPropKey('tokenavailable', tokenavailable), () => {
                          });
                        });
                      }
                    } else {
                      this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
                      })
                    }

                  }
                });
              });
              this.setState(byPropKey('mytransactions', item.history), () => {
                // console.dir(item.history);
              });
              found = true;
              break loop1;
            }
          }
          if (!found) {
            this.setState(byPropKey('personalContribution', 0), () => {
              this.setState(byPropKey('poolStatusPossibility2', nextProps.currentPool.currentpool.userPossibleAction2), () => {
                this.setState(byPropKey('ispoolStatusPossibility2Disabled', true), () => {
                });
              });
            });
          }
        }
      }

      this.setState(byPropKey('personalContributionCREATORPAYOUT', ((this.state.personalContribution * nextProps.currentPool.currentpool.managerFee) / 100)), () => {
        this.setState(byPropKey('personalContributionSERVICEPAYOUT', ((this.state.personalContribution * nextProps.currentPool.currentpool.serviceFeePercentage) / 1000)), () => { //serviceFeePercentage to be be divided by 10 thus /1000 instead of /100
          this.setState({ personalContributionPAYOUT: (this.state.personalContribution - (this.state.personalContributionCREATORPAYOUT + this.state.personalContributionSERVICEPAYOUT)) });
        });
      });

    }
  }

  handleChange = (newValue, actionMeta) => {
    this.setState(byPropKey('walletAddress', newValue.target.value), () => {
    });
    if (newValue.target.value.length > 0 && Web3.utils.isAddress(newValue.target.value)) {
      Cookies.remove('default.wallets.com.smc.wwww');
      this.setState(byPropKey('walletAddress', newValue.target.value), () => {
        console.log("setting cookie");
        Cookies.set('default.wallets.com.smc.wwww', this.state.walletAddress);
        this.setState(byPropKey('isNotPresentOrInvalid', false), () => {
          console.log("isNotPresentOrInvalid is " + this.state.isNotPresentOrInvalid);
        });
      });
    }
  }

  handleChangeWallet = (event) => {
    event.preventDefault();
    Cookies.remove('default.wallets.com.smc.wwww');
    this.setState(byPropKey('walletAddress', ''), () => {
      this.setState(byPropKey('isNotPresentOrInvalid', true), () => {
      });
    });
  }

  handleCreatorView = (event) => {
    event.preventDefault();

    this.props.history.push(
      {
        pathname: '/pool/creator/' + this.state.currency + '/' + this.state.poolid,
        currentstate: this.state
      });
  }

  constructor(props) {
    super(props);
    // getting all details about currentpool
    this.props.dispatch(fetchCurrentPool(props.match.params.poolid));

    this.interval = setInterval(
      () => {
        this.props.dispatch(fetchCurrentPool(props.match.params.poolid));
      }
      , 60000);

    this.state = {
      isNotPresentOrInvalid: true,
      whitelistState: false,
      isUserWhitelisted: false,
      poolTitle: 'Pool Title Def Val',
      creatorView: false,
      tokenavailable: 0,
      walletAddress: '',
      poolDescription: 'Pool Description Def Val',
      currency: props.match.params.currency,
      personalContribution: 0,
      personalContributionPAYOUT: 0,
      personalContributionCREATORPAYOUT: 0,
      personalContributionSERVICEPAYOUT: 0,
      personalContributionCREATORFEE: 0,
      personalContributionSERVICEFEE: 0,
      personalContributionGAS: 0,
      poolStatusPossibility1: '',
      ispoolStatusPossibility1Disabled: false,
      poolStatusPossibility2: '',
      ispoolStatusPossibility2Disabled: false,
      poolStatusGlobal: '',
      poolCurrentRaised: 0,
      poolCurrentNumberOfRaisers: 0,
      poolCurrentRaisedPercentage: 0,
      poolCreatedBy: 'G Def Value',
      poolTotalAllocation: 0,
      maxPerContributor: 0,
      currentmaxPerContributor: 0,
      minPerContributor: 0,
      fees: 0,
      kycActivated: 'false default',
      autodistributionNumber: '',
      poolAddress: '',
      mytransactions: [],
      poolid: props.match.params.poolid,
      error: null,
      askaddress: false,
      startupSetup: false,
      step: 0,
      dataToCallContribute: '',
      dataToCallContributeWL: '',
      gasToCallContribute: 0,
      gasToCallContributeWL: 0,
      dataToCallWithdraw: '',
      gasToCallWithdraw: 0,
      maxcontrib: 0,
      amountToWithdraw: 0,
      personalContributionToBe: 0,
      EthReceivedForRefund: 0,
      LegalRefundAmount: 0,
      AvailableRefundAmount: 0,
      tokenSymbol: '',
    };
  }

  render() {
    //#region init state
    const {
      tokenSymbol,
      whitelistState,
      isUserWhitelisted,
      poolTitle,
      creatorView,
      tokenavailable,
      isNotPresentOrInvalid,
      walletAddress,
      poolDescription,
      currency,
      personalContribution,
      personalContributionPAYOUT,
      personalContributionCREATORPAYOUT,
      personalContributionSERVICEPAYOUT,
      personalContributionCREATORFEE,
      personalContributionSERVICEFEE,
      personalContributionGAS,
      poolStatusPossibility1,
      ispoolStatusPossibility1Disabled,
      poolStatusPossibility2,
      ispoolStatusPossibility2Disabled,
      poolStatusGlobal,
      poolCurrentRaised,
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
      poolAddress,
      mytransactions,
      poolid,
      error,
      askaddress,
      step,
      dataToCallContribute,
      dataToCallContributeWL,
      gasToCallContribute,
      gasToCallContributeWL,
      dataToCallWithdraw,
      gasToCallWithdraw,
      maxcontrib,
      amountToWithdraw,
      // amountToWithdrawRefund,
      personalContributionToBe,
      EthReceivedForRefund,
      LegalRefundAmount,
      AvailableRefundAmount,
    } = this.state;
    //#endregion

    var isAddressOK = walletAddress.length > 0 &&
      Web3.utils.isAddress(walletAddress) == false;


    var isAmountToWithdrawValid = parseFloat(amountToWithdraw) < 0.05 || parseFloat(amountToWithdraw) > parseFloat(personalContribution) || !regexp.test(amountToWithdraw);
    // var isAmountToWithdrawRefundValid = parseFloat(amountToWithdrawRefund) < 0.05 || parseFloat(amountToWithdrawRefund) > parseFloat(AvailableRefundAmount) || !regexp.test(amountToWithdrawRefund);
    var isAmountToDepositValid = parseFloat(this.state.personalContributionToBe) < parseFloat(this.state.minPerContributor) || parseFloat(this.state.personalContributionToBe) > parseFloat(this.state.currentmaxPerContributor) || !regexp.test(this.state.personalContributionToBe);

    if (isNotPresentOrInvalid) {
      //#region JSX
      return (
        <div>
          <h3>Please specify a wallet</h3>
          <input
            value={walletAddress}
            onChange={this.handleChange}
            type="text"
            placeholder="your wallet address"
          />
          {isAddressOK ? (
            <div>Invalid {currency} Address</div>
          ) : (null)}
        </div>
      );
      //#endregion JSX
    }
    else {
      if (step == 0) { //the normal stuff plain page 
        // Your displayed html
        return (
          //#region JSX
          <div>
            {/* //if walletAddress is ok then we continue the process */}
            <header>
              <h1><b>{poolTitle}</b></h1>
              <div>
                <button onClick={this.handleCreatorView} ><span>Creator View</span></button>
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
                      <img />
                    </a>
                    <div><em>{walletAddress}</em></div>
                  </h3>
                </div>
              </section>

              <section>
                <div>
                  <div>
                    <h3>DESCRIPTION</h3>
                    <div>
                      <p>
                        {poolDescription}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3>MY CONTRIBUTION</h3>
                  </div>
                  <div>
                    <span>
                      <span >
                        {personalContribution}
                      </span>
                      <sup>
                        {currency}
                      </sup>
                      <div>
                        <ul>
                          <li>
                            Payout :
                          <span>
                              <span>
                                {personalContributionPAYOUT}
                              </span>
                              <span>
                                {currency}
                              </span>
                            </span>
                          </li>

                          <li>
                            Creator Fees :
                          <span>
                              <span>
                                {personalContributionCREATORPAYOUT}
                              </span>
                              <span>
                                {currency}
                              </span>
                            </span>
                          </li>

                          <li>
                            Service Fees :
                          <span>
                              <span>
                                {personalContributionSERVICEPAYOUT}
                              </span>
                              <span>
                                {currency}
                              </span>
                            </span>
                          </li>

                          <li>
                            Gas :
                          <span>
                              <span>
                                {personalContributionGAS}
                              </span>
                              <span>
                                {currency}
                              </span>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </span>
                  </div>
                  {poolStatusGlobal == "refund" ? (
                    <div>
                      <h4>REFUND DETAILS</h4>
                      <div>Refund Amount Received for the Whole pool : {EthReceivedForRefund}</div>
                      <div>Total Refund Amount : {LegalRefundAmount}</div>
                      <div>Available Refund Amount : {AvailableRefundAmount}</div>
                    </div>
                  ) : (null)}

                  {poolStatusGlobal == "tokensreceived" ? (
                    <div>
                      <h4>Tokens Distribution DETAILS</h4>
                      <div> Token Available for withdraw : {tokenavailable} {tokenSymbol}</div>
                    </div>
                  ) : (null)}

                  {whitelistState == true && isUserWhitelisted == false ? (
                    <div> <h4> You are not Whitelisted You will not be able to contribute </h4></div>
                  ) : (null)}


                  <div>
                    <div>
                      <button onClick={this.handleButton1} disabled={ispoolStatusPossibility1Disabled} style={
                        {
                          borderRadius: '2px',
                          width: '60px',
                          border: 'solid 1px #d8dde3',
                          backgroundColor: ispoolStatusPossibility1Disabled ? '#FF0000' : '#0000FF',
                        }
                      } >
                        {poolStatusPossibility1} {currency}
                      </button>
                    </div>
                    <div>
                      <button onClick={this.handleButton2} disabled={ispoolStatusPossibility2Disabled} style={
                        {
                          borderRadius: '2px',
                          width: '60px',
                          border: 'solid 1px #d8dde3',
                          backgroundColor: ispoolStatusPossibility2Disabled ? '#FF0000' : '#0000FF',
                        }
                      }>
                        {poolStatusPossibility2} {currency}
                      </button>
                    </div>
                  </div>

                </div>
              </section>

              <section>
                <h1>Status : {poolStatusGlobal}</h1>
                <h4>Amount Raised : {poolCurrentRaised}</h4>
                <h4>Number of Contributors : {poolCurrentNumberOfRaisers}</h4>
                <h4>Filled Percentage : {poolCurrentRaisedPercentage}</h4>
                <h4>Created By : {poolCreatedBy}</h4>

                <h4>Pool Capacity : {poolTotalAllocation}  {currency}</h4>
                <h4>Max Per Contributor : {maxPerContributor}  {currency}</h4>
                <h4>Min Per Contributor : {minPerContributor}  {currency}</h4>
                <h4>Fees : </h4>
                <ul>
                  <li>Creator fees : {personalContributionCREATORFEE} %</li>
                  <li>Service fees : {personalContributionSERVICEFEE} %</li>
                </ul>
                <h4>KYC Status : {kycActivated}</h4>
                <h4>AUTO-DISTRIBUTION Status : {autodistributionNumber}</h4>
                <h4>Contract Address : {poolAddress}</h4>
              </section>

              <section>
                <h3>My TRANSACTIONS</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody >
                    {mytransactions.map(mytransactions =>
                      <tr>
                        <td>{mytransactions.action}</td>
                        <td>{mytransactions.amount}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>


            </div>
          </div>
          //#endregion  
        );
      } else if (step == 4) { //pre final for deposit
        return (

          <div>
            {parseFloat(currentmaxPerContributor) > parseFloat(minPerContributor) ? (
              <div>
                <section>
                  <label > Please enter contribution amount </label>
                  <input value={personalContributionToBe}
                    onChange={this.handleAmountToDeposit}
                    type="number" max={currentmaxPerContributor} min={minPerContributor} size="10" type="number" step="0.05" />
                  {isAmountToDepositValid ? (
                    <div>Must be between {minPerContributor} eth and {currentmaxPerContributor} eth  And Must have A Maximum of 2 Decimals</div>
                  ) : (null)}
                </section>

                <button onClick={this.handleAmountToDepositClick} disabled={isAmountToDepositValid}
                  style={
                    {
                      borderRadius: '2px',
                      width: '60px',
                      border: 'solid 1px #d8dde3',
                      backgroundColor: isAmountToDepositValid ? '#FF0000' : '#0000FF',
                    }
                  } >
                  Submit
                </button>
              </div>
            ) : (
                <div>
                  Max you can contribute now is: {currentmaxPerContributor} eth and minimum per contribution is : {minPerContributor} eth. Sorry Pool is full You can not contribute anymore !
              </div>
              )}
          </div>
        );
      } else if (step == 1) { //final deposit page 
        return (
          <div>
            Gas {gasToCallContribute}  and data {dataToCallContribute}
          </div>
        );
      }
      else if (step == 5) { //final deposit page 
        return (
          <div>
            Gas {gasToCallContributeWL}  and data {dataToCallContributeWL}
          </div>
        );
      }

      else if (step == 2) { //pre final for withdraw
        return (
          <div>
            <section>
              <div>
                Amount available for withdraw : {personalContribution} eth
              </div>
              <label > Please enter the amount you want to withdraw </label>
              <input value={amountToWithdraw}
                onChange={this.handleAmountToWithdraw}
                type="number" max={personalContribution} min="0.05" size="10" type="number" step="0.05" />
              {isAmountToWithdrawValid ? (
                <div>Must be between 0.05 eth and {personalContribution} eth  And Must have A Maximum of 2 Decimals</div>
              ) : (null)}
            </section>

            <button onClick={this.handleAmountToWithdrawClick} disabled={isAmountToWithdrawValid}
              style={
                {
                  borderRadius: '2px',
                  width: '60px',
                  border: 'solid 1px #d8dde3',
                  backgroundColor: isAmountToWithdrawValid ? '#FF0000' : '#0000FF',
                }
              } >
              Submit
            </button>
          </div>
        );
      } else if (step == 3) { //final withdraw page
        return (
          <div>
            Gas {gasToCallWithdraw}  and data {dataToCallWithdraw}
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
//const MyPoolUIPageWithRouter = withRouter(MyPoolUIPage);

const MyPoolUIPageWithAuthorization = compose(
  //WithAuthorization(authCondition),
  connect(mapStateToProps) //if u had many actions, mapDispatchToProps)
)(MyPoolUIPage);

export { MyPoolUIPageWithAuthorization as PoolUIPage };

// #endregion