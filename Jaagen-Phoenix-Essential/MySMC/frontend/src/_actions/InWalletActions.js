/**
 * Wallet operations
 */
import lightwallet from 'eth-lightwallet';
import localStore from 'store/dist/store.modern';
import { take, call, put, select, takeLatest, race, fork } from 'redux-saga/effects';
import request from '../_utils/request';
// import { CONFIRM_UPDATE_TOKEN_INFO } from 'containers/TokenChooser/constants';
// import { loadNetwork } from 'containers/Header/actions';
// import { changeFrom } from 'containers/SendToken/actions';

import {
    makeSelectKeystore,
    makeSelectKeystores,//G
    makeSelectAddressList,
    makeSelectPassword,
    makeSelectAddressMap,
    makeSelectTokenInfoList,
    makeSelectTokenInfo,
    makeSelectSeed,
    makeSelectUserSeed,
    makeSelectUserPK,
    makeSelectUserPassword,
    makeSelectUserPasswordPK,
    makeSelectwalletNameAvailable,
    makeSelectwalletNameRestoredFromSeed,
    makeSelectObjRom,
} from '../_selectors/homeselectors';
import {
    makeSelectFrom,
    makeSelectTo,
    makeSelectAmount,
    makeSelectGasPrice,
    makeSelectSendTokenSymbol,
} from '../_selectors/sendtokenselectors'; 

import generateString from '../_utils/crypto';

import SignerProvider from '../_vendor/ethjs-provider-signer/ethjs-provider-signer';
import BigNumber from 'bignumber.js';

import { generatedPasswordLength, hdPathString, offlineModeString, defaultNetwork, localStorageKey } from '../_utils/constants';
import { timeBetweenCheckbalances, Ether, Gwei, maxGasForEthSend, maxGasForTokenSend, checkFaucetAddress, askFaucetAddress, } from '../_utils/constants';
import { timer } from '../_utils/common';
import extractRates from '../_utils/unitConverter';

import { Network } from '../_constants';
import { erc20ABI } from '../_constants';
const web3 = new Web3(); // eslint-disable-line
const erc20Contract = web3.eth.contract(erc20ABI);
let lastNameGiven = "";
//#region  ACTIONS DECLARATION

    export const LOAD_NETWORK = 'LOAD_NETWORK';
    export const LOAD_NETWORK_SUCCESS = 'LOAD_NETWORK_SUCCESS';
    export const LOAD_NETWORK_ERROR = 'LOAD_NETWORK_ERROR';

    export const CHECK_BALANCES = 'CHECK_BALANCES';
    export const CHECK_BALANCES_SUCCESS = 'CHECK_BALANCES_SUCCESS';
    export const CHECK_BALANCES_ERROR = 'CHECK_BALANCES_ERROR';

    export const STOP_POLL_BALANCES = 'CANCELL_POLL_BALANCES';

    export const GET_EXCHANGE_RATES = 'GET_EXCHANGE_RATES';
    export const GET_EXCHANGE_RATES_SUCCESS = 'GET_EXCHANGE_RATES_SUCCESS';
    export const GET_EXCHANGE_RATES_ERROR = 'GET_EXCHANGE_RATES_ERROR';

    export const CHECK_FAUCET = 'CHECK_FAUCET';
    export const CHECK_FAUCET_SUCCESS = 'CHECK_FAUCETT_SUCCESS';
    export const CHECK_FAUCET_ERROR = 'CHECK_FAUCET_ERROR';
    export const FINALIZE_RESTORE_FROM_SEED = 'FINALIZE_RESTORE_FROM_SEED';
    export const FINALIZE_RESTORE_FROM_PK = 'FINALIZE_RESTORE_FROM_PK';

    export const ASK_FAUCET = 'ASK_FAUCET';
    export const ASK_FAUCET_SUCCESS = 'ASK_FAUCETT_SUCCESS';
    export const ASK_FAUCET_ERROR = 'ASK_FAUCET_ERROR';

    export const CLOSE_FAUCET = 'ASK_CLOSE';

    export const CHANGE_FROM = 'CHANGE_FROM';

    export const CHANGE_AMOUNT = 'CHANGE_AMOUNT';
    export const CHANGE_TO = 'CHANGE_TO';
    export const CHANGE_GAS_PRICE = 'CHANGE_GAS_PRICE';
    export const CHANGE_TOKEN = 'CHANGE_TOKEN';

    export const COMFIRM_SEND_TRANSACTION = 'COMFIRM_SEND_TRANSACTION';
    export const COMFIRM_SEND_TRANSACTION_SUCCESS = 'COMFIRM_SEND_TRANSACTION_SUCCESS';
    export const COMFIRM_SEND_TRANSACTION_ERROR = 'COMFIRM_SEND_TRANSACTION_ERROR';

    export const ABORT_TRANSACTION = 'ABORT_TRANSACTION';
    export const SEND_TRANSACTION = 'SEND_TRANSACTION';
    export const SEND_TRANSACTION_SUCCESS = 'SEND_TRANSACTION_SUCCESS';
    export const SEND_TRANSACTION_ERROR = 'SEND_TRANSACTION_ERROR';

    export const GENERATE_WALLET = 'GENERATE_WALLET';
    export const GENERATE_WALLET_SUCCESS = 'GENERATE_WALLET_SUCCESS';
    export const GENERATE_WALLET_ERROR = 'GENERATE_WALLET_ERROR';
    export const GENERATE_WALLET_CANCEL = 'GENERATE_WALLET_CANCEL';
    export const CHECK_WALLET_AVAILABLE = 'CHECK_WALLET_AVAILABLE';
    export const CHECK_WALLET_AVAILABLE_SUCCESS = 'CHECK_WALLET_AVAILABLE_SUCCESS';
    export const CHECK_WALLET_AVAILABLE_ERROR = 'CHECK_WALLET_AVAILABLE_ERROR';

    export const SHOW_RESTORE_WALLET = 'SHOW_RESTORE_WALLET';
    export const SHOW_RESTORE_WALLET_PK = 'SHOW_RESTORE_WALLET_PK';
    export const RESTORE_WALLET_CANCEL = 'RESTORE_WALLET_CANCEL';
    export const RESTORE_WALLET_CANCEL_PK = 'RESTORE_WALLET_CANCEL_PK';
    export const CHANGE_USER_SEED = 'CHANGE_USER_SEED';
    export const CHANGE_USER_PK = 'CHANGE_USER_PK';
    export const CHANGE_USER_PASSWORD = 'CHANGE_USER_PASSWORD';
    export const CHANGE_USER_PASSWORD_PK = 'CHANGE_USER_PASSWORD_PK';

    export const RESTORE_WALLET_FROM_SEED = 'RESTORE_WALLET_FROM_SEED';
    export const RESTORE_WALLET_FROM_PK = 'RESTORE_WALLET_FROM_PK';
    export const RESTORE_WALLET_FROM_SEED_SUCCESS = 'RESTORE_WALLET_FROM_SEED_SUCCESS';
    export const GEN_KEYSTORE_RESTORE_SEED = 'GEN_KEYSTORE_RESTORE_SEED';
    export const GEN_KEYSTORE_RESTORE_PK = 'GEN_KEYSTORE_RESTORE_PK';
    export const RESTORE_WALLET_FROM_PK_SUCCESS = 'RESTORE_WALLET_FROM_PK_SUCCESS';
    export const RESTORE_WALLET_FROM_SEED_ERROR = 'RESTORE_WALLET_FROM_SEED_ERROR';
    export const RESTORE_WALLET_FROM_PK_ERROR = 'RESTORE_WALLET_FROM_PK_ERROR';

    export const GENERATE_KEYSTORE = 'GENERATE_KEYSTORE';
    export const SET_NAME_TO_ADDRESS = 'SET_NAME_TO_ADDRESS';
    export const GENERATE_KEYSTORE_SUCCESS = 'GENERATE_KEYSTORE_SUCCESS';
    export const GENERATE_KEYSTORES_SUCCESS = 'GENERATE_KEYSTORES_SUCCESS';//G
    export const GENERATE_KEYSTORE_ERROR = 'GENERATE_KEYSTORE_ERROR';
    export const SAVE_OBJ_ROM = 'SAVE_OBJ_ROM';
    export const NAME_FROM_RESTORE_WALLET_SEED = 'NAME_FROM_RESTORE_WALLET_SEED';
    export const NAME_FROM_RESTORE_WALLET_PK = 'NAME_FROM_RESTORE_WALLET_PK';

    export const CHANGE_BALANCE = 'CHANGE_BALANCE';

    export const SHOW_SEND_TOKEN = 'SHOW_SEND_TOKEN';
    export const HIDE_SEND_TOKEN = 'HIDE_SEND_TOKEN';

    export const SHOW_TOKEN_CHOOSER = 'SHOW_TOKEN_CHOOSER';
    export const HIDE_TOKEN_CHOOSER = 'HIDE_TOKEN_CHOOSER';

    export const UPDATE_TOKEN_INFO = 'UPDATE_TOKEN_INFO';

    export const GENERATE_ADDRESS = 'GENERATE_ADDRESS';
    export const CHECKING_ADR_IN_DB_DONE_SWITCH = 'CHECKING_ADR_IN_DB_DONE_SWITCH';
    export const CHECKING_ADR_IN_DB_DONE_SWITCH_PK = 'CHECKING_ADR_IN_DB_DONE_SWITCH_PK';
    export const GENERATE_ADDRESS_SUCCESS = 'GENERATE_ADDRESS_SUCCESS';
    export const GENERATE_ADDRESS_ERROR = 'GENERATE_ADDRESS_ERROR';

    export const LOCK_WALLET = 'LOCK_WALLET';
    export const UNLOCK_WALLET = 'UNLOCK_WALLET';
    export const UNLOCK_WALLET_SUCCESS = 'UNLOCK_WALLET_SUCCESS';
    export const UNLOCK_WALLET_ERROR = 'UNLOCK_WALLET_ERROR';

    export const SET_EXCHANGE_RATES = 'SET_EXCHANGE_RATES';
    export const SELECT_CURRENCY = 'SELECT_CURRENCY';

    export const CLOSE_WALLET = 'CLOSE_WALLET';

    export const CHECK_LOCAL_STORAGE = 'CHECK_LOCAL_STORAGE';
    export const LOCAL_STORAGE_EXIST = 'LOCAL_STORAGE_EXIST';
    export const LOCAL_STORAGE_NOT_EXIST = 'LOCAL_STORAGE_NOT_EXIST';

    export const SAVE_WALLET = 'SAVE_WALLET';
    export const SAVE_WALLET_SUCCESS = 'SAVE_WALLET_SUCCESS';
    export const SAVE_WALLET_ERROR = 'SAVE_WALLET_ERROR';

    export const LOAD_WALLET = 'LOAD_WALLET';
    export const LOAD_WALLET_SUCCESS = 'LOAD_WALLET_SUCCESS';
    export const LOAD_WALLET_ERROR = 'LOAD_WALLET_ERROR';

    export const TOGGLE_TOKEN = 'TOGGLE_TOKEN';

    export const CONFIRM_UPDATE_TOKEN_INFO = 'CONFIRM_UPDATE_TOKEN_INFO';
//#endregion

//#region ACTIONS  

    //#region Connection to network, sending eth, checking balances
        /**
        * Connect to eth network using address from network.js file
        *
        * @return {object}    An action object with a type of LOAD_NETWORK
        */
        export const loadNetwork = networkName => ({
                type: LOAD_NETWORK,
                networkName,
        });

        /**
        * Dispatched when connected to network successfuly by the loadNetwork saga
        *
        * @param  {string} blockNumber The current block number
        *
        * @return {object}      An action object with a type of LOAD_NETWORK_SUCCESS passing the repos
            console.log("Connected sucessfully, current block: " + blockNumber);
        */
        export const loadNetworkSuccess = blockNumber => ({
                type: LOAD_NETWORK_SUCCESS,
                blockNumber,
        });

        /**
        * Dispatched when network connection fails
        *
        * @param  {object} error The error
        *
        * @return {object} An action object with a type of LOAD_NETWORK_ERROR passing the error
        */
        export function loadNetworkError(error) {
            if (error !== offlineModeString) {
                const err = error.indexOf('Invalid JSON RPC response from host provider') >= 0 ?
                `${error}, Check Internet connection and connectivity to RPC` : error;
            }
            return {
                type: LOAD_NETWORK_ERROR,
                error,
            };
        }
        
        
        /* *********************************** Check Balances Actions ******************* */
        /**
         * Initiate process to check balance of all known addresses
         *
         * @return {object}    An action object with a type of CHECK_BALANCES
         */
        export function checkBalances() {
            return {
            type: CHECK_BALANCES,
            };
        }
        
        /**
         * checkBalances successful
         *
         * @return {object}      An action object with a type of CHECK_BALANCES_SUCCESS
         */
        export function checkBalancesSuccess() {
            const timeString = new Date().toLocaleTimeString();
            // message.success('Balances updated succesfully');
            return {
            type: CHECK_BALANCES_SUCCESS,
            timeString,
            };
        }
        
        /**
         * checkBalances failed
         *
         * @param  {object} error The error
         *
         * @return {object} An action object with a type of CHECK_BALANCES_ERROR passing the error
         */
        export function CheckBalancesError(error) {
            console.error(error);
            return {
                type: CHECK_BALANCES_ERROR,
                error,
            };
        }
        
        
        /**
         * Stop polling balances when going to offline mode
         *
         * @return {object} An action object with a type of STOP_POLL_BALANCES
         */
        export function stopPollingBalances() {
            return {
            type: STOP_POLL_BALANCES,
            };
        }
        
        /* *********************************** Get Exchange Rate Actions ******************* */
        /**
         * Get exchange rates from api
         *
         * @return {object}    An action object with a type of CHECK_BALANCES
         */
        export function getExchangeRates() {
            return {
            type: GET_EXCHANGE_RATES,
            };
        }
        
        /**
         * getExchangeRates successful
         *
         * @return {object}      An action object with a type of GET_EXCHANGE_RATES_SUCCESS
         */
        export function getExchangeRatesSuccess() {
            const timeString = new Date().toLocaleTimeString();
            console.log('Exchange rates updated succesfully');
            return {
            type: GET_EXCHANGE_RATES_SUCCESS,
            timeString,
            };
        }
        
        /**
         * getExchangeRates failed
         *
         * @param  {object} error The error
         *
         * @return {object} An action object with a type of CHECK_BALANCES_ERROR passing the error
         */
        export function getExchangeRatesError(error) {
            console.error(error);
            return {
            type: GET_EXCHANGE_RATES_ERROR,
            error,
            };
        }
        
        
        /* *********************************** Faucet Actions ******************* */
        
        /**
         * Check if faucet availible
         *
         * @return {object}    An action object with a type of CHECK_FAUCET
         */
        export function checkFaucet() {
            return {
            type: CHECK_FAUCET,
            };
        }
        
        /**
         * checkFaucet successful will pop notification which can used to ask faucet
         *
         * @return {object}      An action object with a type of CHECK_FAUCET_SUCCESS
         */
        export function checkFaucetSuccess() {
            // //  message.success('Exchange rates updated succesfully');
            // const key = `open${Date.now()}`;
            // const closeNotification = () => {
            // // to hide notification box
            // notification.close(key);
            // };
            // const ask = () => {
            // // to hide notification box
            // notification.close(key);
            // store.dispatch(askFaucet());
            // };
            // const btn = [
            // React.createElement(
            //     Button,
            //     { key: 'b1', type: 'default', size: 'default', onClick: closeNotification },
            //     'No man'
            // ),
            // '  ',
            // React.createElement(
            //     Button,
            //     { key: 'b2', type: 'primary', size: 'default', onClick: ask },
            //     'Sure'
            // )];
            // notification.config({
            // placement: 'bottomRight',
            // });
            // const icon = React.createElement(
            // Icon,
            // { type: 'bulb', style: { color: '#108ee9' } }
            // );
            // notification.open({
            // message: 'Ropsten Testnet faucet',
            // description: 'Need some coins for testing?',
            // duration: 10,
            // key,
            // btn,
            // icon,
            // });
            // return {
            // type: CHECK_FAUCET_SUCCESS,
            // };
        }
        
        /**
         * checkFaucetError failed
         *
         * @param  {object} error The error
         *
         * @return {object} An action object with a type of CHECK_FAUCET_ERROR passing the error
         */
        export function checkFaucetError(error) {
            return {
            type: CHECK_FAUCET_ERROR,
            error,
            };
        }
        
        /**
         * Check if faucet availible
         *
         * @return {object}    An action object with a type of ASK_FAUCET
         */
        export function askFaucet() {
            // const icon = React.createElement(Icon, { type: 'loading' });
            // notification.info({
            // message: 'Sending request',
            // description: 'Please wait',
            // duration: 30,
            // key: 'ask',
            // icon,
            // });
            // return {
            // type: ASK_FAUCET,
            // };
        }
        
        /**
         * checkFaucet successful will pop notification which can used to ask faucet
         *
         * @return {object}      An action object with a type of ASK_FAUCET_SUCCESS
         */
        export function askFaucetSuccess(tx) {
            // notification.close('ask');
            // const key = `open${Date.now()}`;
            // const closeNotification = () => {
            // notification.close(key);
            // };
            // const btn = React.createElement(Button, { type: 'default', size: 'small', onClick: closeNotification }, 'Got it');
            // const description = React.createElement(FaucetDescription, { tx, text: 'Check balance in ~30 seconds. TX:' });
            // notification.success({
            // message: 'Faucet request sucessfull',
            // description,
            // duration: 10,
            // key,
            // btn,
            // });
        
            // return {
            // type: ASK_FAUCET_SUCCESS,
            // tx,
            // };
        }
        
        /**
         * askFaucetError
         *
         * @param  {object} error The error
         *
         * @return {object} An action object with a type of ASK_FAUCET_ERROR passing the error
         */
        export function askFaucetError(error) {
            // const key = `open${Date.now()}`;
            // const closeNotification = () => {
            // notification.close(key);
            // };
            // const btn = React.createElement(Button, { type: 'default', size: 'small', onClick: closeNotification }, 'Got it');
            // notification.error({
            // message: 'Faucet request failed',
            // description: `${error}. Please try again later`,
            // duration: 10,
            // key,
            // btn,
            // });
            // return {
            // type: ASK_FAUCET_ERROR,
            // error,
            // };
        }
    //#endregion

    //#region sendtoken stuff 

        /**
         * Update from address and token, both parameters are optional
         * @param  {string} [address] '0xffd..'
         * @param  {object} [sendTokenSymbol] tokens to send (eth not included)
         *
         * @return {object}    An action object with a type of CHANGE_FROM, address and sendTokenSymbol
         */
        export function changeFrom(address, sendTokenSymbol) {
            return {
            type: CHANGE_FROM,
            address,
            sendTokenSymbol,
            };
        }
        
        export function changeAmount(amount) {
            return {
            type: CHANGE_AMOUNT,
            amount,
            };
        }
        
        export function changeTo(inputAddress) {
            // remove unnessesery spaces
            const address = inputAddress.replace(/^\s+|\s+$/g, '');
            return {
            type: CHANGE_TO,
            address,
            };
        }
        
        export function changeGasPrice(gasPrice) {
            if (gasPrice === '') {
            return {
                type: CHANGE_GAS_PRICE,
                gasPrice: 0,
            };
            }
        
            return {
            type: CHANGE_GAS_PRICE,
            gasPrice,
            };
        }
        
        
        /**
         * initiate confirmation object
         *
         * @return {object}    An action object with a type of COMFIRM_SEND_TRANSACTION
         */
        export function confirmSendTransaction() {
            return {
            type: COMFIRM_SEND_TRANSACTION,
            };
        }
        
        /**
         * transaction confirmed successfully
         *
         * @return {object}    An action object with a type of COMFIRM_SEND_TRANSACTION_SUCCESS
         */
        export function confirmSendTransactionSuccess(msg) {
            if (msg) {
            return {
                type: COMFIRM_SEND_TRANSACTION_SUCCESS,
                msg,
            };
            }
        
            return {
            type: COMFIRM_SEND_TRANSACTION_SUCCESS,
            msg: 'Transaction confirmed successfully, Send to transmit',
            };
        }
        
        /**
         * Error confirming transaction
         *
         * @return {object}    An action object with a type of COMFIRM_SEND_TRANSACTION_ERROR
         */
        export function confirmSendTransactionError(error) {
            return {
            type: COMFIRM_SEND_TRANSACTION_ERROR,
            error,
            };
        }
        
        /**
         * Abort transaction aftrer it has been confirmed
         *
         * @return {object}    An action object with a type of ABORT_TRANSACTION
         */
        export function abortTransaction() {
            return {
            type: ABORT_TRANSACTION,
            };
        }
        
        /**
         * initiate Send
         *
         * @return {object}    An action object with a type of SEND_TRANSACTION
         */
        export function sendTransaction() {
            return {
            type: SEND_TRANSACTION,
            };
        }
        
        /**
         * transaction sent successfully
         *
         * @return {object}    An action object with a type of SEND_TRANSACTION_SUCCESS
         */
        export function sendTransactionSuccess(tx) {
            return {
            type: SEND_TRANSACTION_SUCCESS,
            tx,
            };
        }
        
        /**
         * Error sending transaction
         *
         * @return {object}    An action object with a type of SEND_TRANSACTION_ERROR
         */
        export function sendTransactionError(error) {
            return {
            type: SEND_TRANSACTION_ERROR,
            error,
            };
        }  
    //#endregion
    
    /* ********************************Generate Wallet ******************************* */

    /**
    * Open generate wallet modal and generate new random seed and password
    *
    * @return {object}    An action object with a type of GENERATE_WALLET
    */
    export function generateWallet() {
        return {
            type: GENERATE_WALLET,
        };
    }

    /**
    * check wallet name is available
    *
    * @return {object}    An action object with a type of 
    */
    export function checkWalletNameAvailable(name) {
        return {
            type: CHECK_WALLET_AVAILABLE,
            name,
        };
    }
    /**
    * New Seed and password genetated successfully
    *
    * @param  {string} seed
    * @param  {string} password The current username
    *
    * @return {object}      An action object with a type of GENERATE_WALLET_SUCCESS passing the repos
    */
    export function generateWalletSucces(seed, password) {
        return {
            type: GENERATE_WALLET_SUCCESS,
            seed,
            password,
        };
    }
    export function checkWalletNameAvailableSuccess(name) {
        return {
            type: CHECK_WALLET_AVAILABLE_SUCCESS,
            name,
        };
    }
    export function checkWalletNameAvailableError() {
        return {
            type: CHECK_WALLET_AVAILABLE_ERROR,
        };
    }
    /**
    * Dispatched when generating the seed / password fails
    *
    * @param  {object} error The error
    *
    * @return {object} An action object with a type of GENERATE_WALLET_ERROR passing the error
    */
    export function generateWalletError(error) {
        return {
            type: GENERATE_WALLET_ERROR,
            error,
        };
    }
    /**
    * Generate wallet is canceled by user
    *
    * @return {object}    An action object with a type of GENERATE_WALLET_CANCEL
    */
    export function generateWalletCancel() {
        return {
            type: GENERATE_WALLET_CANCEL,
        };
    }

    /** ****************** Restore wallet *************** */

    /**
    * Show the restore wallet component
    *
    * @return {object}    An action object with a type of SHOW_RESTORE_WALLET
    */
    export function showRestoreWallet() {
        return {
            type: SHOW_RESTORE_WALLET,
        };
    }

    /**
    * Show the restore wallet from PK component 
    *
    * @return {object}    An action object with a type of SHOW_RESTORE_WALLET_PK
    */
    export function showRestoreWalletFromPrivKey() {
        return {
            type: SHOW_RESTORE_WALLET_PK,
        };
    }

    /**
    * close restore wallet modal
    *
    * @return {object}    An action object with a type of RESTORE_WALLET_CANCEL
    */
    export function restoreWalletCancel() {
        return {
            type: RESTORE_WALLET_CANCEL,
        };
    }

    /**
    * close restore wallet modal PK
    *
    * @return {object}    An action object with a type of RESTORE_WALLET_CANCEL_PK
    */
    export function restoreWalletPKCancel() {
        return {
            type: RESTORE_WALLET_CANCEL_PK,
        };
    }

    /**
    * Changes the input field for user seed
    *
    * @param  {name} seed The new text of the input field
    *
    * @return {object}    An action object with a type of 
    */
    export function changeUserSeed(userSeed) {
        return {
            type: CHANGE_USER_SEED,
            userSeed,
        };
    }


    /**
    * Changes the input field for user seed
    *
    * @param  {name} seed The new text of the input field
    *
    * @return {object}    An action object with a type of 
    */
    export function changeUserPK(userPK) {
        return {
            type: CHANGE_USER_PK,
            userPK,
        };
    }

    /**
    * Changes the input field for user password
    *
    * @param  {name} seed The new text of the input field
    *
    * @return {object}    An action object with a type of 
    */
    export function changeUserPassword(userPassword) {
        const password = userPassword;// .replace(/^\s+|\s+$/g, '');
        return {
            type: CHANGE_USER_PASSWORD,
            password,
        };
    }

    /**
    * Changes the input field for user password
    *
    * @param  {name} seed The new text of the input field
    *
    * @return {object}    An action object with a type of 
    */
    export function changeUserPasswordPK(userPasswordPK) {
        const password = userPasswordPK;// .replace(/^\s+|\s+$/g, '');
        return {
            type: CHANGE_USER_PASSWORD_PK,
            password,
        };
    }

    /**
    * Try to restore wallet from seed provided by user.
    *
    * @return {object}    An action object with a type of RESTORE_WALLET_FROM_SEED
    *
    */
    export function restoreWalletFromSeed() {
        return {
            type: RESTORE_WALLET_FROM_SEED,
        };
    }

    /**
    * Try to restore wallet from PK provided by user.
    *
    * @return {object}    An action object with a type of RESTORE_WALLET_FROM_PK
    *
    */
    export function restoreWalletFromPK() {
        return {
            type: RESTORE_WALLET_FROM_PK,
        };
    }

    /**
    * Valid seed provided by user
    *
    * @return {object}    An action object with a type of RESTORE_WALLET_FROM_SEED_SUCCESS
    */
    export function restoreWalletFromSeedSuccess(userSeed, userPassword) {
        return {
            type: RESTORE_WALLET_FROM_SEED_SUCCESS,
            userSeed,
            userPassword,
        };
    }
    
    export function genKeystoreRestoreSeedModeAction() {
        return {
            type: GEN_KEYSTORE_RESTORE_SEED,
        };
    }

    export function genKeystoreRestorePKModeAction() {
        return {
            type: GEN_KEYSTORE_RESTORE_PK,
        };
    }


    /**
    * Valid seed provided by user
    *
    * @return {object}    An action object with a type of 
    */
    export function restoreWalletFromPKSuccess(seed, userPasswordPK) {
        return {
            type: RESTORE_WALLET_FROM_PK_SUCCESS,
            seed,
            userPasswordPK,
        };
    }

    /**
    * Invalid seed provided by user
    *
    * @return {object}    An action object with a type of RESTORE_WALLET_FROM_SEED_ERROR
    */
    export function restoreWalletFromSeedError(error) {
        return {
            type: RESTORE_WALLET_FROM_SEED_ERROR,
            error,
        };
    }

    /**
    * Invalid seed provided by user
    *
    * @return {object}    An action object with a type of RESTORE_WALLET_FROM_PK_ERROR
    */
    export function restoreWalletFromPKError(error) {
        return {
            type: RESTORE_WALLET_FROM_PK_ERROR,
            error,
        };
    }

    /** ********************** Confirm seed and generate keystore ************ */

    /**
    * Confirm seed and create new keystore
    *
    * @return {object}    An action object with a type of GENERATE_KEYSTORE
    */
    export function generateKeystore() {
        return {
            type: GENERATE_KEYSTORE,
        };
    }


    export function finalizeRestoreFromSeed(nameRestoredWallet) {
        return {
            type: FINALIZE_RESTORE_FROM_SEED,
            nameRestoredWallet,
        };
    }

    export function setNameToAddress(theaddress, thename) {
        return {
            type: SET_NAME_TO_ADDRESS,
            theaddress,
            thename
        };
    }


    export function finalizeRestoreFromPK(nameRestoredWalletPK) {
        return {
            type: FINALIZE_RESTORE_FROM_PK,
            nameRestoredWalletPK,
        };
    }

    /**
    * Transforms tokenList to tokenMap.
    * Example:
    * ['eth','eos','ppt'] ->
    * {
    * eos:{balance: false}
    * eth:{balance: false}
    * ppt:{balance: false}
    * }
    * Addds index prop if specified
    * @param {array} tokenList example: ['eth','eos','ppt']
    * @param {number} [index] address index
    * @return {object}    a tokenMap
    */
    function createTokenMap(tokenList, index) {
        const reducer = (acc, token) => ({
            ...acc,
            ...{ [token]: { balance: false } },
        });

        if (index) {
            const tokenMap = tokenList.reduce(reducer, {});
            tokenMap.index = index;
            tokenMap.name = lastNameGiven;
            return tokenMap; 
        }
        return tokenList.reduce(reducer, {});
    }

    /**
    * Creates addressMap for given addressList and tokenList
    * Example:
    * (['address1'],['eth','eos','ppt'])=>
    * addressMap: {
    address1: {
        index: 1
        eth: {balance: false},
        eos: {balance: false},
        ppt: {balance: false},
        }
    }
    * @param {string[]} addressesList example: ['0xddd...','0xa465...']
    * @param {string[]} tokenList ['eth','eos','ppt']
    * @return {object}  addressMap
    */
    function createAddressMap(addressesList, tokenList) {
        const addressMap = {};
        for (let i = 0; i < addressesList.length; i += 1) {
            addressMap[addressesList[i]] = createTokenMap(tokenList, i + 1);
        }
        return addressMap;
    }

    /**
    * create addressList object which contains the info for each address: ballance per token and index
    * @param {string[]} tokenList example: ['eth','eos','ppt']
    * @param {keystore} keystore The new keystore
    *
    * @return {object}      An action object with a type of GENERATE_KEYSTORE_SUCCESS passing the repos
    */
    // export function generateKeystoreSuccess(keystore, tokenList) {
    //     const addresses = keystore.getAddresses();
    //     const addressMap = createAddressMap(addresses, tokenList);
    //     /* output:
    //         addressMap: {
    //             address1: {
    //                 index: 1
    //                 eth: {balance: false},
    //                 eos: {balance: false},
    //                 ppt: {balance: false},
    //             }
    //     } */
    //     return {
    //         type: GENERATE_KEYSTORE_SUCCESS,
    //         keystore,
    //         addressMap,
    //     };
    // }
    export function generateKeystoresSuccess(keystores, tokenList) { //G
        let addresses = [];
        for (let index = 0; index < keystores.length; index++) {
            addresses.push(keystores[index].getAddresses());
            
        }
        const addressMap = createAddressMap(addresses, tokenList);
        /* output:
            addressMap: {
                address1: {
                    index: 1
                    eth: {balance: false},
                    eos: {balance: false},
                    ppt: {balance: false},
                }
        } */
        return {
            type: GENERATE_KEYSTORES_SUCCESS,
            keystores,
            addressMap,
        };
    }

    /**
    * Dispatched when generating the wallet fails
    *
    * @param  {object} error The error
    *
    * @return {object} An action object with a type of GENERATE_KEYSTORE_ERROR passing the error
    */
    export function generateKeystoreError(error) {
        return {
            type: GENERATE_KEYSTORE_ERROR,
            error,
        };
    }
    export function saveRom(objRom) {
        return {
            type: SAVE_OBJ_ROM,
            objRom,
        };
    }
    

    /**
    * Dispatched when retoring wallet from seed 
    *
    *
    * @return {object} An action object with a type of  passing the error
    */
    export function nameAssociatedToRestoredWalletSeed(thename, theaddress) {
        return {
            type: NAME_FROM_RESTORE_WALLET_SEED,
            thename,
            theaddress,
        };
    }

    export function nameAssociatedToRestoredWalletPK(thename, theaddress) {
        return {
            type: NAME_FROM_RESTORE_WALLET_PK,
            thename,
            theaddress,
        };
    }


    /* **********************************Change balance ********************** */
    /**
    * Changes ballance for a given address and symbol
    * If address dont exist - new address will be created same for symbol
    *
    * @param  {string} address as string
    * @param  {string} symbol 'eth' or other
    * @param  {string} balance BigNumber object
    *
    * @return {object} An action object with a type of CHANGE_BALANCE with address and balance
    */
    export function changeBalance(address, symbol, balance) {
        return {
            type: CHANGE_BALANCE,
            address,
            symbol,
            balance,
        };
    }

    /* ******************* Show / hide SEND_TOKEN ***************************** */
    /**
    * Show the SendToken container
    * @param  {string} address '0xa4b..'
    * @param  {string} [sendTokenSymbol] 'eth' or other
    *
    * @return {object} An action object with a type of SHOW_SEND_TOKEN
    */
    export function showSendToken(address, sendTokenSymbol) {
        // console.log(address);
        return {
            type: SHOW_SEND_TOKEN,
            address,
            sendTokenSymbol,
        };
    }

    /**
    * Hide the SendToken container
    *
    * @return {object}    An action object with a type of HIDE_SEND_TOKEN
    */
    export function hideSendToken() {
        return {
            type: HIDE_SEND_TOKEN,
        };
    }

    /* ******************* Show / hide TOKEN_CHOOSER ***************************** */
    /**
    * Show the TokenChooser container
    *
    * @return {object}    An action object with a type of SHOW_TOKEN_CHOOSER
    */
    export function showTokenChooser() {
        return {
            type: SHOW_TOKEN_CHOOSER,
        };
    }

    /**
    * Hide the TokenChooser container
    *
    * @return {object}    An action object with a type of HIDE_TOKEN_CHOOSER
    */
    export function hideTokenChooser() {
        return {
            type: HIDE_TOKEN_CHOOSER,
        };
    }


    /* ******************* UPDATE_TOKEN_INFO ***************************** */

    /**
    * Update tokenInfo object and regenerate addressMap with new tokens
    * @param  {string[]} addressList ['0xffd..']
    * @param  {object} newTokenInfo tokens to use (eth not included)
    *
    * @return {object}    An action object with a type of UPDATE_TOKEN_INFO, tokenInfo and addressMap
    */
    export function updateTokenInfo(addressList, newTokenInfo) {
        const tokenInfo = {
            eth: {
            name: 'Ethereum',
            contractAddress: null,
            decimals: 18,
            },
            ...newTokenInfo,
        };

        const addressMap = createAddressMap(addressList, Object.keys(tokenInfo));

        return {
            type: UPDATE_TOKEN_INFO,
            tokenInfo,
            addressMap,
        };
    }


    /* ******************* Generate new address from existing keystore********** */
    /**
    * Generate new address and attach it to store
    *
    *
    * @return {object} An action object with a type of GENERATE_ADDRESS
    */
    export function generateAddress() {
        return {
            type: GENERATE_ADDRESS,
        };
    }
    export function checkingAdrIsInOurDBDoneSwitch() {
        return {
            type: CHECKING_ADR_IN_DB_DONE_SWITCH,
        };
    }
    export function checkingAdrIsInOurDBDoneSwitchPK() {
        return {
            type: CHECKING_ADR_IN_DB_DONE_SWITCH_PK,
        };
    }

    /**
    * After successfull address generation create new addressList for our store.
    *
    * @param {string} newAddress the updated keystore
    * @param {number} index address serial number of generation
    * @param {string[]} tokenList example: ['eth','eos','ppt']
    *
    * @return {object} An action object with a type of GENERATE_ADDRESS_SUCCESS,
    * newAddress and tokenMap for the new address
    */
    export function generateAddressSuccess(newAddress, index, tokenList) {
        const tokenMap = createTokenMap(tokenList);// , index);
        console.log(tokenMap);

        tokenMap.index = index;
        return {
            type: GENERATE_ADDRESS_SUCCESS,
            newAddress,
            tokenMap,
        };
    }

    /**
    * Dispatched when generating new address fails
    *
    * @param  {object} error The error
    *
    * @return {object} An action object with a type of GENERATE_ADDRESS_ERROR passing the error
    */
    export function generateAddressError(error) {
        return {
            type: GENERATE_ADDRESS_ERROR,
            error,
        };
    }


    /* **********************LOCK AND UNLOCK WALLET ***************************** */


    /**
    * Lock wallet by removing encription password from state (syncronic)
    *
    * @return {object} An action object with a type of LOCK_WALLET
    */
    export function lockWallet() {
        return {
            type: LOCK_WALLET,
        };
    }

    /**
    * Unlock wallet
    *
    * @return {object} An action object with a type of UNLOCK_WALLET
    */
    export function unlockWallet() {
        return {
            type: UNLOCK_WALLET,
        };
    }

    /**
    * Password given is checked to successfully unlock the wallet
    *
    * @param  {keystore} password for unlocking the wallet
    *
    * @return {object}      An action object with a type of UNLOCK_WALLET_SUCCESS and the password
    */
    export function unlockWalletSuccess(password) {
        return {
            type: UNLOCK_WALLET_SUCCESS,
            password,
        };
    }

    /**
    * Dispatched when password given by user is incorrect
    *
    * @param  {object} error
    *
    * @return {object} An action object with a type of GENERATE_ADDRESS_ERROR passing the error
    */
    export function unlockWalletError(error) {
        return {
            type: UNLOCK_WALLET_ERROR,
            error,
        };
    }

    /* ************************* Exchange Rates ************************************ */


    /**
    * Recives api response and requestUrl used, transforms the api response into the proper format to
    * save in state
    * requestUrl is used as identifier of the apiPrices
    *
    * @param  {string} requestURL the url used to get apiPrices
    * @param  {object[]} apiRates The response from external api
    * @param  {string} tokenList list of relevant tokens: ['eth','eos','ppt']
    * @return {object} An action object with a type of SET_EXCHANGE_RATES and rates converted to proper format:
    */
    export function setExchangeRates(apiRates, requestURL, tokenList) {
        const rates = extractRates(apiRates, requestURL, tokenList);
        return {
            type: SET_EXCHANGE_RATES,
            rates,
        };
    }

    /**
    * Change selected curency to convert to
    *
    * @param  {string} convertTo the selected currency to convert from eth
    *
    * @return {object} An action object with a type of SELECT_CURRENCY and selected currency
    */
    export function selectCurrency(convertTo) {
        return {
            type: SELECT_CURRENCY,
            convertTo,
        };
    }

    /* ********************* CLOSE WALLET **************************************** */


    /**
    * Removes keystore from memory and closes wallet
    *
    * @return {object} An action object with a type of CLOSE_WALLET
    */
    export function closeWallet() {
        return {
            type: CLOSE_WALLET,
        };
    }

    /* ********************* SAVE / LOAD WALLET To localstorage ******************* */
    /**
    * check whether there is a stored wallet and update the state.
    *
    * @return {object} An action object with a type of CHECK_LOCAL_STORAGE
    */
    export function checkLocalStorage() {
        return {
            type: CHECK_LOCAL_STORAGE,
        };
    }

    /**
    * Wallet found in local storage check.
    *
    * @return {object} An action object with a type of LOCAL_STORAGE_EXIST
    */
    export function localStorageExist() {
        return {
            type: LOCAL_STORAGE_EXIST,
        };
    }

    /**
    * Wallet NOT found in storage check.
    *
    * @return {object} An action object with a type of LOCAL_STORAGE_NOT_EXIST
    */
    export function localStorageNotExist() {
        return {
            type: LOCAL_STORAGE_NOT_EXIST,
        };
    }


    /**
    * Saves Wallet to local storage
    *
    * @return {object} An action object with a type of SAVE_WALLET
    */
    export function saveWallet() {
        return {
            type: SAVE_WALLET,
        };
    }
    /**
    * Saves Wallet success
    *
    * @return {object} An action object with a type of SAVE_WALLET_SUCCESS
    */
    export function saveWalletSuccess() {
        return {
            type: SAVE_WALLET_SUCCESS,
        };
    }
    /**
    * Saves Wallet error
    *
    * @return {object} An action object with a type of SAVE_WALLET_ERROR
    */
    export function saveWalletError(error) {
        console.warn(error);
        return {
            type: SAVE_WALLET_ERROR,
            error,
        };
    }

    /**
    * Load Wallet from local storage
    *
    * @return {object} An action object with a type of LOAD_WALLET
    */
    export function loadWallet() {
        return {
            type: LOAD_WALLET,
        };
    }

    /**
    * Load Wallet success
    *
    * @return {object} An action object with a type of LOAD_WALLET_SUCCESS
    */
    export function loadWalletSuccess() {
        return {
            type: LOAD_WALLET_SUCCESS,
        };
    }

    /**
    * Load Wallet from local storage
    *
    * @return {object} An action object with a type of LOAD_WALLET_ERROR
    */
    export function loadWalletError(error) {
        console.log(error);
        return {
            type: LOAD_WALLET_ERROR,
            error,
        };
    }

//#endregion


//#region SAGAS

    //#region Connection to network, sending eth, checking balances, 

        /* For development only, if online = false then most api calls will be replaced by constant values
        * affected functions:
        * loadNetwork() will connect to 'Local RPC' but default network name will be showen in gui
        * getRates() will not call rate api
        * checkFaucetApi() will not request
        * askFaucetApi() will get costant Tx as success
        */
        //const online = true;
        //if (!online) console.log('Debug mode: online = false in Header/saga.js');
    
        /**
        * connect to rpc and attach keystore as siger provider
        */
        export function* _loadNetwork() {
            try {
                const rpcAddress = Network['Rinkeby Testnet'].rpc;
                if (!rpcAddress) {
                // throw new Error(`${action.networkName} network not found`);
                throw new Error(`Rinkeby network not found`);
                }

                const keystore = yield select(makeSelectKeystore());

                if (keystore) {
                const provider = new SignerProvider(rpcAddress, {
                    signTransaction: keystore.signTransaction.bind(keystore),
                    accounts: (cb) => cb(null, keystore.getAddresses()),
                });

                web3.setProvider(provider);

                function getBlockNumberPromise() { // eslint-disable-line no-inner-declarations
                    return new Promise((resolve, reject) => {
                    web3.eth.getBlockNumber((err, data) => {
                        if (err !== null) return reject(err);
                        return resolve(data);
                    });
                    });
                }
                const blockNumber = yield call(getBlockNumberPromise);

                yield call(timer, 600);

                yield put(loadNetworkSuccess(blockNumber));

                // actions after succesfull network load :
                yield put(checkBalances());
                yield put(getExchangeRates());

                } else {
                throw new Error('keystore not initiated - Create wallet before connecting');
                }
            } catch (err) {
                // const errorString = `loadNetwork error - ${err.message}`;
                yield put(loadNetworkError(err.message));
            }
            /* This will happen after successful network load */
        }


        export function* _confirmSendTransaction() {
            try {
                const fromAddress = yield select(makeSelectFrom());
                const amount = yield select(makeSelectAmount());
                const toAddress = yield select(makeSelectTo());
                const gasPrice = yield select(makeSelectGasPrice());

                if (!web3.isAddress(fromAddress)) {
                    throw new Error('Source address invalid');
                }

                if (amount <= 0) {
                    throw new Error('Amount must be possitive');
                }

                if (!web3.isAddress(toAddress)) {
                    throw new Error('Destenation address invalid');
                }

                if (!(gasPrice > 0.1)) {
                    throw new Error('Gas price must be at least 0.1 Gwei');
                }

                const msg = `Transaction created successfully. 
            Sending ${amount} from ...${fromAddress.slice(-5)} to ...${toAddress.slice(-5)}`;
                yield put(confirmSendTransactionSuccess(msg));
            } catch (err) {
                // const errorString = `confirmSendTransaction error - ${err.message}`;
                yield put(confirmSendTransactionError(err.message));
            }
        }

        export function* SendTransaction() {
            const keystore = yield select(makeSelectKeystore());
            const origProvider = keystore.passwordProvider;
            try {
                const fromAddress = yield select(makeSelectFrom());
                const amount = yield select(makeSelectAmount());
                const toAddress = yield select(makeSelectTo());
                const gasPrice = new BigNumber(yield select(makeSelectGasPrice())).times(Gwei);
                const password = yield select(makeSelectPassword());

                const tokenToSend = yield select(makeSelectSendTokenSymbol());

                if (!password) {
                    throw new Error('No password found - please unlock wallet before send');
                }
                if (!keystore) {
                    throw new Error('No keystore found - please create wallet');
                }
                keystore.passwordProvider = (callback) => {
                    // we cannot use selector inside this callback so we use a const value
                    const ksPassword = password;
                    callback(null, ksPassword);
                };

                let tx;
                if (tokenToSend === 'eth') {
                    const sendAmount = new BigNumber(amount).times(Ether);
                    const sendParams = { from: fromAddress, to: toAddress, value: sendAmount, gasPrice, gas: maxGasForEthSend };
                    function sendTransactionPromise(params) { // eslint-disable-line no-inner-declarations
                        return new Promise((resolve, reject) => {
                            web3.eth.sendTransaction(params, (err, data) => {
                                if (err !== null) return reject(err);
                                return resolve(data);
                            });
                        });
                    }
                    tx = yield call(sendTransactionPromise, sendParams);
                } else { // any other token
                    const tokenInfo = yield select(makeSelectTokenInfo(tokenToSend));
                    if (!tokenInfo) {
                        throw new Error(`Contract address for token '${tokenToSend}' not found`);
                    }
                    const contractAddress = tokenInfo.contractAddress;
                    const sendParams = { from: fromAddress, value: '0x0', gasPrice, gas: maxGasForTokenSend };
                    const tokenAmount = amount * (10 ** tokenInfo.decimals); // Big Number??

                    function sendTokenPromise(tokenContractAddress, sendToAddress, sendAmount, params) { // eslint-disable-line no-inner-declarations
                        return new Promise((resolve, reject) => {
                            const tokenContract = erc20Contract.at(tokenContractAddress);
                            tokenContract.transfer.sendTransaction(sendToAddress, sendAmount, params, (err, sendTx) => {
                                if (err) return reject(err);
                                return resolve(sendTx);
                            });
                        });
                    }
                    tx = yield call(sendTokenPromise, contractAddress, toAddress, tokenAmount, sendParams);
                }

                yield put(sendTransactionSuccess(tx));
            } catch (err) {
                const loc = err.message.indexOf('at runCall');
                const errMsg = (loc > -1) ? err.message.slice(0, loc) : err.message;
                yield put(sendTransactionError(errMsg));
            } finally {
                keystore.passwordProvider = origProvider;
            }
        }


        /* *************  Polling saga and polling flow for check balances ***************** */
        export function getEthBalancePromise(address) {
            return new Promise((resolve, reject) => {
                web3.eth.getBalance(address, (err, data) => {
                    if (err !== null) return reject(err);
                    return resolve(data);
                });
            });
        }

        export function getTokenBalancePromise(address, tokenContractAddress) {
            return new Promise((resolve, reject) => {
                const tokenContract = erc20Contract.at(tokenContractAddress);
                tokenContract.balanceOf.call(address, (err, balance) => {
                    if (err) return reject(err);
                    return resolve(balance);
                });
            });
        }


        function* checkTokenBalance(address, symbol) {
            if (!address || !symbol) {
                return null;
            }
            const tokenInfo = yield select(makeSelectTokenInfo(symbol));
            const contractAddress = tokenInfo.contractAddress;

            const balance = yield call(getTokenBalancePromise, address, contractAddress);

            yield put(changeBalance(address, symbol, balance));

            return true;
        }

        function* checkTokensBalances(address) {
            const opt = {
                returnList: true,
                removeIndex: true,
                removeEth: true,
            };
            const tokenList = yield select(makeSelectAddressMap(address, opt));

            for (let i = 0; i < tokenList.length; i += 1) {
                const symbol = tokenList[i];
                // console.log('address: ' + address + ' token: ' + tokenList[i]);
                yield checkTokenBalance(address, symbol);
            }
            // console.log(tokenMap);
        }

        export function* checkAllBalances() {
            try {
                let j = 0;
                const addressList = yield select(makeSelectAddressMap(false, { returnList: true }));
                // console.dir(addressList);
                do { // Iterate over all addresses and check for balance
                    const address = addressList[j];
                    // handle eth
                    const balance = yield call(getEthBalancePromise, address);
                    yield put(changeBalance(address, 'eth', balance));

                    // handle tokens
                    yield checkTokensBalances(address);

                    j += 1;
                } while (j < addressList.length);

                yield put(checkBalancesSuccess());
            } catch (err) {
                console.dir(err);
                yield put(CheckBalancesError(err.message));
            }
        }

        // Utility function for delay effects
        function delay(millisec) {
            const promise = new Promise((resolve) => {
                setTimeout(() => resolve(true), millisec);
            });
            return promise;
        }

        // Fetch data every X seconds
        function* pollData() {
            try {
                // console.log('pollData');
                yield call(delay, timeBetweenCheckbalances);

                yield put(checkBalances());
            } catch (error) {
                // console.log('pollData Error');
                // cancellation error -- can handle this if you wish
            }
        }

        // Start Polling when first call to checkAllBalances succeded or fails
        // Wait for successful response or fail, then fire another request
        // Cancel polling on STOP_POLL_BALANCES
        function* watchPollData() {
            while (true) { // eslint-disable-line
                yield take([CHECK_BALANCES_SUCCESS, CHECK_BALANCES_ERROR]);
                yield race([ // eslint-disable-line
                    call(pollData),
                    take(STOP_POLL_BALANCES),
                ]);
            }
        }
        /* ******************************************************************************** */

        /**
         * Get exchange rates from api
         */
        export function* getRates() {
            // const requestURL = 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR';
            const requestURL = 'https://api.coinmarketcap.com/v1/ticker/?convert=EUR';
            try {

                // Call our request helper (see 'utils/request')
                const apiRates = yield call(request, requestURL);

                // console.log(apiPrices);

                const tokenList = yield select(makeSelectTokenInfoList());

                yield put(setExchangeRates(apiRates, requestURL, tokenList));
                yield put(getExchangeRatesSuccess());
            } catch (err) {
                yield put(getExchangeRatesError(err));
            }
        }

        /**
         * Check if faucet ready via api
         */
        export function* checkFaucetApi() {
            const requestURL = checkFaucetAddress;
            // console.log(`requestURL: ${requestURL}`);
            try {
                // const result = online ? yield call(request, requestURL) :
                const result = yield call(request, requestURL); // :
                    //{ message: { serviceReady: true } };

                if (result.message.serviceReady) {
                    yield put(checkFaucetSuccess());
                } else {
                    yield put(checkFaucetError('faucet not ready'));
                }
            } catch (err) {
                yield put(checkFaucetError(err));
            }
        }


        /**
         * Check if faucet ready via api
         */
        export function* askFaucetApi() {
            const addressList = yield select(makeSelectAddressList());
            const askAddress = addressList.keySeq().toArray()[0];
            const requestURL = `${askFaucetAddress}?address=${askAddress}`;
            // console.log(`requestURL: ${requestURL}`);
            try {
                const result = yield call(request, requestURL) //:
                // const result = online ? yield call(request, requestURL) :
                    // { message: { tx: '0x0f71ca4a8af03e67f06910bf301308ecd701064bd2183b51e1e3ca18af9bc9f8' } };
                if (result.message.tx) {
                    yield put(askFaucetSuccess(result.message.tx));
                } else {
                    yield put(askFaucetError(result.message));
                }
            } catch (err) {
                yield put(askFaucetError(err));
            }
        }

    //#endregion
    
    //#region WALLET KEYSTORE 
    /**
    * Create new seed and password
    */
    export function* _generateWallet() {
        try {
            const password = generateString(generatedPasswordLength);
            const extraEntropy = generateString(generatedPasswordLength);
            const seed = lightwallet.keystore.generateRandomSeed(extraEntropy);

            yield call(timer, 500);

            yield put(generateWalletSucces(seed, password));
        } catch (err) {
            yield put(generateWalletError(err));
        }
    }

    
    /**
    * Check wallet name available
    */
    export function* _checkWalletNameAvailable(action) {
        yield put(checkWalletNameAvailableSuccess(action.name));
        // try {
        //     const response = yield call(fetch, 'http://localhost:5000/api/address/isadressexist/'+action.name);
        //     if (response.status >= 200 && response.status < 300) {
        //         // console.log(response.status);
        //     } else {
        //         yield put(checkWalletNameAvailableError());
        //     }
        // } catch (e) {
        //     yield put(checkWalletNameAvailableError());
        // }
    }

    /**
    * restore from private key  
    */
    export function* restoreFromPK() {//G
        try {
            const userPasswordPK = yield select(makeSelectUserPasswordPK());
            const extraEntropy = generateString(generatedPasswordLength);
            let seed = lightwallet.keystore.generateRandomSeed(extraEntropy);

            // remove trailing spaces if needed
            // yield put(changeUserSeed(userSeed.replace(/^\s+|\s+$/g, '')));
            seed = seed.replace(/^\s+|\s+$/g, '');//yield select(makeSelectUserSeed());

            if (!lightwallet.keystore.isSeedValid(seed)) {
                yield put(restoreWalletFromPKError('Invalid seed'));
                return;
            }

            if (userPasswordPK.length < 8) {
                yield put(restoreWalletFromPKError('Password length must be 8 characters at least'));
                return;
            }

            // yield put(restoreWalletFromSeedSuccess(userSeed, userPassword));
            yield put(restoreWalletFromPKSuccess(seed, userPasswordPK));
            yield put(genKeystoreRestorePKModeAction());
            // yield put(genKeystoreRestoreSeedModeAction());
        } catch (err) {
            yield put(restoreWalletFromSeedError(err));
        }
    }
    // export function* restoreFromPK() {
    //     try {
    //         const userPasswordPK = yield select(makeSelectUserPasswordPK());
    //         const extraEntropy = generateString(generatedPasswordLength);
    //         let seed = lightwallet.keystore.generateRandomSeed(extraEntropy);

    //         // remove trailing spaces if needed
    //         // yield put(changeUserSeed(userSeed.replace(/^\s+|\s+$/g, '')));
    //         seed = seed.replace(/^\s+|\s+$/g, '');//yield select(makeSelectUserSeed());

    //         if (!lightwallet.keystore.isSeedValid(seed)) {
    //             yield put(restoreWalletFromPKError('Invalid seed'));
    //             return;
    //         }

    //         if (userPasswordPK.length < 8) {
    //             yield put(restoreWalletFromPKError('Password length must be 8 characters at least'));
    //             return;
    //         }
            
    //         let userPK = yield select(makeSelectUserPK());
    //         if (userPK.length == 0 ) { // TODO MORE CONTROL ON PKEY
    //             yield put(restoreWalletFromPKError('PK WRONG FORMAT'));
    //             return;
    //         }



    //         const pwDvkey = yield call(derivedKeyPromise, userPasswordPK);

    //         let adrss = lightwallet.keystore.importPrivateKey(userPK, pwDvkey);

    //         console.log(adrss);

    //         if (adrss.length == 0 ) {
    //             yield put(restoreWalletFromPKError('Could not generate address from PK'));
    //             return;
    //         }

    //         yield put(restoreWalletFromPKSuccess(userPK, userPasswordPK));

    //         const response = yield call(fetch, 'http://localhost:5000/api/address/getnameofaddress/'+adrss);
    //         // console.dir(datat);
    //         if (response.status >= 200 && response.status < 300) {
    //             const datat = yield call([response, response.json])
    //             console.dir("we had it in DB");
    //             lastNameGiven = datat.name;
    //             yield put(nameAssociatedToRestoredWalletPK(datat.name, adrss));
    //         } else {
    //             console.log("wrong response fetch or we hadnt it in DB" );
    //             // if nothing then send .set('namefoundonrestore', "")  .set('checkingAdrIsInOurDBDone', true)
    //             yield put(nameAssociatedToRestoredWalletPK(null, adrss));
    //         }

    //         // yield put(genKeystoreRestorePKModeAction());
    //     } catch (err) {
    //         yield put(restoreWalletFromPKError(err));
    //         const errorString = `genKeystore error 2 - ${err}`;
    //         yield put(generateKeystoreError(errorString));
    //     }
    // }

    /**
    * check seed given by user
    */
    export function* restoreFromSeed() {
        try {
            const userPassword = yield select(makeSelectUserPassword());
            let userSeed = yield select(makeSelectUserSeed());

            // remove trailing spaces if needed
            yield put(changeUserSeed(userSeed.replace(/^\s+|\s+$/g, '')));
            userSeed = yield select(makeSelectUserSeed());

            if (!lightwallet.keystore.isSeedValid(userSeed)) {
                yield put(restoreWalletFromSeedError('Invalid seed'));
                return;
            }

            if (userPassword.length < 8) {
                yield put(restoreWalletFromSeedError('Password length must be 8 characters at least'));
                return;
            }

            yield put(restoreWalletFromSeedSuccess(userSeed, userPassword));
            yield put(genKeystoreRestoreSeedModeAction());
        } catch (err) {
            yield put(restoreWalletFromSeedError(err));
        }
    }

    function derivedKeyPromise(param) {
        return new Promise((resolve, reject) => {
            lightwallet.keystore.keyFromPassword(param, (err, pwDerivedKey) => {  
                if (err !== null) return reject(err);
                return resolve(pwDerivedKey);
            })
        });
    }


    /* keyStore.createVault({password: password,
        seedPhrase: '(opt)seed',entropy: '(opt)additional entropy',salt: '(opt)'}, function (err, ks) {}); */
    function createVaultPromise(param) {
        return new Promise((resolve, reject) => {
            lightwallet.keystore.createVault(param, (err, data) => {
                if (err !== null) return reject(err);
                return resolve(data);
            });
        });
    }

    /**
    * Create new keystore and generate some addreses
    */
    // export function* genKeystore() {
    //     try {
    //         lastNameGiven = yield select(makeSelectwalletNameAvailable());
    //         const password = yield select(makeSelectPassword());
    //         const seedPhrase = yield select(makeSelectSeed());
    //         const opt = {
    //             password,
    //             seedPhrase,
    //             hdPathString,
    //         };
    //         // allow time to render components before cpu intensive tasks:
    //         yield call(timer, 300);


    //         function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
    //             return new Promise((resolve, reject) => {
    //                 ks.keyFromPassword(param, (err, data) => {
    //                     if (err !== null) return reject(err);
    //                     return resolve(data);
    //                 });
    //             });
    //         }

    //         const ks = yield call(createVaultPromise, opt);

    //         ks.passwordProvider = (callback) => {
    //             // const password = yield select(makeSelectPassword());
    //             const pw = prompt('Please enter keystore password', 'Password'); // eslint-disable-line
    //             callback(null, pw);
    //         };

    //         const pwDerivedKey = yield call(keyFromPasswordPromise, password);
    //         ks.generateNewAddress(pwDerivedKey, 1);

    //         const tokenList = yield select(makeSelectTokenInfoList());

    //         yield put(generateKeystoreSuccess(ks, tokenList));
    //         yield put(loadNetwork());
    //         yield put(saveWallet());
    //     } catch (err) {
    //         const errorString = `genKeystore error 3 - ${err}`;
    //         yield put(generateKeystoreError(errorString));
    //     }
    // }
    export function* genKeystore() {//G
        try {
            lastNameGiven = yield select(makeSelectwalletNameAvailable());
            const password = yield select(makeSelectPassword());
            const seedPhrase = yield select(makeSelectSeed());
            const opt = {
                password,
                seedPhrase,
                hdPathString,
            };
            // allow time to render components before cpu intensive tasks:
            yield call(timer, 300);

            function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
                return new Promise((resolve, reject) => {
                    ks.keyFromPassword(param, (err, data) => {
                        if (err !== null) return reject(err);
                        return resolve(data);
                    });
                });
            }

            const ks = yield call(createVaultPromise, opt);

            ks.passwordProvider = (callback) => {
                // const password = yield select(makeSelectPassword());
                const pw = prompt('Please enter keystore password', 'Password'); // eslint-disable-line
                callback(null, pw);
            };

            const pwDerivedKey = yield call(keyFromPasswordPromise, password);
            ks.generateNewAddress(pwDerivedKey, 1);

            ks.associateNameToAddress(ks.getAddresses().slice(-1)[0], lastNameGiven);
            const tokenList = yield select(makeSelectTokenInfoList());

            let kss = [];
            kss.push(ks);
            yield put(generateKeystoresSuccess(kss, tokenList));
            yield put(loadNetwork());
            yield put(saveWallet());
            const objRom = {
                type: 'seed',
                value: seedPhrase,
                ps: password,
            };
            const objromListImmutable = yield select(makeSelectObjRom());
            yield put(saveRom(objromListImmutable.set(objromListImmutable.size, objRom)));
        } catch (err) {
            const errorString = `genKeystore error 3 - ${err}`;
            yield put(generateKeystoreError(errorString));
        }
    }


    let tmp_ks = [];//G
    let tmp_objRom = {};//G
    export function* genKeystoreRestoreSeedModeCleanUp() {//G
        try {
            // lastNameGiven = yield select(makeSelectwalletNameRestoredFromSeed());
            // console.log("lastnaemgiven " + lastNameGiven);
            // next they will validate and come here 
            //put an actioin that will   // .set('isShowRestoreWallet', false)
                // .set('checkingAdrIsInOurDB', true)
                const tokenList = yield select(makeSelectTokenInfoList());

                
                let kss = [];
                kss.push(tmp_ks);
                yield put(generateKeystoresSuccess(kss, tokenList));
                yield put(loadNetwork());
                const objromListImmutable = yield select(makeSelectObjRom());
                yield put(saveRom(objromListImmutable.set(objromListImmutable.size, tmp_objRom)));
                yield put(saveWallet());

        } catch (err) {
            const errorString = `genKeystore error 4 - ${err}`;
            yield put(generateKeystoreError(errorString));
        }
    }
    export function* genKeystoreRestoreSeedMode() {//G
        try {
            // lastNameGiven = yield select(makeSelectwalletNameAvailable());
            const password = yield select(makeSelectPassword());
            const seedPhrase = yield select(makeSelectSeed());
            const opt = {
                password,
                seedPhrase,
                hdPathString,
            };
            // allow time to render components before cpu intensive tasks:
            yield call(timer, 300);


            function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
                return new Promise((resolve, reject) => {
                    tmp_ks.keyFromPassword(param, (err, data) => {
                        if (err !== null) return reject(err);
                        return resolve(data);
                    });
                });
            }

            tmp_ks = yield call(createVaultPromise, opt);

            tmp_ks.passwordProvider = (callback) => {
                // const password = yield select(makeSelectPassword());
                const pw = prompt('Please enter keystore password', 'Password'); // eslint-disable-line
                callback(null, pw);
            };

            const pwDerivedKey = yield call(keyFromPasswordPromise, password);
            tmp_ks.generateNewAddress(pwDerivedKey, 1);

            // get name for this address 
                const newAddress = tmp_ks.getAddresses().slice(-1)[0];
                const response = yield call(fetch, 'http://localhost:5000/api/address/getnameofaddress/'+newAddress);
                // console.dir(datat);
                if (response.status >= 200 && response.status < 300) {
                    const datat = yield call([response, response.json])
                    console.dir("we had it in DB");
                    lastNameGiven = datat.name;
                    yield put(nameAssociatedToRestoredWalletSeed(datat.name, newAddress));
                    tmp_ks.associateNameToAddress(newAddress, lastNameGiven);
                } else {
                    console.log("wrong response fetch or we hadnt it in DB" );
                    // if nothing then send .set('namefoundonrestore', "")  .set('checkingAdrIsInOurDBDone', true)
                    yield put(nameAssociatedToRestoredWalletSeed(null, newAddress));
                }
            
            // if okay then send it found  .set('namefoundonrestore', "")  .set('checkingAdrIsInOurDBDone', true)

            // // next they will validate and come here 
            // //put an actioin that will   // .set('isShowRestoreWallet', false)
            //     // .set('checkingAdrIsInOurDB', true)
            // const tokenList = yield select(makeSelectTokenInfoList());

            // yield put(generateKeystoreSuccess(tmp_ks, tokenList));
            // yield put(loadNetwork());
            // yield put(saveWallet());
            tmp_objRom = {
                type: 'seed',
                value: seedPhrase,
                ps: password,
            };
        } catch (err) {
            const errorString = `genKeystore error 5 - ${err}`;
            yield put(generateKeystoreError(errorString));
        }
    }



    export function* genKeystoreRestorePKModeCleanUp() {//G
        try {
            // lastNameGiven = yield select(makeSelectwalletNameRestoredFromSeed());
            // console.log("lastnaemgiven " + lastNameGiven);
            // next they will validate and come here 
            //put an actioin that will   // .set('isShowRestoreWallet', false)
                // .set('checkingAdrIsInOurDB', true)
                const tokenList = yield select(makeSelectTokenInfoList());

                //yield put(generateKeystoreSuccess(tmp_ks, tokenList));//G
                // yield put(loadNetwork());
                // yield put(saveWallet());
                let kss = [];
                kss.push(tmp_ks);
                yield put(generateKeystoresSuccess(kss, tokenList));
                yield put(loadNetwork());
                const objromListImmutable = yield select(makeSelectObjRom());
                yield put(saveRom(objromListImmutable.set(objromListImmutable.size, tmp_objRom)));
                yield put(saveWallet());
        } catch (err) {
            const errorString = `genKeystore CRestore error  - ${err}`;
            yield put(generateKeystoreError(errorString));
        }
    }
    export function* genKeystoreRestorePKMode() {//G
        try {
            // lastNameGiven = yield select(makeSelectwalletNameAvailable());
            const userPK = yield select(makeSelectUserPK());
            const password = yield select(makeSelectPassword());
            const seedPhrase = yield select(makeSelectSeed());
            const opt = {
                password,
                seedPhrase,
                hdPathString,
            };
            // allow time to render components before cpu intensive tasks:
            yield call(timer, 300);


            function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
                return new Promise((resolve, reject) => {
                    tmp_ks.keyFromPassword(param, (err, data) => {
                        if (err !== null) return reject(err);
                        return resolve(data);
                    });
                });
            }

            tmp_ks = yield call(createVaultPromise, opt);

            tmp_ks.passwordProvider = (callback) => {
                // const password = yield select(makeSelectPassword());
                const pw = prompt('Please enter keystore password', 'Password'); // eslint-disable-line
                callback(null, pw);
            };

            const pwDerivedKey = yield call(keyFromPasswordPromise, password);
            // tmp_ks.generateNewAddress(pwDerivedKey, 1);//HEREEEEEEE
            console.dir(tmp_ks);
            tmp_ks.importPrivateKey(userPK, pwDerivedKey);
            console.dir(tmp_ks.getAddresses());
            // let adrss = tmp_ks.getAddresses().slice(-1)[0];
            // console.log(adrss);

            // if (adrss.length == 0 ) {
            //     yield put(restoreWalletFromPKError('Could not generate address from PK'));
            //     return;
            // }

            // get name for this address 
                const newAddress = tmp_ks.getAddresses().slice(-1)[0];
                console.log("my new friend " + newAddress);
                const response = yield call(fetch, 'http://localhost:5000/api/address/getnameofaddress/'+newAddress);
                // console.dir(datat);
                if (response.status >= 200 && response.status < 300) {
                    const datat = yield call([response, response.json])
                    console.dir("we had it in DB");
                    lastNameGiven = datat.name;
                    tmp_ks.associateNameToAddress(newAddress, lastNameGiven);
                    yield put(nameAssociatedToRestoredWalletPK(datat.name, newAddress));
                } else {
                    console.log("wrong response fetch or we hadnt it in DB" );
                    // if nothing then send .set('namefoundonrestore', "")  .set('checkingAdrIsInOurDBDone', true)
                    yield put(nameAssociatedToRestoredWalletPK(null, newAddress));
                }
            
            // if okay then send it found  .set('namefoundonrestore', "")  .set('checkingAdrIsInOurDBDone', true)

            // // next they will validate and come here 
            // //put an actioin that will   // .set('isShowRestoreWallet', false)
            //     // .set('checkingAdrIsInOurDB', true)
            // const tokenList = yield select(makeSelectTokenInfoList());

            // yield put(generateKeystoreSuccess(tmp_ks, tokenList));
            // yield put(loadNetwork());
            // yield put(saveWallet());
            tmp_objRom = {
                type: 'pk',
                value: seedPhrase,
                ps: password,
            };
        } catch (err) {
            const errorString = `genKeystore error 15 - ${err}`;
            console.log("genKeystore error 15 - "+ err);
            console.dir(err);
            yield put(generateKeystoreError(errorString));
        }
    }
    

    /**
    * Generate new address from same key
    * will run after GENERATE_ADDRESS action
    */
    // export function* _generateAddress() {
    //     try {
    //         const ks = yield select(makeSelectKeystore());
    //         if (!ks) {
    //             throw new Error('No keystore found');
    //         }

    //         const password = yield select(makeSelectPassword());
    //         if (!password) {
    //             // TODO: Handle password
    //             throw new Error('Wallet Locked');
    //         }

    //         function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
    //             return new Promise((resolve, reject) => {
    //                 ks.keyFromPassword(param, (err, data) => {
    //                     if (err !== null) return reject(err);
    //                     return resolve(data);
    //                 });
    //             });
    //         }

    //         const pwDerivedKey = yield call(keyFromPasswordPromise, password);
    //         ks.generateNewAddress(pwDerivedKey, 1);


    //         const tokenList = yield select(makeSelectTokenInfoList());
    //         // get last address
    //         const newAddress = ks.getAddresses().slice(-1)[0];
    //         const index = ks.getAddresses().length; // serial index for sorting by generation order;
    //         yield put(generateAddressSuccess(newAddress, index, tokenList));
    //         yield put(saveWallet());

    //         // balance checking for new address (will be aborted in offline mode)
    //         try {
    //             const balance = yield call(getEthBalancePromise, newAddress);
    //             yield put(changeBalance(newAddress, 'eth', balance));
    //         } catch (err) { }  // eslint-disable-line 
    //     } catch (err) {
    //         yield call(timer, 1000); // eye candy
    //         yield put(generateAddressError(err.message));
    //     }
    // }

    export function* _generateAddress() {//G
        try {
            const ks = yield select(makeSelectKeystores());
            if (!ks) {
                throw new Error('No keystore found');
            }

            const objromListImmutable = yield select(makeSelectObjRom());
            const password = objromListImmutable.getIn([0, 'ps']);
            // const password = yield select(makeSelectPassword());
            if (!password) {
                // TODO: Handle password
                throw new Error('Wallet Locked');
            }

            function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
                return new Promise((resolve, reject) => {
                    ks.getIn([0]).keyFromPassword(param, (err, data) => {
                        if (err !== null) return reject(err);
                        return resolve(data);
                    });
                });
            }

            const pwDerivedKey = yield call(keyFromPasswordPromise, password);
            ks.getIn([0]).generateNewAddress(pwDerivedKey, 1);
            //u have to add in the map. 


            const tokenList = yield select(makeSelectTokenInfoList());
            // get last address
            const newAddress = ks.getIn([0]).getAddresses().slice(-1)[0];
            const index = ks.getIn([0]).getAddresses().length; // serial index for sorting by generation order;
            yield put(generateAddressSuccess(newAddress, index, tokenList));
            yield put(saveWallet());

            // balance checking for new address (will be aborted in offline mode)
            try {
                const balance = yield call(getEthBalancePromise, newAddress);
                yield put(changeBalance(newAddress, 'eth', balance));
            } catch (err) { }  // eslint-disable-line 
        } catch (err) {
            yield call(timer, 1000); // eye candy
            yield put(generateAddressError(err.message));
        }
    }

    /**
    * unlock wallet using user given password
    */
    // export function* _unlockWallet() {
    //     try {
    //         const currentPassword = yield select(makeSelectPassword());
    //         if (currentPassword) {
    //             throw Error('Wallet Already unlocked');
    //         }

    //         const ks = yield select(makeSelectKeystore());
    //         if (!ks) {
    //             throw new Error('No keystore to unlock');
    //         }

    //         const passwordProvider = ks.passwordProvider;

    //         function passwordProviderPromise() { // eslint-disable-line no-inner-declarations
    //             return new Promise((resolve, reject) => {
    //                 passwordProvider((err, data) => {
    //                     if (err !== null) return reject(err);
    //                     return resolve(data);
    //                 });
    //             });
    //         }

    //         function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
    //             return new Promise((resolve, reject) => {
    //                 ks.keyFromPassword(param, (err, data) => {
    //                     if (err !== null) return reject(err);
    //                     return resolve(data);
    //                 });
    //             });
    //         }

    //         const userPassword = yield call(passwordProviderPromise);

    //         if (!userPassword) {
    //             throw Error('No password entered');
    //         }

    //         const pwDerivedKey = yield call(keyFromPasswordPromise, userPassword);
    //         // TODO: Move into password provider?
    //         const isPasswordCorrect = ks.isDerivedKeyCorrect(pwDerivedKey);

    //         if (!isPasswordCorrect) {
    //             throw Error('Invalid Password');
    //         }

    //         yield put(unlockWalletSuccess(userPassword));
    //     } catch (err) {
    //         const errorString = `Unlock wallet error - ${err.message}`;
    //         yield put(unlockWalletError(errorString));
    //     }
    // }


    export function* _unlockWallet() {//G
        try {
            const objromListImmutable = yield select(makeSelectObjRom());
            const currentPassword = objromListImmutable.getIn([0, 'ps']);
            // const currentPassword = yield select(makeSelectPassword());
            if (currentPassword) {
                throw Error('Wallet Already unlocked');
            }

            const ks = yield select(makeSelectKeystores());
            if (!ks) {
                throw new Error('No keystore found');
            }

            const passwordProvider = ks.getIn([0]).passwordProvider;

            function passwordProviderPromise() { // eslint-disable-line no-inner-declarations
                return new Promise((resolve, reject) => {
                    passwordProvider((err, data) => {
                        if (err !== null) return reject(err);
                        return resolve(data);
                    });
                });
            }

            function keyFromPasswordPromise(param) { // eslint-disable-line no-inner-declarations
                return new Promise((resolve, reject) => {
                    ks.getIn([0]).keyFromPassword(param, (err, data) => {
                        if (err !== null) return reject(err);
                        return resolve(data);
                    });
                });
            }

            const userPassword = yield call(passwordProviderPromise);

            if (!userPassword) {
                throw Error('No password entered');   
            }

            const pwDerivedKey = yield call(keyFromPasswordPromise, userPassword);
            // TODO: Move into password provider?
            const isPasswordCorrect = ks.getIn([0]).isDerivedKeyCorrect(pwDerivedKey);

            if (!isPasswordCorrect) {
                throw Error('Invalid Password');
            }

            // yield put(unlockWalletSuccess(userPassword));
            const objRom = {
                type: '?',
                value: '?',
                ps: userPassword,
            };
            // const objromListImmutable = yield select(makeSelectObjRom());
            yield put(saveRom(objromListImmutable.set(objromListImmutable.size, objRom)));
            console.log("success unlock");
        } catch (err) {
            const errorString = `Unlock wallet error - ${err.message}`;
            yield put(unlockWalletError(errorString));
        }
    }

    /**
    * change source address and token when opening send modal
    */
    export function* changeSourceAddress(action) {
        // wait for container to load and then change from address
        if (action.address) {
            yield put(changeFrom(action.address, action.sendTokenSymbol));
        }
    }

    /**
    * Disconnect from network during closeWallet
    */
    export function* _closeWallet() {
        yield deleteWallet();
        yield put(loadNetwork(offlineModeString));
    }

    /**
    * Save wallet to localStorage
    */
    // export function* saveWalletS() {
    //     try {
    //         const ks = yield select(makeSelectKeystore());
    //         if (!ks) {
    //             throw new Error('No keystore defined');
    //         }

    //         const dump = {
    //             ver: '1',
    //             saved: new Date().toISOString(),
    //             ks: ks.serialize(),
    //         };
    //         // console.log(`Saving len: ${JSON.stringify(dump).length}`);

    //         localStore.set(localStorageKey, dump);

    //         yield put(saveWalletSuccess());
    //     } catch (err) {
    //         const errorString = `${err.message}`;
    //         yield put(saveWalletError(errorString));
    //     }
    // }
    export function* saveWalletS() {//G
        try {
            const kss = (yield select(makeSelectKeystores())).toJS();
            // const ks = yield select(makeSelectKeystores());
            if (!kss) {
                console.log("not saved");
                throw new Error('No keystore defined');
            }

            for (let index = 0; index < kss.length; index++) {
                const dump = {
                    ver: '1',
                    saved: new Date().toISOString(),
                    ks: kss[index][0].serialize(),
                };
                localStore.set(localStorageKey+index.toString(), dump);
            }

            yield put(saveWalletSuccess());
        } catch (err) {
            console.log("error while saving" + err);
            const errorString = `${err.message}`;
            yield put(saveWalletError(errorString));
        }
    }

    /**
    * Load wallet from localStorage
    */
    // export function* loadWalletS() {
    //     try {
    //         yield call(timer, 1000);
    //         const existingKs = yield select(makeSelectKeystore());
    //         if (existingKs) {
    //             throw new Error('Existing keystore present  - aborting load form localStorage');
    //         }

    //         const dump = localStore.get(localStorageKey);
    //         if (!dump) {
    //             throw new Error('No keystore found in localStorage');
    //         }
    //         // console.log(`Load len: ${JSON.stringify(dump).length}`);

    //         const ksDump = dump.ks;
    //         const ks = lightwallet.keystore.deserialize(ksDump);

    //         const tokenList = yield select(makeSelectTokenInfoList());
    //         yield put(generateKeystoreSuccess(ks, tokenList));
    //         yield put(loadNetwork(defaultNetwork));
    //         yield put(loadWalletSuccess());
    //     } catch (err) {
    //         const errorString = `${err.message}`;
    //         yield put(loadWalletError(errorString));
    //     }
    // }
    export function* loadWalletS() {//G
        try {
            yield call(timer, 1000);
            const existingKs = yield select(makeSelectKeystores());


            if (existingKs.size>0) {
                throw new Error('Existing keystores present  - aborting load form localStorage');
            }

            var dump = [];
            var i = 0;
            var isThereMore = true;
            
            while (isThereMore) {
                if (localStore.get(localStorageKey+i.toString())) {
                    // console.log(i);
                    // console.log(localStore.get(localStorageKey+i.toString()));
                    dump.push(localStore.get(localStorageKey+i.toString()));
                    ++i;
                    // console.log(i);
                } else {
                    // console.log("no more " + i.toString());
                    isThereMore = false;
                    break;
                }
            }

            if (dump.length == 0) {
                throw new Error('No keystore found in localStorage');
            }
            // console.log(`Load len: ${JSON.stringify(dump).length}`);

            const tokenList = yield select(makeSelectTokenInfoList());
            for (let index = 0; index < dump.length; index++) {
                let ks = [];
                let ksDump = dump[index].ks;
                ks.push(lightwallet.keystore.deserialize(ksDump));
                yield put(generateKeystoresSuccess(ks, tokenList));
            }

            yield put(loadNetwork(defaultNetwork));     
            yield put(loadWalletSuccess());
        } catch (err) {    
            const errorString = `${err.message}`;
            yield put(loadWalletError(errorString));
        }
    }

    /**
    * delete all values from localStorage
    */
    export function* deleteWallet() {
        localStore.clearAll();
    }

    /**
    * Saga triggered by TokenChooser container to pass tokenInfo for selected tokens
    * @param {object} action dispatched by tokenChooser
    * @param {object} action.tokenInfo
    */
    export function* chosenTokenInfo(action) {
        const addressList = (yield select(makeSelectKeystore())).getAddresses();
        yield put(updateTokenInfo(addressList, action.tokenInfo));
    }

    //#endregion

//#endregion


/**
 * Root saga manages watcher lifecycle
 */
export default function* InWalletData() {
    // Watches for INIT_WALLET actions and calls initKS when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount


    yield takeLatest(LOAD_NETWORK, _loadNetwork);
    
    // yield takeLatest(INIT_SEED, initSeed);
    yield takeLatest(GENERATE_WALLET, _generateWallet);
    yield takeLatest(CHECK_WALLET_AVAILABLE, _checkWalletNameAvailable);
    yield takeLatest(GENERATE_KEYSTORE, genKeystore);
    yield takeLatest(GENERATE_ADDRESS, _generateAddress);
    yield takeLatest(RESTORE_WALLET_FROM_SEED, restoreFromSeed);
    yield takeLatest(RESTORE_WALLET_FROM_PK, restoreFromPK);
    yield takeLatest(UNLOCK_WALLET, _unlockWallet);
    yield takeLatest(SHOW_SEND_TOKEN, changeSourceAddress);
    yield takeLatest(CLOSE_WALLET, _closeWallet);

    yield takeLatest(SAVE_WALLET, saveWalletS);
    yield takeLatest(LOAD_WALLET, loadWalletS);

    yield takeLatest(CONFIRM_UPDATE_TOKEN_INFO, chosenTokenInfo);

    yield takeLatest(COMFIRM_SEND_TRANSACTION, _confirmSendTransaction);
    yield takeLatest(SEND_TRANSACTION, SendTransaction);
    yield takeLatest(GET_EXCHANGE_RATES, getRates);

    yield takeLatest(CHECK_FAUCET, checkFaucetApi);
    yield takeLatest(ASK_FAUCET, askFaucetApi);
    yield takeLatest(GEN_KEYSTORE_RESTORE_SEED, genKeystoreRestoreSeedMode);
    yield takeLatest(GEN_KEYSTORE_RESTORE_PK, genKeystoreRestorePKMode);
    yield takeLatest(FINALIZE_RESTORE_FROM_SEED, genKeystoreRestoreSeedModeCleanUp);
    yield takeLatest(FINALIZE_RESTORE_FROM_PK, genKeystoreRestorePKModeCleanUp);


    /* poll check balances */
    yield [
        fork(watchPollData),
        takeLatest(CHECK_BALANCES, checkAllBalances),
    ];


    /*
    while (yield takeLatest(INIT_WALLET, initSeed)) {
      // yield takeLatest(GENERATE_KEYSTORE, genKeystore);
    } */
}
