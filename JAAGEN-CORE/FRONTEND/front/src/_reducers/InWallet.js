import { fromJS, List } from 'immutable';
import {
    //#region headerthings ?
    CLOSE_WALLET,
    LOAD_NETWORK,
    LOAD_NETWORK_SUCCESS,
    LOAD_NETWORK_ERROR,

    CHECK_BALANCES,
    CHECK_BALANCES_SUCCESS,
    CHECK_BALANCES_ERROR,

    GET_EXCHANGE_RATES,
    GET_EXCHANGE_RATES_SUCCESS,
    GET_EXCHANGE_RATES_ERROR,

    ASK_FAUCET_ERROR,
    ASK_FAUCET_SUCCESS,
    //#endregion

    //#region Wallet etc!
    GENERATE_WALLET,
    GENERATE_WALLET_SUCCESS,
    GENERATE_WALLET_ERROR,
    GENERATE_WALLET_CANCEL,

    CHECK_WALLET_AVAILABLE_SUCCESS,
    CHECK_WALLET_AVAILABLE_ERROR,

    FINALIZE_RESTORE_FROM_SEED,
    SET_NAME_TO_ADDRESS,
    FINALIZE_RESTORE_FROM_PK,
    CHECKING_ADR_IN_DB_DONE_SWITCH_PK,

    GENERATE_KEYSTORE,
    GENERATE_KEYSTORE_SUCCESS,
    GENERATE_KEYSTORES_SUCCESS,
    GENERATE_KEYSTORE_ERROR,
    NAME_FROM_RESTORE_WALLET_SEED,
    NAME_FROM_RESTORE_WALLET_PK,
    SHOW_RESTORE_WALLET,
    SHOW_RESTORE_WALLET_PK,
    RESTORE_WALLET_CANCEL,
    RESTORE_WALLET_CANCEL_PK,
    CHANGE_USER_SEED,
    CHANGE_USER_PK,
    CHANGE_USER_PASSWORD,
    CHANGE_USER_PASSWORD_PK,
    RESTORE_WALLET_FROM_SEED,
    RESTORE_WALLET_FROM_PK,
    RESTORE_WALLET_FROM_SEED_ERROR,
    RESTORE_WALLET_FROM_PK_ERROR,
    RESTORE_WALLET_FROM_SEED_SUCCESS,
    RESTORE_WALLET_FROM_PK_SUCCESS,
    CHECKING_ADR_IN_DB_DONE_SWITCH,
    CHANGE_BALANCE,

    SHOW_SEND_TOKEN,
    HIDE_SEND_TOKEN,
    SHOW_TOKEN_CHOOSER,
    HIDE_TOKEN_CHOOSER,

    UPDATE_TOKEN_INFO,

    GENERATE_ADDRESS,
    GENERATE_ADDRESS_SUCCESS,
    GENERATE_ADDRESS_ERROR,

    LOCK_WALLET,
    UNLOCK_WALLET,
    UNLOCK_WALLET_SUCCESS,
    UNLOCK_WALLET_ERROR,

    SET_EXCHANGE_RATES,
    SELECT_CURRENCY,

    CHECK_LOCAL_STORAGE,
    LOCAL_STORAGE_EXIST,
    LOCAL_STORAGE_NOT_EXIST,

    SAVE_WALLET,
    SAVE_WALLET_SUCCESS,
    SAVE_WALLET_ERROR,

    LOAD_WALLET,
    LOAD_WALLET_SUCCESS,
    LOAD_WALLET_ERROR,
    SAVE_OBJ_ROM,
    //#endregion
} from '../_actions/InWalletActions';

import { Network } from '../_constants';

// The initial state of the App
const initialState = fromJS({ //= {  //fromJS
    loadingNetwork: false,
    errorNetwork: false,
    networkReady: false, // true only if network initialized and valid keystore attached
    // prevNetworkName: defaultNetwork,
    networkName: 'Offline',
    blockNumber: 0,
    availableNetworks: Object.keys(Network),

    checkingBalanceDoneTime: false, // should update after every succesfull balance check
    checkingBalances: false, // Loading
    checkingBalancesError: false,

    getExchangeRatesDoneTime: false, // should update after every succesfull exchange rate check
    getExchangeRatesLoading: false,
    getExchangeRatesError: false,

    usedFaucet: false, // to prevent offer more then once



    isShowGenerateWallet: false,
    generateWalletLoading: false,  // generate new seed and password
    generateWalletError: false,
    password: false,
    seed: false,
    pk: false,

    objrom:List([]),
    generateKeystoreLoading: false,
    generateKeystoreError: false,  // if error - no addressList displayed

    isShowRestoreWallet: false,
    resetValuesForRestorefromSeed:false,
    theNameRestoredFromSeed: "",
    theNameRestoredFromPK: "",
    userSeed: '',
    userPK: '',
    userPassword: '',
    userPasswordPK: '',
    restoreWalletError: false,
    restoreWalletErrorPK: false,

    isShowRestoreWalletFromPrivKey : false,
    isComfirmed: false, // if true then we have a valid keystore

    keystore: false,
    keystores: List([]),
    addressList: false,

    /*
    addressList: {
    address1: {
        order: 1
        eth: {balance: bigNumber},
        eos: {balance: bigNumber},
        ppt: {balance: bigNumber},
        }
    } */

    exchangeRates: {},
    convertTo: 'eth_usd',

    addressListLoading: false, // for addressList loading and error
    addressListError: false,
    addressListMsg: false,

    isShowSendToken: false,
    isShowTokenChooser: false,

    saveWalletLoading: false,
    saveWalletError: false,
    loadWalletLoading: false,
    loadWalletError: false,

    checkingAdrIsInOurDBDone: null,
    checkingAdrIsInOurDBDonePK: null,
    theaddressRestoredFromPK:null,
    theaddressRestoredFromSeed:null,

    tokenInfo: {
        eth: {
            name: 'Ethereum',
            contractAddress: null,
            decimals: 18,
        },
        omg: {
            name: 'OmiseGo',
            contractAddress: '0xbcad569fe454e78ca90e4120d89b6b69f8db402f',
            decimals: 18,
        },
        bat: {
            name: 'Basic Attention Token',
            contractAddress: '0xf3a1c162bc4a82ca5227d7c542c20dd087d2c37b',
            decimals: 18,
        },
        mkr: {
            symbol: 'mkr',
            name: 'Maker',
            contractAddress: '0xece9fa304cc965b00afc186f5d0281a00d3dbbfd',
            decimals: 18,
        },
    },
});//};

function strip0x (input) {
    if (typeof(input) !== 'string') {
        return input;
    }
    else if (input.length >= 2 && input.slice(0,2) === '0x') {
        return input.slice(2);
    }
    else {
        return input;
    }
}

function myInWalletReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_NETWORK:
            return state
                .set('loadingNetwork', true)
                .set('errorNetwork', false)
                // dont change prevNetworkName when going online
                .set('prevNetworkName', (state.get('networkName') === 'Offline') ? state.get('prevNetworkName') : state.get('networkName'))
                .set('networkName', action.networkName);
        case LOAD_NETWORK_SUCCESS:
            return state
                .set('loadingNetwork', false)
                .set('errorNetwork', false)
                .set('blockNumber', action.blockNumber)
                .set('networkReady', true);
        case LOAD_NETWORK_ERROR:
            return state
                .set('loadingNetwork', false)
                .set('errorNetwork', action.error)
                .set('networkReady', false);

        case CHECK_BALANCES:
            return state
                .set('checkingBalances', true)
                .set('checkingBalancesError', false)
                .set('checkingBalanceDoneTime', false);
        case CHECK_BALANCES_SUCCESS:
            return state
                .set('checkingBalances', false)
                .set('checkingBalancesError', false)
                .set('checkingBalanceDoneTime', action.timeString);
        case CHECK_BALANCES_ERROR:
            return state
                .set('checkingBalances', false)
                .set('checkingBalancesError', action.error)
                .set('checkingBalanceDoneTime', false);


        case FINALIZE_RESTORE_FROM_SEED:
            return state 
                .set('isShowRestoreWallet', false)
                .set('theNameRestoredFromSeed', action.nameRestoredWallet);
            
        
        case SET_NAME_TO_ADDRESS:
            let ind = -1;
            for (let index = 0; index < state.get('keystores').size; index++) {
                if (state.get('keystores').getIn([index, 0]).addresses.includes(strip0x(action.theaddress))) {
                    ind = index;
                }
            }
            if (ind != -1) {
                // let k = state.getIn(['keystores', ind, 0]);
                state.getIn(['keystores', ind, 0]).associateNameToAddress(action.theaddress, action.thename);
                // state.setIn(['keystores', ind, 0], k);
                return state;
            }
            return state;

        case FINALIZE_RESTORE_FROM_PK:
            return state 
                .set('isShowRestoreWalletFromPrivKey', false)
                .set('theNameRestoredFromPK', action.nameRestoredWalletPK);


        case GET_EXCHANGE_RATES:
            return state
                .set('getExchangeRatesLoading', true)
                .set('getExchangeRatesError', false)
                .set('getExchangeRatesDoneTime', false);
                
        case GET_EXCHANGE_RATES_SUCCESS:
            return state
                .set('getExchangeRatesLoading', false)
                .set('getExchangeRatesError', false)
                .set('getExchangeRatesDoneTime', action.timeString);
        case GET_EXCHANGE_RATES_ERROR:
            return state
                .set('getExchangeRatesLoading', false)
                .set('getExchangeRatesError', action.error)
                .set('getExchangeRatesDoneTime', false);

        case ASK_FAUCET_SUCCESS:
            return state
                .set('usedFaucet', true);
        case ASK_FAUCET_ERROR:
            return state;

        case CLOSE_WALLET:
            return state
                .set('usedFaucet', false);


        ///////////   CHANGED TILL HERE

        case GENERATE_WALLET:
            return state
                .set('isShowGenerateWallet', true)
                .set('generateWalletLoading', true)
                .set('generateWalletError', false);
        case GENERATE_WALLET_SUCCESS:
            return state
                .set('generateWalletLoading', false)
                .set('seed', action.seed)
                .set('password', action.password);
        case GENERATE_WALLET_ERROR:
            return state
                .set('generateWalletLoading', false)
                .set('generateWalletError', action.error);
        case GENERATE_WALLET_CANCEL:
            return state
                .set('isShowGenerateWallet', false)
                .set('generateWalletLoading', true)
                .set('generateWalletError', false)
                .set('password', false)
                .set('seed', false);

        case CHECK_WALLET_AVAILABLE_SUCCESS:
            return state
                .set('isWalletNameAvailable', true)
                .set('temporaryWalletNameAvailable', action.name);

        case CHECK_WALLET_AVAILABLE_ERROR:
            return state
                .set('isWalletNameAvailable', false);

        case GENERATE_KEYSTORE:
            return state
                .set('isShowGenerateWallet', false)
                .set('generateKeystoreLoading', true)
                .set('generateKeystoreError', false);
        // case GENERATE_KEYSTORE_SUCCESS:
        //     return state
        //         .set('keystore', action.keystore)
        //         .set('seed', false)
        //         .set('isComfirmed', true)
        //         .set('addressListError', false)
        //         .set('addressList', fromJS(action.addressMap))
        //         .set('generateKeystoreLoading', false);
        case GENERATE_KEYSTORES_SUCCESS://G
            return state
                .update('keystores', keystores => keystores.push(fromJS(action.keystores)))// .set('keystores', fromJS(action.keystores))
                .set('seed', false)
                .set('isComfirmed', true)
                .set('addressListError', false)
                .set('addressList', fromJS(action.addressMap))
                .set('generateKeystoreLoading', false);
        case GENERATE_KEYSTORE_ERROR:
            return state
                .set('generateKeystoreLoading', false)
                .set('generateKeystoreError', action.error)
                .set('isComfirmed', false);

        case SHOW_RESTORE_WALLET:
            return state
                .set('isShowRestoreWallet', true)
                .set('seed', false)
                .set('userSeed', '');
        
        case SHOW_RESTORE_WALLET_PK:
            return state
                .set('isShowRestoreWalletFromPrivKey', true)
                .set('pk', false)
                .set('userPK', '');
        
        case RESTORE_WALLET_CANCEL:
            return state
                .set('isShowRestoreWallet', false)
                .set('userPassword', '')
                .set('userSeed', '')
                .set('restoreWalletError', false);
        
        case RESTORE_WALLET_CANCEL_PK:
            return state
                .set('isShowRestoreWalletFromPrivKey', false)
                .set('userPasswordPK', '')
                .set('userPK', '')
                .set('restoreWalletErrorPK', false);

        case CHANGE_USER_SEED:
            return state
                .set('userSeed', action.userSeed); // Delete prefixed space from user seed
        
        case CHANGE_USER_PK:
            return state
                .set('userPK', action.userPK);
            // Delete prefixed space from user seed

        case CHANGE_USER_PASSWORD:
            return state
                .set('userPassword', action.password);
        
        case CHANGE_USER_PASSWORD_PK:
            return state
                .set('userPasswordPK', action.password);

        case RESTORE_WALLET_FROM_SEED:
            return state
                .set('restoreWalletError', false)
                .set('isComfirmed', false);
        
        case RESTORE_WALLET_FROM_PK:
            return state
                .set('restoreWalletErrorPK', false)
                .set('isComfirmed', false);


        case RESTORE_WALLET_FROM_SEED_ERROR:
            return state
                .set('restoreWalletError', action.error);
        
        case RESTORE_WALLET_FROM_PK_ERROR:
            return state
                .set('restoreWalletErrorPK', action.error);

        case CHECKING_ADR_IN_DB_DONE_SWITCH:
            return state
                .set('checkingAdrIsInOurDBDone', false);
                
        case CHECKING_ADR_IN_DB_DONE_SWITCH_PK:
            return state
                .set('checkingAdrIsInOurDBDonePK', false);
            
        case RESTORE_WALLET_FROM_SEED_SUCCESS:
            return state
                // .set('isShowRestoreWallet', false)
                .set('checkingAdrIsInOurDBDone', false)
                .set('seed', action.userSeed)
                .set('password', action.userPassword)
                .set('userSeed', '')
                .set('userPassword', '');

        case NAME_FROM_RESTORE_WALLET_SEED:
            return state
                // .set('isShowRestoreWallet', false)
                .set('checkingAdrIsInOurDBDone', true)
                .set('theaddressRestoredFromSeed', action.theaddress)
                .set('nameFromRestoreWalletSeed', action.thename);


        case NAME_FROM_RESTORE_WALLET_PK:
            return state
                // .set('isShowRestoreWallet', false)
                .set('checkingAdrIsInOurDBDonePK', true)
                .set('theaddressRestoredFromPK', action.theaddress)
                .set('nameFromRestoreWalletPK', action.thename);
        
        case RESTORE_WALLET_FROM_PK_SUCCESS:
            return state
                // .set('isShowRestoreWalletFromPrivKey', false)
                .set('checkingAdrIsInOurDBDonePK', false)
                .set('seed', action.seed)
                .set('password', action.userPasswordPK)
                .set('userSeed', '')
                .set('userPassword', '');
                // .set('pk', action.userPK)
                // .set('password', action.userPasswordPK)
                // .set('userPK', '')
                // .set('userPasswordPK', '');


        case CHANGE_BALANCE:
            return state
                .setIn(['addressList', action.address, action.symbol, 'balance'], action.balance);

        case SHOW_SEND_TOKEN:
            return state
                .set('isShowSendToken', true);
        case HIDE_SEND_TOKEN:
            return state
                .set('isShowSendToken', false);

        case SHOW_TOKEN_CHOOSER:
            return state
                .set('isShowTokenChooser', true);
        case HIDE_TOKEN_CHOOSER:
            return state
                .set('isShowTokenChooser', false);

        case UPDATE_TOKEN_INFO:
            return state
                .set('isShowTokenChooser', false)
                .set('addressListError', false)
                .set('tokenInfo', fromJS(action.tokenInfo))
                .set('addressList', fromJS(action.addressMap));

        case GENERATE_ADDRESS:
            return state
                .set('addressListLoading', true)
                .set('addressListError', false)
                .set('addressListMsg', false);
        case GENERATE_ADDRESS_SUCCESS:
            return state
                .set('addressListLoading', false)
                .set('addressListError', false)
                .set('addressListMsg', 'New address generated succesfully')
                .setIn(['addressList', action.newAddress], fromJS(action.tokenMap));
        case GENERATE_ADDRESS_ERROR:
            return state
                .set('addressListLoading', false)
                .set('addressListError', action.error);
        case SAVE_OBJ_ROM:
            return state
                .set('objrom', action.objRom);


        case LOCK_WALLET:
            return state
                .set('password', false);
        case UNLOCK_WALLET:
            return state;
        case UNLOCK_WALLET_SUCCESS:
            return state
                .set('password', action.password);
        case UNLOCK_WALLET_ERROR:
            return state;


        case SET_EXCHANGE_RATES:
            return state
                .set('exchangeRates', fromJS(action.rates));
        case SELECT_CURRENCY:
            return state
                .set('convertTo', fromJS(action.convertTo));

        case CLOSE_WALLET:
            return initialState;

        case CHECK_LOCAL_STORAGE:
            return state
                .set('checkLocalStorageLoading', true);
        case LOCAL_STORAGE_EXIST:
            return state
                .set('checkLocalStorageLoading', false)
                .set('isLocalStorageWallet', true);
        case LOCAL_STORAGE_NOT_EXIST:
            return state
                .set('checkLocalStorageLoading', false)
                .set('isLocalStorageWallet', false);

        case SAVE_WALLET:
            return state
                .set('saveWalletLoading', true)
                .set('saveWalletError', false);
        case SAVE_WALLET_SUCCESS:
            return state
                .set('saveWalletLoading', false);
        case SAVE_WALLET_ERROR:
            return state
                .set('saveWalletLoading', false)
                .set('saveWalletError', action.error);

        case LOAD_WALLET:
            return state
                .set('loadWalletLoading', true)
                .set('loadWalletError', false);
        case LOAD_WALLET_SUCCESS:
            return state
                .set('loadWalletLoading', false);
        case LOAD_WALLET_ERROR:
            return state
                .set('loadWalletLoading', false)
                .set('loadWalletError', action.error);

        
        



        
        default:
            return state;
    }
}

export { myInWalletReducer as inWalletReducer};