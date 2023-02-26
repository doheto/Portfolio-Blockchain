//#region IMPORTS
import lightwallet from 'eth-lightwallet';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { WithAuthorization } from '../_components';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchAddress } from '../_actions';
import { createStructuredSelector } from 'reselect';
import { route } from '../_constants';
import AddressTable from './AddressTable';
import { Spin, Alert, Button, Popconfirm, Modal, Input, Icon, Tooltip, Table, Menu, Dropdown, message, Steps, Tree } from 'antd';
import styled from 'styled-components';
import IconButton from './IconButton';
import PropTypes from 'prop-types';
import * as axios from 'axios';
// import isValidPrivate from 'ethereumjs-util';
import secp256k1 from 'secp256k1';

//#endregion  secp256k1.privateKeyVerify(privateKey);

//#region SELECTORS
import {
  makeSelectNetworkReady,
  makeSelectLoading,
  makeSelectError,
  makeSelectNetworkName,
  makeSelectBlockNumber,
  makeSelectAvailableNetworks,
  /* makeSelectCheckingBalanceDoneTime,
  makeSelectCheckingBalances,
  makeSelectCheckingBalancesError, */
  makeSelectCheckFaucetLoading,
  makeSelectCheckFaucetSuccess,
  makeSelectAskFaucetLoading,
  makeSelectAskFaucetSuccess,
  makeSelectAskFaucetError,

  makeSelectCheckingBalanceDoneTime,
  makeSelectCheckingBalances,
  makeSelectCheckingBalancesError,
  makeSelectGetExchangeRatesDoneTime,
  makeSelectGetExchangeRatesLoading,
  makeSelectGetExchangeRatesError
} from '../_selectors/headerselectors';
import {
  makeSelectItemsAddress,
  makeSelectItemsAddressLoading,
  makeSelectItemsAddressError,
} from '../_selectors/fetchAddress';
import {
  makeSelectIsShowGenerateWallet,
  makeSelectwalletNameAvailable,
  makeSelectGenerateWalletLoading,
  makeSelectGenerateWalletError,
  makeSelectSeed,
  makeSelectGenerateKeystoreLoading,
  makeSelectGenerateKeystoreError,
  makeSelectRestoreWalletError,
  makeSelectRestoreWalletErrorPK,
  makeSelectPassword,
  makeSelectIsComfirmed,
  makeSelectUserSeed,
  makeSelectUserPassword,
  makeSelectShowRestoreWallet,
  makeSelectShowRestoreWalletFromPrivKey,
  makeSelectIsShowSendToken,
  makeSelectIsShowTokenChooser,
  makeSelectAddressList,
  makeSelectAddressListLoading,
  makeSelectAddressListError,
  makeSelectAddressListMsg,
  makeSelectExchangeRates,
  makeSelectConvertTo,
  makeSelectSaveWalletLoading,
  makeSelectSaveWalletError,
  makeSelectLoadWalletLoading,
  makeSelectLoadwalletError,
  makeSelectAddressMap,
  makeSelectTokenDecimalsMap,
  makeSelectUserPK,
  makeSelectUserPasswordPK,
  makeSelectcheckingAdrIsInOurDBDone,
  makeSelectcheckingAdrIsInOurDBDonePK,
  makeSelectnameFromRestoreWalletSeed,
  makeSelectnameFromRestoreWalletPK,
  makeSelectKeystores,
  makeSelecttheaddressRestoredFromSeed,
  makeSelecttheaddressRestoredFromPK,
} from '../_selectors/homeselectors';
//#endregion

//#region ACTIONS 
import { loadNetwork, checkBalances, getExchangeRates } from '../_actions/InWalletActions';
import {
  checkWalletNameAvailable,
  generateWallet,
  generateWalletCancel,
  showRestoreWallet,
  showRestoreWalletFromPrivKey,
  // getMapOfAddress,
  restoreWalletCancel,
  restoreWalletPKCancel,
  generateKeystore,
  checkingAdrIsInOurDBDoneSwitch,
  checkingAdrIsInOurDBDoneSwitchPK,
  finalizeRestoreFromSeed,
  setNameToAddress,
  finalizeRestoreFromPK,
  changeUserSeed,
  changeUserPK,
  changeUserPassword,
  changeUserPasswordPK,
  restoreWalletFromSeed,
  restoreWalletFromPK,
  showSendToken,
  hideSendToken,
  showTokenChooser,
  hideTokenChooser,
  generateAddress,
  lockWallet,
  unlockWallet,
  selectCurrency,
  closeWallet,
  saveWallet,
  loadWallet,
} from '../_actions/InWalletActions';
//#endregion

//#region SOME INIT 

const antIconLoadingRestoreWallet = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Step = Steps.Step;

const Divatafoot = styled.div`
  margin-top: 14px;
  .ant-btn {
    margin-right: 5px;
    margin-top: 15px;
  }
`;
///-----SubHeader
const Div = styled.div`
  margin-top: 45px;
  .ant-btn {
  margin-right: 8px;
  margin-bottom: 12px;
  }

  .anticon-lock {
    color: red;
  }
  .anticon-unlock {
    color: blue;
  }
`;

///-----addressview
const Divav = styled.div`
  padding: 30px 5px 20px 10px;
  min-height: 100px;
`;

///-----other
const H1 = styled.h1`
  font-size: 22px;
  color: rgba(0, 0, 0, 0.55);
  font-weight: 400;
`;

const H2 = styled.h2`
font-size: 16px;
margin-top:30px;
color: #b9b9b9;
font-weight: 400;
`;

///-----restaure wallet
const Divr = styled.div`
  margin-top: 12px;
`;

const Spanr = styled.span`
  color: red;
  font-size: 21px;
  padding-right: 12px;
  vertical-align: sub;
`;

const Descriptionr = styled.div`
  margin-bottom: 10px;
`;
//the key value is used as dynamic key to allocate the actual value in the local state object
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});
//#endregion

//#region REGISTERED WALLETS
function ErrorRendering(props) {
  if (!props.err) {
    return null;
  }

  return <div>Error Rendering Registered Wallets ! {props.err.message}</div>;
}
function LoadingRendering(props) {
  if (!props.load) {
    return null;
  }

  return <div>Loading Registered Wallets... Done</div>;
}
function AddressesRendering(props) {
  if (!props.adr) {
    return null;
  }
  const columns = [{
    title: 'Address',
    dataIndex: 'addr',
  }];

  return (

    <Table dataSource={props.adr} columns={columns}/>
    // <tbody >
    //   {props.adr.map(anaddress =>
    //     <tr >
    //       <td>{anaddress.addr}</td>
    //     </tr >
    //   )}
    // </tbody >
  );
}
//#endregion

const { TreeNode } = Tree;
const Search = Input.Search;

//#region MODAL STEPS INIT
const generate_wallet_steps = [{
  title: 'Give a name to your wallet',
}, {
  title: 'Save your wallet details',
}];

const restore_wallet_steps = [{
  title: "Wallet Seed",
}, {
  title: 'Wallet Main Address Name',
}];

const restore_wallet_steps_pk = [{
  title: "Wallet Private Key",
}, {
  title: 'Wallets Address Name',
}];
//#endregion
class MyAccountsWalletPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchAddress());
    this.props.dispatch(loadWallet());
    this.props.dispatch(loadNetwork());
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.keystores) {
      let tmp = [];
      for (let index = 0; index < nextProps.keystores.size; index++) {
        tmp.push(nextProps.keystores.getIn([index]))
      }
      this.setState(byPropKey('mykeystores', tmp), () => {
      });
      console.dir(this.state.mykeystores);
    }

    if (nextProps.addressMap && this.state.justCreatedWallet ) {
      this.setState(byPropKey('justCreatedWallet', false), () => {
        for (var k in nextProps.addressMap) {
          if (nextProps.addressMap[k].name==this.state.NameGenerateWallet) {
              let addr = k;
              let chainType = "eth";
              let name = this.state.NameGenerateWallet;
              let linkedTo = [];
              axios.post('http://localhost:5000/api/address/savenewfatherseedaddress', {
                adr:addr,
                chain: chainType,
                name:name,
                linkedTo:linkedTo,
              })
                .then((response, errorr) => {
                  console.log("success adb " ); console.dir(response);
                  // parse response and set already in progress
                  // get through keystores, find the newly created address and associate the name 
                  // for (let index = 0; index < nextProps.keystores.size; index++) {
                  //   console.dir(nextProps.keystores.getIn([index]));
                  //   if (nextProps.keystores.getIn([index]).getAddresses().includes(addr)) {
                  //       nextProps.keystores.getIn([index]).associateNameToAddress(addr,name);
                  //       console.log("saved in ks");
                  //   } else {
                  //     console.log("couldnt save name, address/keystore doesnt exist, this should never happen normally");
                  //   }
                  // }

                })
                .catch(function (error) {
                  console.log("failed adb " + error);
                });
              break;
          }
        }
      });
    } else if (nextProps.checkingAdrIsInOurDBDone == true ){
      console.log("address has been created and we have a result  " + nextProps.nameFromRestoreWalletSeed);
      this.setState(byPropKey('isCheckingRestoredAddressOK', false), () => {
      });
      this.setState(byPropKey('theaddressRestoredFromSeed', nextProps.theaddressRestoredFromSeed), () => {
      });
      if (nextProps.nameFromRestoreWalletSeed && this.state.isCheckingRestoredAddressOK) {
        this.setState(byPropKey('nameRestoredWallet', nextProps.nameFromRestoreWalletSeed), () => {
        });
        this.setState(byPropKey('IsnameRestoredWallet', true), () => {
        });
        this.setState(byPropKey('hasFinishedToRestoreWallet', true), () => {
        });
      }
      //dispatch that we took it into account 
      this.props.dispatch(checkingAdrIsInOurDBDoneSwitch());
    } else if (nextProps.checkingAdrIsInOurDBDonePK == true ){
      console.log("PK address has been created and we have a result  " + nextProps.nameFromRestoreWalletPK);
      this.setState(byPropKey('theaddressRestoredFromPK', nextProps.theaddressRestoredFromPK), () => {
      });
      this.setState(byPropKey('isCheckingRestoredAddressPKOK', false), () => {
      });
      if (nextProps.nameFromRestoreWalletPK && this.state.isCheckingRestoredAddressPKOK) {
        this.setState(byPropKey('nameRestoredWalletPK', nextProps.nameFromRestoreWalletPK), () => {
        });
        this.setState(byPropKey('IsnameRestoredWalletPK', true), () => {
        });
        this.setState(byPropKey('hasFinishedToRestoreWalletPK', true), () => {
        });
      } 
      //dispatch that we took it into account 
      this.props.dispatch(checkingAdrIsInOurDBDoneSwitchPK());
    }
  }

  constructor(props) {
    super(props);
    this.state =
      {
        isReadyToGenerateWallet: false,
        isReadyToRestoreWallet: false,
        isReadyToRestoreWalletPK: false,
        tooltipToGenerateWallet: "wallet name",
        tooltipToRestoreWallet: "wallet name",
        tooltipToRestoreWalletPK: "wallet name",
        generateWalletStep: 0,
        restoreWalletStep: 0,
        restoreWalletStepPK: 0,
        NameGenerateWallet: "",
        NameRestoreWallet: "",
        NameRestoreWalletPK: "",
        justCreatedWallet:false,
        isUserSeedOK:false,
        isUserPKOK:false,
        isUserPwdOK:false,
        isUserPwdPKOK:false,
        isCheckingRestoredAddressOK:false,
        isCheckingRestoredAddressPKOK:false,
        hasFinishedToRestoreWallet:false,
        hasFinishedToRestoreWalletPK:false,
        nameRestoredWallet:"",
        nameRestoredWalletPK:"",
        mykeystores:"",
        IsnameRestoredWallet:false,
        IsnameRestoredWalletPK:false,
        theaddressRestoredFromSeed:"",
        theaddressRestoredFromPK:"",
      };
    // this.setState({ totalplusfee: (this.state.netamount * (1.005 + this.state.yourfee/100)).toFixed(2)});
  }

  //#region EVENTS
  onTransfer = (event) => {
    event.preventDefault();

    const { address } = this.props;

    var listofAdr = [];
    address.address.forEach(element => {
      listofAdr.push(element.addr);
    });

    this.props.history.push(
      {
        pathname: route.ACCOUNTWALLETADD,
        adr: listofAdr
      });
  }
  
  EventonLockWallet = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(lockWallet());
  }
  EventonUnlockWallet = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(unlockWallet());
  }
  EventonCloseWallet = (evt) => {
    this.props.dispatch(closeWallet());
  }
  // EventonGenerateWallet = (evt) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   this.setState(byPropKey('progressModal', 2), () => {
  //   });
  //   this.props.dispatch(generateWallet());
  // }
  // EventonShowRestoreWallet = (evt) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   this.setState(byPropKey('progressModal', 3), () => {
  //   });
  //   this.props.dispatch(showRestoreWallet());
  // }

  // this pkey
  // EventonShowRestoreWalletFromPrivKey = (evt) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   this.setState(byPropKey('progressModal', 4), () => {
  //   });
  //   this.props.dispatch(showRestoreWalletFromPrivKey());
  // }


  
  eventonGenerateKeystore = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState(byPropKey('justCreatedWallet', true), () => {
      this.props.dispatch(generateKeystore());
    });
  }

  eventonRestoreKeystore = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (this.state.IsnameRestoredWallet && this.state.restoreWalletStep == (restore_wallet_steps.length - 1)) { 
      //if we are in the case it already existed in our DB like it is a pure simple restore 
      //dispatch finalize restore  sending the name retrieved up there nameRestoredWallet_  make sure isShowRestoreWallet_ false 
      this.props.dispatch(finalizeRestoreFromSeed(this.state.nameRestoredWallet));
    } else if(!this.state.IsnameRestoredWallet && this.state.hasFinishedToRestoreWallet) {
      let addr = this.state.theaddressRestoredFromSeed;
      let name = this.state.NameRestoreWallet;
      axios.post('http://localhost:5000/api/address/savenewfatherseedaddress', {
        adr:addr,
        chain: "eth",
        name:name,
        linkedTo:[],
      })
        .then((response, errorr) => {
          console.log("success saved " ); console.dir(response);
          // parse response and set already in progress
          this.props.dispatch(finalizeRestoreFromSeed(this.state.NameRestoreWallet));
          this.props.dispatch(setNameToAddress(addr, this.state.NameRestoreWallet));
        })
        .catch(function (error) {
          console.log("failed adb " + error);
        });
    }
  }


  eventonRestoreKeystorePK = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (this.state.IsnameRestoredWalletPK && this.state.restoreWalletStepPK == (restore_wallet_steps_pk.length - 1)) { 
      //if we are in the case it already existed in our DB like it is a pure simple restore 
      //dispatch finalize restore  sending the name retrieved up there nameRestoredWallet_  make sure isShowRestoreWallet_ false 
      this.props.dispatch(finalizeRestoreFromPK(this.state.nameRestoredWalletPK));
    } else if(!this.state.IsnameRestoredWalletPK && this.state.hasFinishedToRestoreWalletPK) {
      let addr = this.state.theaddressRestoredFromPK;
      let name = this.state.NameRestoreWalletPK;
      axios.post('http://localhost:5000/api/address/savenewfatherseedaddress', {
        adr:addr,
        chain: "eth",
        name:name,
        linkedTo:[],
      })
        .then((response, errorr) => {
          console.log("success saved "); console.dir(response);
          // parse response and set already in progress
          this.props.dispatch(finalizeRestoreFromPK(this.state.NameRestoreWalletPK));
          this.props.dispatch(setNameToAddress(addr, this.state.NameRestoreWalletPK));
        })
        .catch(function (error) {
          console.log("failed adb " + error);
        });
    }
  }

  eventonGenerateWalletCancel = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(generateWalletCancel());
      this.setState(byPropKey('isReadyToGenerateWallet', false), () => {
      });
      this.setState(byPropKey('NameGenerateWallet', ""), () => {
      });
      this.setState(byPropKey('tooltipToGenerateWallet', "wallet name"), () => {
      });
      this.setState(byPropKey('generateWalletStep', 0), () => {
      });
  }
  eventonGenerateWallet = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(generateWallet());
  }

  onChangeNameGenerateWallet = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const { value } = evt.target;
    this.setState(byPropKey('isReadyToGenerateWallet', false), () => {
    });
    this.setState(byPropKey('NameGenerateWallet', value), () => {
    });

      if (/^[A-Za-z]\w*$/g.test(value) && value.length>6) {
        this.setState(byPropKey('tooltipToGenerateWallet', value), () => {
        });
        //u need to fetch here in DB
        axios.get('http://localhost:5000/api/address/isadressexist/'+value)
          .then((response, errorr) => {
            if (response.status >= 200 && response.status < 300) {
              this.setState(byPropKey('tooltipToGenerateWallet', value + " is available"), () => {
              });
              this.setState(byPropKey('isReadyToGenerateWallet', true), () => {
              });
            } else {
              this.setState(byPropKey('tooltipToGenerateWallet', value + " is not available"), () => {
              });
              this.setState(byPropKey('isReadyToGenerateWallet', false), () => {
              });
            }
          })
          .catch(function (error) {
            console.log("failed  " + error);
            this.setState(byPropKey('tooltipToGenerateWallet', value + " is not available"), () => {
            });
            this.setState(byPropKey('isReadyToGenerateWallet', false), () => {
            });
          });

      } else {
        this.setState(byPropKey('tooltipToGenerateWallet', "more than 6 letters, aA-zZ, 0-9, _"), () => {
        });
        this.setState(byPropKey('isReadyToGenerateWallet', false), () => {
        });
      }
  }

  onChangeNameRestoreWallet = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const { value } = evt.target;
    this.setState(byPropKey('hasFinishedToRestoreWallet', false), () => {
    });
    this.setState(byPropKey('NameRestoreWallet', value), () => {
    });

      if (/^[A-Za-z]\w*$/g.test(value) && value.length>6) {
        this.setState(byPropKey('tooltipToRestoreWallet', value), () => {
        });
        //u need to fetch here in DB
        axios.get('http://localhost:5000/api/address/isadressexist/'+value)
          .then((response, errorr) => {
            if (response.status >= 200 && response.status < 300) {
              this.setState(byPropKey('tooltipToRestoreWallet', value + " is available"), () => {
              });
              this.setState(byPropKey('hasFinishedToRestoreWallet', true), () => {
              });
            } else {
              this.setState(byPropKey('tooltipToRestoreWallet', value + " is not available"), () => {
              });
              this.setState(byPropKey('hasFinishedToRestoreWallet', false), () => {
              });
            }
          })
          .catch(function (error) {
            console.log("failed adb " + error);
          });

      } else {
        this.setState(byPropKey('tooltipToRestoreWallet', "more than 6 letters, aA-zZ, 0-9, _"), () => {
        });
        this.setState(byPropKey('hasFinishedToRestoreWallet', false), () => {
        });
      }
  }
  
  onChangeNameRestoreWalletPK = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const { value } = evt.target;
    this.setState(byPropKey('hasFinishedToRestoreWalletPK', false), () => {
    });
    this.setState(byPropKey('NameRestoreWalletPK', value), () => {
    });
    console.log(this.state.NameRestoreWalletPK);

      if (/^[A-Za-z]\w*$/g.test(value) && value.length>6) {
        this.setState(byPropKey('tooltipToRestoreWalletPK', value), () => {
        });
        //u need to fetch here in DB
        axios.get('http://localhost:5000/api/address/isadressexist/'+value)
          .then((response, errorr) => {
            if (response.status >= 200 && response.status < 300) {
              console.log("name is not already in use");
              this.setState(byPropKey('tooltipToRestoreWalletPK', value + " is available"), () => {
              });
              this.setState(byPropKey('hasFinishedToRestoreWalletPK', true), () => {
              });
            } else {
              console.log("name is already in use");
              this.setState(byPropKey('tooltipToRestoreWalletPK', value + " is not available"), () => {
              });
              this.setState(byPropKey('hasFinishedToRestoreWalletPK', false), () => {
              });
            }
          })
          .catch(function (error) {
            console.log("failed adb " + error);
          });

      } else {
        this.setState(byPropKey('tooltipToRestoreWalletPK', "more than 6 letters, aA-zZ, 0-9, _"), () => {
        });
        this.setState(byPropKey('hasFinishedToRestoreWalletPK', false), () => {
        });
      }
  }
  
  
  eventonRestoreWalletCancel = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(restoreWalletCancel());
      this.setState(byPropKey('restoreWalletStep', 0), () => {
      });
      this.setState(byPropKey('isReadyToRestoreWallet', false), () => {
      });
      this.setState(byPropKey('NameRestoreWallet', ""), () => {
      });
      this.setState(byPropKey('tooltipToRestoreWallet', "wallet cancel"), () => {
      });
      this.setState(byPropKey('nameRestoredWallet', ""), () => {
      });
      this.setState(byPropKey('IsnameRestoredWallet', false), () => {
      });
      this.setState(byPropKey('hasFinishedToRestoreWallet', false), () => {
      });
  }
  // this pkey
  eventonRestoreWalletPKCancel = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(restoreWalletPKCancel());
      this.setState(byPropKey('restoreWalletStepPK', 0), () => {
      });
      this.setState(byPropKey('isReadyToRestoreWalletPK', false), () => {
      });
      this.setState(byPropKey('NameRestoreWalletPK', ""), () => {
      });
      this.setState(byPropKey('tooltipToRestoreWalletPK', "wallet cancel"), () => {
      });
      this.setState(byPropKey('nameRestoredWalletPK', ""), () => {
      });
      this.setState(byPropKey('IsnameRestoredWalletPK', false), () => {
      });
      this.setState(byPropKey('hasFinishedToRestoreWalletPK', false), () => {
      });
  }
  eventonRestoreWalletFromSeed = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(restoreWalletFromSeed());
  }
  // this pkey
  eventonRestoreWalletFromPK = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(restoreWalletFromPK());
  }
  eventonChangeUserSeed = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault(); 

    if (lightwallet.keystore.isSeedValid(  (evt.target.value).replace(/^\s+|\s+$/g, '') )) { 
      this.props.dispatch(changeUserSeed(evt.target.value));

      this.setState(byPropKey('isUserSeedOK', true), () => {
        if (this.state.isUserPwdOK) {
          this.setState(byPropKey('isReadyToRestoreWallet', true), () => {
          });
        }
      });
    }
    else {
      this.setState(byPropKey('isUserSeedOK', false), () => {
          this.setState(byPropKey('isReadyToRestoreWallet', false), () => {
          });
      });
    }
  }


  // this pkey
  eventonChangeUserPK = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    var targVal = (evt.target.value).replace(/^\s+|\s+$/g, '');
    if ( secp256k1.privateKeyVerify(  Buffer.from(targVal, 'hex')      )) { 
      this.props.dispatch(changeUserPK(evt.target.value));

      this.setState(byPropKey('isUserPKOK', true), () => {
        if (this.state.isUserPwdPKOK) {
          this.setState(byPropKey('isReadyToRestoreWalletPK', true), () => {
          });
        }
      });
    }
    else {
      this.setState(byPropKey('isUserPKOK', false), () => {
          this.setState(byPropKey('isReadyToRestoreWalletPK', false), () => {
          });
      });
    }
  }

  eventonChangeUserPassword = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();

    if (evt.target.value.length>=8) {
      this.props.dispatch(changeUserPassword(evt.target.value));
      console.log(evt.target.value);
      this.setState(byPropKey('isUserPwdOK', true), () => {
        if (this.state.isUserSeedOK) {
          this.setState(byPropKey('isReadyToRestoreWallet', true), () => {
          });
        }
      });
    }
    else {
      this.setState(byPropKey('isUserPwdOK', false), () => {
          this.setState(byPropKey('isReadyToRestoreWallet', false), () => {
          });
      });
    }
  }


  eventonChangeUserPasswordPK = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();

    if (evt.target.value.length>=8) {
      this.props.dispatch(changeUserPasswordPK(evt.target.value));
      console.log(evt.target.value);
      this.setState(byPropKey('isUserPwdPKOK', true), () => {
        if (this.state.isUserPKOK) {
          this.setState(byPropKey('isReadyToRestoreWalletPK', true), () => {
          });
        }
      });
    }
    else {
      this.setState(byPropKey('isUserPwdPKOK', false), () => {
          this.setState(byPropKey('isReadyToRestoreWalletPK', false), () => {
          });
      });
    }
  }



  
  eventonGenerateAddress = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(generateAddress());
  }
  eventonCheckBalances = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(checkBalances());
  }
  eventonGetExchangeRates = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(getExchangeRates());
  }
  eventonShowTokenChooser = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      this.props.dispatch(showTokenChooser());
  }



  eventonShowSendToken = (address, tokenSymbol) => {
      this.props.dispatch(showSendToken(address, tokenSymbol));
  }
  eventonSelectCurrency = (convertTo) => {
      this.props.dispatch(selectCurrency(convertTo));
  }

  handleMenuNewWalletClick = ({key}) => { 
    // message.info('Click on menu item.');
    if (key == 1) {
      
    } else if (key == 2){ 
      this.setState(byPropKey('generateWalletStep', 0), () => {
      });
      this.setState(byPropKey('isReadyToGenerateWallet', false), () => {
      });
      this.setState(byPropKey('NameGenerateWallet', ""), () => {
      });
      this.setState(byPropKey('tooltipToGenerateWallet', "wallet name"), () => { 
      });
      this.setState(byPropKey('nameRestoredWallet', ""), () => {
      });
      this.setState(byPropKey('isShowGenerateWallet', false), () => {
      });
      this.setState(byPropKey('justCreatedWallet', false), () => {
      });
      this.props.dispatch(generateWallet());
    }
  }
  handleMenuRestoreFromSeedClick = ({key}) => { {/* onClick={this.EventonShowRestoreWallet} */}
    // message.info('Click on menu item.');
    if (key == 1) {
      
    } else if (key == 2){
      this.setState(byPropKey('restoreWalletStep', 0), () => {
      });
      this.setState(byPropKey('isReadyToRestoreWallet', false), () => {
      });
      this.setState(byPropKey('NameRestoreWallet', ""), () => {
      });
      this.setState(byPropKey('tooltipToRestoreWallet', "wallet cancel"), () => {
      });
      this.setState(byPropKey('nameRestoredWallet', ""), () => {
      });
      this.setState(byPropKey('IsnameRestoredWallet', false), () => {
      });
      this.setState(byPropKey('hasFinishedToRestoreWallet', false), () => {
      });
      this.props.dispatch(showRestoreWallet());
    }
  }
  handleMenuRestoreFromPrivKeyClick = ({key}) => { {/* onClick={this.EventonShowRestoreWalletFromPrivKey} */}
    if (key == 1) {
    
    } else if (key == 2){
      this.setState(byPropKey('restoreWalletStepPK', 0), () => { 
      });
      this.setState(byPropKey('isReadyToRestoreWalletPK', false), () => { 
      });
      this.setState(byPropKey('NameRestoreWalletPK', ""), () => { 
      });
      this.setState(byPropKey('tooltipToRestoreWalletPK', "wallet cancel"), () => { 
      });
      this.setState(byPropKey('nameRestoredWalletPK', ""), () => { 
      });
      this.setState(byPropKey('IsnameRestoredWalletPK', false), () => { 
      });
      this.setState(byPropKey('hasFinishedToRestoreWalletPK', false), () => {
      });
      this.props.dispatch(showRestoreWalletFromPrivKey());
    }
  }

  //#endregion
  // routerlink={route.ACCOUNTWALLETADD} href={route.ACCOUNTWALLETADD}

  //#region MODAL STEPS INIT
  next_generate_wallet() {
    const current = this.state.generateWalletStep + 1;
    this.setState(byPropKey('generateWalletStep', current), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    }); //
    this.props.dispatch(checkWalletNameAvailable(this.state.NameGenerateWallet)); //actually temporarily saving it flemme de tout changer
  }

  prev_generate_wallet() {
    const current = this.state.generateWalletStep - 1;
    this.setState(byPropKey('generateWalletStep', current), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    });
  }

  next_restore_wallet() {
    const current = this.state.restoreWalletStep + 1;
    this.setState(byPropKey('restoreWalletStep', current), () => {
      this.props.dispatch(restoreWalletFromSeed());
      this.setState(byPropKey('isCheckingRestoredAddressOK', true), () => {
      });
    }); 
    // this.props.dispatch(checkWalletNameAvailable(this.state.NameGenerateWallet)); //actually temporarily saving it flemme de tout changer
  }

  prev_restore_wallet() {
    const current = this.state.restoreWalletStep - 1;
    this.setState(byPropKey('restoreWalletStep', current), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    });
    this.setState(byPropKey('IsnameRestoredWallet', false), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    });
    this.setState(byPropKey('nameRestoredWallet', ""), () => {
    });
    this.setState(byPropKey('hasFinishedToRestoreWallet', false), () => {
    });
    this.setState(byPropKey('isCheckingRestoredAddressOK', false), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    });
    this.setState(byPropKey('isUserPwdOK', false), () => {
      this.setState(byPropKey('isReadyToRestoreWallet', false), () => {
      });
      this.setState(byPropKey('isUserSeedOK', false), () => {
      });
    });
  }

  next_restore_wallet_pk() {
    const current = this.state.restoreWalletStepPK + 1;
    this.setState(byPropKey('restoreWalletStepPK', current), () => {
      this.props.dispatch(restoreWalletFromPK());
      this.setState(byPropKey('isCheckingRestoredAddressPKOK', true), () => {
      });
    }); 
    // this.props.dispatch(checkWalletNameAvailable(this.state.NameGenerateWallet)); //actually temporarily saving it flemme de tout changer
  }

  prev_restore_wallet_pk() {
    const current = this.state.restoreWalletStepPK - 1;
    this.setState(byPropKey('restoreWalletStepPK', current), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    });
    this.setState(byPropKey('IsnameRestoredWalletPK', false), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    });
    this.setState(byPropKey('nameRestoredWalletPK', ""), () => {
    });
    this.setState(byPropKey('hasFinishedToRestoreWalletPK', false), () => {
    });
    this.setState(byPropKey('isCheckingRestoredAddressPKOK', false), () => {
      // console.log("walletAddress is " + this.state.walletAddress);
    });
    this.setState(byPropKey('isUserPwdPKOK', false), () => {
      this.setState(byPropKey('isReadyToRestoreWalletPK', false), () => {
      });
      this.setState(byPropKey('isUserPKOK', false), () => {
      });
    });
  }
  //#endregion

  render() {
    const { isCheckingRestoredAddressOK, isCheckingRestoredAddressPKOK, isUserPwdOK, isUserPwdPKOK, isUserSeedOK, isUserPKOK, 
      isReadyToGenerateWallet, isReadyToRestoreWallet, isReadyToRestoreWalletPK, NameRestoreWallet, 
      theaddressRestoredFromSeed, theaddressRestoredFromPK, IsnameRestoredWallet, IsnameRestoredWalletPK, NameRestoreWalletPK,
      tooltipToGenerateWallet, tooltipToRestoreWallet, tooltipToRestoreWalletPK, generateWalletStep, restoreWalletStep, 
      restoreWalletStepPK, NameGenerateWallet, justCreatedWallet, hasFinishedToRestoreWallet, hasFinishedToRestoreWalletPK, 
      nameRestoredWallet, nameRestoredWalletPK, mykeystores, } = this.state;

    //#region ALL PROPS
    const {
      //for the registered addresses 
      error,
      loading,
      address,


      loadingNetwork,
      errorNetwork,
      networkName,
      blockNumber,
      availableNetworks,
      onLoadNetwork,

      tokenInfo,


      onGenerateWallet,
      onGenerateWalletCancel,
      isWalletNameAvailable,
      isShowGenerateWallet,
      generateWalletLoading,
      generateWalletError,

      generateKeystoreLoading,
      generateKeystoreError,
      seed,
      keystores,
      password,
      restoreWalletError,
      restoreWalletErrorPK,
      onGenerateKeystore,
      onGenerateAddress,
      onCheckBalances,
      isComfirmed,
      // addressList,
      addressMap,
      tokenDecimalsMap,

      onShowRestoreWallet,
      isShowRestoreWallet,
      isShowRestoreWalletFromPrivKey,
      userSeed,
      userPK,
      userPassword,
      userPasswordPK,
      onChangeUserSeed,
      onChangeUserPassword,
      onRestoreWalletFromSeed,
      onRestoreWalletCancel,

      isShowSendToken,
      onShowSendToken,
      onHideSendToken,
      onShowTokenChooser,
      onHideTokenChooser,

      isShowTokenChooser,

      currentAddressList,
      addressListLoading,
      addressListError,
      addressListMsg,

      networkReady,
      checkingBalanceDoneTime,
      checkingBalances,
      checkingBalancesError,

      onLockWallet,
      onUnlockWallet,

      exchangeRates,
      onSelectCurrency,
      convertTo,

      onGetExchangeRates,
      getExchangeRatesDoneTime,
      getExchangeRatesLoading,
      getExchangeRatesError,
      onCloseWallet,

      onSaveWallet,
      saveWalletLoading,
      saveWalletError,
      onLoadWallet,
      loadWalletLoading,
      loadWalletError,
    } = this.props;
    //#endregion
    
    //#region DETAILED PROPS

    const networkIndicatorProps = {
      loadingNetwork,
      errorNetwork,
      blockNumber,
    };
  
    const networkMenuProps = {
      availableNetworks,
      networkName,
      onLoadNetwork,
    };

    const subHeaderProps = {
      onGenerateWallet,
      onShowRestoreWallet,
      isComfirmed,
      onCloseWallet,
      onLockWallet,
      password,
      onUnlockWallet,

      onSaveWallet,
      saveWalletLoading,
      saveWalletError,
      onLoadWallet,
      loadWalletLoading,
      loadWalletError,
    };

    const lockButtonProps = { onLockWallet, password, onUnlockWallet };

    const generateWalletProps = {
      isShowGenerateWallet,
      generateWalletLoading,
      generateWalletError,

      seed,
      password,
      keystores,

      onGenerateWallet,
      onGenerateWalletCancel,
      onGenerateKeystore,
    };
    const restoreWalletModalProps = {
      isShowRestoreWallet,
      userSeed,
      userPassword,
      restoreWalletError,
      onChangeUserSeed,
      onChangeUserPassword,
      onRestoreWalletCancel,
      onRestoreWalletFromSeed,
    };

    const restoreWalletFromPrivKeyModalProps = {
      isShowRestoreWalletFromPrivKey,
      userPK, //userSeed
      userPasswordPK,
      restoreWalletErrorPK,
      //onChangeUserSeed,
      //onChangeUserPassword,
      //onRestoreWalletCancel,
      //onRestoreWalletFromSeed,
    };

    const addressViewProps = {
      generateKeystoreLoading,
      generateKeystoreError,
      isComfirmed,
      // addressList,
      addressMap,
      tokenDecimalsMap,
      onShowSendToken,
      onShowTokenChooser,
      onCheckBalances,
      onGenerateAddress,
      addressListLoading,
      addressListError,
      addressListMsg,
      networkReady,
      checkingBalanceDoneTime,
      checkingBalances,
      checkingBalancesError,
      onSelectCurrency,
      exchangeRates,
      convertTo,
      onGetExchangeRates,
      getExchangeRatesDoneTime,
      getExchangeRatesLoading,
      getExchangeRatesError,
    };

    const addressTableProps = {
      addressMap,
      tokenDecimalsMap,
      onShowSendToken,
      exchangeRates,
      onSelectCurrency,
      convertTo,
    };
  
    const addressTableFooterProps = {
      checkingBalanceDoneTime,
      checkingBalances,
      checkingBalancesError,
      onCheckBalances,
      networkReady,
  
      isComfirmed,
      onGenerateAddress,
      addressListLoading,
      addressListError,
      addressListMsg,
  
      onGetExchangeRates,
      getExchangeRatesDoneTime,
      getExchangeRatesLoading,
      getExchangeRatesError,
  
      onShowTokenChooser,
    };

    const sendTokenProps = { isShowSendToken, onHideSendToken };
    const tokenChooserProps = { isShowTokenChooser, onHideTokenChooser };
    //#endregion

    //#region SOME INIT

    // function loadMap(address, options = {}) {
    //   const { returnList, removeIndex, removeEth } = options;
    //   let addressMapi = address ? state.inWalletState.getIn(['addressList', address]) : state.inWalletState.addressList;
    //   if (!addressMapi) {
    //     return null;
    //   }
    //   if (address && removeIndex) {
    //     addressMapi = addressMapi.delete('index');
    //   }
    //   if (address && removeEth) {
    //     addressMapi = addressMapi.delete('eth');
    //   }
    //   const returnS = (returnList ? addressMapi.keySeq().toArray() : addressMapi.toJS());
    //   return returnS;
    // }

    const errorComponent =
    (<Spanr key="error">
      <Tooltip placement="bottom" title={restoreWalletError}>
        <Icon type="close-circle-o" style={{ color: 'red' }} />
      </Tooltip>
    </Spanr>);

    const errorComponentPK =
    (<Spanr key="error">
      <Tooltip placement="bottom" title={restoreWalletErrorPK}>
        <Icon type="close-circle-o" style={{ color: 'red' }} />
      </Tooltip>
    </Spanr>);

    let addressViewContent = (
      <Divav>
        {generateKeystoreError ?
          <Alert
            message="Generate Keystore Error"
            description={generateKeystoreError}
            type="error"
            showIcon
          />
          :
          <div>
                <h2>Welcome ! <br />For a better user experience we advise you to create or restore a wallet <br /></h2>
                {/* <H2>
                  The Connection to Ethereum network is made via infura / local node. <br />
                  The wallets are saved encrypted inside the keystore. The Keystore is encrypted using the password. 
                  When the wallet is locked, you can only view balances. You can not send assets <br />
                  All keys are saved inside the browser and never sent. 
                  You are in control of your keys and passwords, Please kep Them Safe 
                  Take the habit to lock your wallet when you are done using them 
                  When you plan on changing devices make sure also to close your wallets so they are not stored in the browser fot nothing
                </H2> */}
              </div>}
      </Divav>
    );
    
    if (isComfirmed) {
      addressViewContent = (
        <Divav>
          <AddressTable {...addressTableProps} />
          <Divatafoot>
            <IconButton
              text="Add address"
              icon="plus"
              onClick={this.eventonGenerateAddress}
              loading={addressListLoading}
              error={addressListError}
              disabled={!isComfirmed}
              popconfirmMsg={false}
            />
            <IconButton
              text="Check balances"
              icon="reload"
              onClick={this.eventonCheckBalances}
              loading={checkingBalances}
              error={checkingBalancesError}
              disabled={!networkReady}
              popconfirmMsg="Refresh balance?"
            />
            <IconButton
              text="Update rates"
              icon="global"
              onClick={this.eventonGetExchangeRates}
              loading={getExchangeRatesLoading}
              error={getExchangeRatesError}
              disabled={!networkReady}
              popconfirmMsg="Refresh exchange rates?"
            />
            <br />
            <IconButton
              text="Select Tokens"
              icon="bars"
              onClick={this.eventonShowTokenChooser}
              type="primary"
              // onClick, loading, error, disabled, popconfirmMsg
            />
            <br /><br />
          </Divatafoot>
        </Divav>
      );
    }

    const menu_new_wallet = (
      <Menu onClick={this.handleMenuNewWalletClick}>
        <Menu.Item key="1"><Icon type="user" />BTC</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />ETH</Menu.Item>
        <Menu.Item key="3"><Icon type="user" />GOCHAIN</Menu.Item>
        <Menu.Item key="4"><Icon type="user" />RIPPLE</Menu.Item>
        <Menu.Item key="5"><Icon type="user" />EOS</Menu.Item>
        <Menu.Item key="6"><Icon type="user" />TRX</Menu.Item>
        <Menu.Item key="7"><Icon type="user" />XLM</Menu.Item>
        <Menu.Item key="8"><Icon type="user" />NEO</Menu.Item>
        <Menu.Item key="9"><Icon type="user" />BC</Menu.Item>
      </Menu>
    );
    const menu_restore_wallet_from_seed = (
      <Menu onClick={this.handleMenuRestoreFromSeedClick}>
        <Menu.Item key="1"><Icon type="user" />BTC</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />ETH</Menu.Item>
        <Menu.Item key="3"><Icon type="user" />GOCHAIN</Menu.Item>
        <Menu.Item key="4"><Icon type="user" />RIPPLE</Menu.Item>
        <Menu.Item key="5"><Icon type="user" />EOS</Menu.Item>
        <Menu.Item key="6"><Icon type="user" />TRX</Menu.Item>
        <Menu.Item key="7"><Icon type="user" />XLM</Menu.Item>
        <Menu.Item key="8"><Icon type="user" />NEO</Menu.Item>
        <Menu.Item key="9"><Icon type="user" />BC</Menu.Item>
      </Menu>
    );
    const menu_restore_wallet_from_priv_key = (
      <Menu onClick={this.handleMenuRestoreFromPrivKeyClick}>
        <Menu.Item key="1"><Icon type="user" />BTC</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />ETH</Menu.Item>
        <Menu.Item key="3"><Icon type="user" />GOCHAIN</Menu.Item>
        <Menu.Item key="4"><Icon type="user" />RIPPLE</Menu.Item>
        <Menu.Item key="5"><Icon type="user" />EOS</Menu.Item>
        <Menu.Item key="6"><Icon type="user" />TRX</Menu.Item>
        <Menu.Item key="7"><Icon type="user" />XLM</Menu.Item>
        <Menu.Item key="8"><Icon type="user" />NEO</Menu.Item>
        <Menu.Item key="9"><Icon type="user" />BC</Menu.Item>
      </Menu>
    );

    //#endregion

      return (
        <div>
          <section>
            <h1 >
              <b > Wallet Manager </b>
            </h1>
            {/* <div>
              {keystores.map((item, index) => (
                <li key={index} item={item} />
              ))}
            </div> */}
            <div>
              <Dropdown overlay={menu_new_wallet} trigger={['click']}>
                <Button key="new_wallet" type="primary" size="large" >
                  New wallet <Icon type="down" />
                </Button> 
              </Dropdown>

              <Dropdown overlay={menu_restore_wallet_from_seed} trigger={['click']}>
                <Button  type="default" size="large" >
                  Restore wallet From Seed <Icon type="down" />
                </Button>
              </Dropdown>

              <Dropdown overlay={menu_restore_wallet_from_priv_key} trigger={['click']}>
                <Button key="restore_wallet_from_priv_key" type="default" size="large" >
                  Restore wallet From Priv Key <Icon type="down" />
                </Button>
              </Dropdown>
            </div>

            {/* <Div>
              {isComfirmed ? (
                <div>
                  {password ? (
                    <Popconfirm key="close_wallet" placement="bottom" title="Comfirm locking wallet" onConfirm={this.EventonLockWallet} okText="Confirm" 
                              cancelText="Abort">
                        <Button icon="lock" type="default" size="large" >Lock Wallet</Button>
                    </Popconfirm> ) 
                    :
                    (
                    <Button icon="unlock" type="default" size="large" onClick={this.EventonUnlockWallet}>Unlock Wallet</Button>
                  )}
                  <Popconfirm key="close_wallet_pop" placement="bottom" title="Wallet will be deleted from memory and LocalStorage" 
                              onConfirm={this.EventonCloseWallet} okText="Confirm" cancelText="Abort">
                    <Button key="close_wallet" type="default" icon="close-square-o" size="large">Close wallet</Button>
                  </Popconfirm>
                </div> ) 
                :
                (
                  <div>
                    <Dropdown overlay={menu_new_wallet} trigger={['click']}>
                      <Button key="new_wallet" type="primary" size="large" >
                        New wallet <Icon type="down" />
                      </Button> 
                    </Dropdown>

                    <Dropdown overlay={menu_restore_wallet_from_seed} trigger={['click']}>
                      <Button  type="default" size="large" >
                        Restore wallet From Seed <Icon type="down" />
                      </Button>
                    </Dropdown>

                    <Dropdown overlay={menu_restore_wallet_from_priv_key} trigger={['click']}>
                      <Button key="restore_wallet_from_priv_key" type="default" size="large" >
                        Restore wallet From Priv Key <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </div>
                )}
            </Div> */}
          </section>

          {/* <section>
            <Spin
              spinning={generateKeystoreLoading}
              style={{ position: 'static' }}
              size="large"
              tip="Loading...">
              {addressViewContent}
            </Spin>
          </section> */}

          <Modal
                visible={isShowGenerateWallet}
                title="New Wallet"
                onOk={this.eventonGenerateKeystore}
                onCancel={this.eventonGenerateWalletCancel}
                footer={[null]}
                width={550}
              >
                <Steps current={generateWalletStep}>
                  {generate_wallet_steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <br/>
                <br/>
                <br/>
                <div className="steps-action"> 
                  {// ==0 
                    generateWalletStep < generate_wallet_steps.length - 1
                    && (
                      <div>
                        <Alert
                          message="Give a name to your wallet for ease to use:"
                          description={<b>This name will be displayed while interacting with other wallets <br/> Choose something unique ! </b>}
                          type="info"
                        />
                        <br/>
                        <br/>
                        <Tooltip
                          trigger={['focus']}
                          title={tooltipToGenerateWallet}
                          placement="topLeft"
                        >
                          <Input addonAfter=".eth" allowClear onChange={this.onChangeNameGenerateWallet} maxLength={40} value={NameGenerateWallet}/>
                        </Tooltip>
                        <br/>
                        <br/>
                        <br/>
                        <Button type="primary" disabled={!isReadyToGenerateWallet} onClick={() => this.next_generate_wallet()}>Next</Button>
                      </div>
                    )
                  }
                  { // dernier == 1
                    generateWalletStep === generate_wallet_steps.length - 1
                    && (
                      <div>
                        <Alert
                          message={<b>We can not recover the seed if you lose it</b>}
                          description={<b>Copy the generated seed to a safe location <br />
                                          Seed generation method : HDPathString: m/44'/60'/0'/0.<br /></b>} 
                          type="warning"
                          showIcon
                        />
                        <br />
                        <Alert
                          message="Seed:"
                          description={<b>{seed}</b>}
                          type="info"
                        />
                        <br />
                        <Alert
                          message="Password for browser encryption:"
                          description={<b>{password}</b>}
                          type="info"
                        /> 
                        <br />
                        <Button shape="circle" icon="reload" loading={generateWalletLoading} key="back" size="large" onClick={this.eventonGenerateWallet} /> &nbsp;&nbsp;
                        <Button onClick={() => this.prev_generate_wallet()}>Previous</Button>&nbsp;&nbsp; 
                        <Button type="primary" onClick={this.eventonGenerateKeystore}>Done</Button>
                      </div>
                    )
                  }
                </div>

          </Modal>

          <Modal
                visible={isShowRestoreWallet}
                title="Restore Wallet"
                onOk={this.eventonRestoreWalletFromSeed}
                onCancel={this.eventonRestoreWalletCancel}
                footer={[restoreWalletError ? errorComponent : null]}
                width={550}
              >
              <Steps current={restoreWalletStep}>
                  {restore_wallet_steps.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <br/>
              <br/>
              <br/>
              <div className="steps-action">
                {// ==0 
                  restoreWalletStep < restore_wallet_steps.length - 1
                    && (
                      <div>
                        <Descriptionr>{"HDPathString m/44'/60'/0'/0 is used for address generation"}</Descriptionr>
                        <Input
                          placeholder="Enter seed"
                          prefix={<Icon type="wallet" />}
                          // value={userSeed}
                          onChange={this.eventonChangeUserSeed}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                        />
                        <Divr>
                          <Input
                            placeholder="Enter password for keystore encryption"
                            prefix={<Icon type="key" />}
                            // value={userPassword}
                            onChange={this.eventonChangeUserPassword}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                          />
                        </Divr>
                        <br/>
                        <br/>
                        <br/>
                        <Button type="primary" disabled={!isReadyToRestoreWallet} onClick={() => this.next_restore_wallet()}>Next</Button>
                      </div>
                    )
                }
                { // dernier == 1
                  restoreWalletStep === restore_wallet_steps.length - 1 
                  && (
                    <div>
                      <Spin
                        indicator={antIconLoadingRestoreWallet}
                        spinning={isCheckingRestoredAddressOK}
                        style={{ position: 'static' }}
                        tip="Loading...">
                        {
                          IsnameRestoredWallet ? (
                            <div>
                              <Alert
                                message={"Your wallet has been successfully restored ! "}
                                description={"Your Main Wallet Name is : "} 
                                type="info"
                                showIcon
                              />
                              <br/>
                              <Alert
                                message={nameRestoredWallet + ".eth"}
                                description={"kesako "} 
                                type="info"
                                showIcon
                              />
                            </div>
                          ) :
                          (
                            <div>
                              <Alert
                                message={"your wallet has been restored"}
                                description={"For ease to use, Please enter a name for your wallet"} 
                                type="info"
                                showIcon
                              />
                              <br/>
                              <Tooltip
                                trigger={['focus']}
                                title={tooltipToRestoreWallet}
                                placement="topLeft"
                              >
                                <Input addonAfter=".eth" allowClear onChange={this.onChangeNameRestoreWallet} maxLength={40} value={NameRestoreWallet}/>
                              </Tooltip>
                            </div>
                          )
                        }
                      </Spin>
                      <br/>
                      <br/>
                      <br/>
                      <Button onClick={() => this.prev_restore_wallet()}>Previous</Button>&nbsp;&nbsp; 
                      <Button key="submit" type="primary" disabled={!hasFinishedToRestoreWallet} onClick={this.eventonRestoreKeystore} >
                        Restore
                      </Button>
                    </div>
                  )
                }
              </div>
          </Modal>
        
          <Modal
                visible={isShowRestoreWalletFromPrivKey}
                title="Restore Wallet From Private Key"
                onOk={this.eventonRestoreWalletFromPK}
                onCancel={this.eventonRestoreWalletPKCancel}
                footer={[restoreWalletErrorPK ? errorComponentPK : null]}
                width={550}
              >
              <Steps current={restoreWalletStepPK}>
                  {restore_wallet_steps_pk.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <br/>
              <br/>
              <br/>
              <div className="steps-action">
                {// ==0 
                  restoreWalletStepPK < restore_wallet_steps_pk.length - 1
                    && (
                      <div>
                        <Descriptionr>{"HDPathString m/44'/60'/0'/0 is used for address generation"}</Descriptionr>
                        <Input
                          placeholder="Enter Private Key"
                          prefix={<Icon type="wallet" />}
                          // value={userPK}
                          onChange={this.eventonChangeUserPK}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                        />
                        <Divr>
                          <Input
                            placeholder="Enter password for keystore encryption"
                            prefix={<Icon type="key" />}
                            // value={userPasswordPK}
                            onChange={this.eventonChangeUserPasswordPK}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                          />
                        </Divr>
                        <br/>
                        <br/>
                        <br/>
                        <Button type="primary" disabled={!isReadyToRestoreWalletPK} onClick={() => this.next_restore_wallet_pk()}>Next</Button>
                      </div>
                    )
                }
                { // dernier == 1
                  restoreWalletStepPK === restore_wallet_steps_pk.length - 1 
                  && (
                    <div>
                      <Spin
                        indicator={antIconLoadingRestoreWallet}
                        spinning={isCheckingRestoredAddressPKOK}
                        style={{ position: 'static' }}
                        tip="Loading...">
                        {
                          IsnameRestoredWalletPK ? (
                            <div>
                              <Alert
                                message={"Your wallet has been successfully restored ! "}
                                description={"Your Wallet Name is : "} 
                                type="info"
                                showIcon
                              />
                              <br/>
                              <Alert
                                message={nameRestoredWalletPK + ".eth"}
                                description={"kesako "} 
                                type="info"
                                showIcon
                              />
                            </div>
                          ) :
                          (
                            <div>
                              <Alert
                                message={"your wallet has been restored"}
                                description={"For ease to use, Please enter a name for your wallet"} 
                                type="info"
                                showIcon
                              />
                              <br/>
                              <Tooltip
                                trigger={['focus']}
                                title={tooltipToRestoreWalletPK}
                                placement="topLeft"
                              >
                                <Input addonAfter=".eth" allowClear onChange={this.onChangeNameRestoreWalletPK} maxLength={40} value={NameRestoreWalletPK}/>
                              </Tooltip>
                            </div>
                          )
                        }
                      </Spin>
                      <br/>
                      <br/>
                      <br/>
                      <Button onClick={() => this.prev_restore_wallet_pk()}>Previous</Button>&nbsp;&nbsp; 
                      <Button key="submit" type="primary" disabled={!hasFinishedToRestoreWalletPK} onClick={this.eventonRestoreKeystorePK} >
                        Restore
                      </Button>
                    </div>
                  )
                }
              </div>
          </Modal>
        </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({ //(state) => ({
  address: makeSelectItemsAddress(),//state.getIn(['addressState', 'items']), //state.addressState.items,
  loading: makeSelectItemsAddressLoading(),//state.getIn(['addressState', 'loading']), //state.addressState.loading,
  error: makeSelectItemsAddressError(),//state.getIn(['addressState', 'error']), //state.addressState.error,  

  //#region from dispatch loadnetwork
  loadingNetwork: makeSelectLoading(), //state.getIn(['inWalletState', 'loadingNetwork']), //state.inWalletState.loadingNetwork,
  errorNetwork: makeSelectError(), //state.inWalletState.errorNetwork,
  networkName: makeSelectNetworkName(), //state.inWalletState.networkName,
  availableNetworks: makeSelectAvailableNetworks(), //state.inWalletState.availableNetworks,
  blockNumber: makeSelectBlockNumber(), //state.inWalletState.blockNumber,
  // onLoadNetwork,
  //#endregion

  //#region dispatch from lockWallet unlockWallet closeWallet generateWallet forshowRestoreWallet
  // onGenerateWallet, 
  // onShowRestoreWallet, 
  isComfirmed: makeSelectIsComfirmed(), 
  // onCloseWallet,
  // onLockWallet, 
  password: makeSelectPassword(),  //state.inWalletState.password, 
  // onUnlockWallet,
  //#endregion

  //#region dispatch from generateKeystore generateWalletCancel generateWallet
  isWalletNameAvailable: makeSelectwalletNameAvailable(),
  isShowGenerateWallet: makeSelectIsShowGenerateWallet(), //state.inWalletState.isShowGenerateWallet,
  generateWalletLoading: makeSelectGenerateWalletLoading(),//state.inWalletState.generateWalletLoading,
  generateWalletError: makeSelectGenerateWalletError(), //state.inWalletState.generateWalletError,
  seed: makeSelectSeed(), //state.inWalletState.seed,

  // onGenerateWallet,
  // onGenerateWalletCancel,
  // onGenerateKeystore,
  //#endregion
  
  //#region dispatch from restoreWalletCancel restoreWalletFromSeed changeUserSeed changeUserPassword changeUserPasswordPK
  isShowRestoreWallet: makeSelectShowRestoreWallet(), //state.inWalletState.isShowRestoreWallet,
  isShowRestoreWalletFromPrivKey: makeSelectShowRestoreWalletFromPrivKey(), //state.inWalletState.isShowRestoreWalletFromPrivKey,
  userSeed: makeSelectUserSeed(),  //state.inWalletState.userSeed,
  userPK: makeSelectUserPK(), //state.inWalletState.userPK,
  userPassword: makeSelectUserPassword(), //state.inWalletState.userPassword, 
  userPasswordPK: makeSelectUserPasswordPK(), //state.inWalletState.userPasswordPK,
  restoreWalletError: makeSelectRestoreWalletError(), 
  restoreWalletErrorPK: makeSelectRestoreWalletErrorPK(), 
  // onChangeUserSeed, 
  // onChangeUserPassword, 
  // onRestoreWalletCancel, 
  // onRestoreWalletFromSeed,
  //#endregion

  //#region dispatch from generateAddress checkBalances getExchangeRates showTokenChooser  showSendToken  selectCurrency
  generateKeystoreLoading: makeSelectGenerateKeystoreLoading(),//state.inWalletState.generateKeystoreLoading,
  generateKeystoreError: makeSelectGenerateKeystoreError() ,// state.inWalletState.generateKeystoreError,
  
  addressMap: makeSelectAddressMap(),
  checkingAdrIsInOurDBDone: makeSelectcheckingAdrIsInOurDBDone(),
  checkingAdrIsInOurDBDonePK: makeSelectcheckingAdrIsInOurDBDonePK(),
  nameFromRestoreWalletSeed: makeSelectnameFromRestoreWalletSeed(),
  nameFromRestoreWalletPK: makeSelectnameFromRestoreWalletPK(),
  // tokenDecimalsMap: state.inWalletState.tokenInfo ? Object.assign({}, ...Object.keys(state.inWalletState.tokenInfo.toJS()).map((k) => ({ [k]: tokenInfo[k].decimals }))) : Object.assign({}, ...Object.keys({}).map((k) => ({ [k]: tokenInfo[k].decimals }))),
  tokenDecimalsMap: makeSelectTokenDecimalsMap(),
  // onShowSendToken, 
  // onCheckBalances,
  // onGenerateAddress,
  networkReady: makeSelectNetworkReady(), // state.inWalletState ? state.inWalletState.networkReady : null,
  checkingBalanceDoneTime: makeSelectCheckingBalanceDoneTime() ,//state.inWalletState.checkingBalanceDoneTime,
  checkingBalances: makeSelectCheckingBalances(), //state.inWalletState ? state.inWalletState.checkingBalances : null,
  checkingBalancesError: makeSelectCheckingBalancesError(), //state.inWalletState.checkingBalancesError,
  addressListLoading: makeSelectAddressListLoading(), //state.inWalletState.addressListLoading,
  addressListError: makeSelectAddressListError(), //state.inWalletState.addressListError,
  addressListMsg: makeSelectAddressListMsg(), //state.inWalletState.addressListMsg,
  exchangeRates: makeSelectExchangeRates(), //state.inWalletState.exchangeRates,
  convertTo: makeSelectConvertTo(),//state.inWalletState.convertTo,
  // onSelectCurrency, 
  // onGetExchangeRates,
  getExchangeRatesDoneTime: makeSelectGetExchangeRatesDoneTime(),//state.inWalletState ? state.inWalletState.getExchangeRatesDoneTime : null,
  getExchangeRatesLoading: makeSelectGetExchangeRatesLoading(),//state.inWalletState ? state.inWalletState.getExchangeRatesLoading : null,
  getExchangeRatesError: makeSelectGetExchangeRatesError(),//state.inWalletState ? state.inWalletState.getExchangeRatesError : null,
  // onShowTokenChooser,
  //#endregion
  keystores: makeSelectKeystores(),
  theaddressRestoredFromSeed: makeSelecttheaddressRestoredFromSeed(),
  theaddressRestoredFromPK: makeSelecttheaddressRestoredFromPK(),
});


const authCondition = (authUser) => !!authUser;

const MyAccountsWalletPageWithRouter = withRouter(MyAccountsWalletPage);
const MyAccountsWalletPageWithAuthorization = compose(
  WithAuthorization(authCondition),
  connect(mapStateToProps)
)(MyAccountsWalletPageWithRouter);

export { MyAccountsWalletPageWithAuthorization as AccountsWalletPage }; 


// onShowSendToken: (address, tokenSymbol) => {
//   dispatch(showSendToken(address, tokenSymbol));
// },
// onHideSendToken: () => {
//   dispatch(hideSendToken());
// },

// onHideTokenChooser: () => {
//   dispatch(hideTokenChooser());
// },

// onSaveWallet: () => {
//   dispatch(saveWallet());
// },