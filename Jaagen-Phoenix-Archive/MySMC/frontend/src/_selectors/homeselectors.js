/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectInWalletDomain = (state) => state.get('inWalletState');

const makeSelectIsShowGenerateWallet = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('isShowGenerateWallet') 
);

const makeSelectGenerateWalletLoading = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('generateWalletLoading')
);

const makeSelectGenerateWalletError = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('generateWalletError')
);


const makeSelectGenerateKeystoreLoading = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('generateKeystoreLoading')
);

const makeSelectGenerateKeystoreError = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('generateKeystoreError')
);

const makeSelectRestoreWalletError = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('restoreWalletError')
);
const makeSelectRestoreWalletErrorPK = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('restoreWalletErrorPK')
);

const makeSelectSeed = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('seed')
);

const makeSelectPassword = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('password')
);

const makeSelectIsComfirmed = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('isComfirmed')
);


const makeSelectKeystore = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('keystore')
);
const makeSelectKeystores = () => createSelector( //G
  selectInWalletDomain,
  (homeState) => homeState.get('keystores')
);
const makeSelectObjRom = () => createSelector( //G
  selectInWalletDomain,
  (homeState) => homeState.get('objrom')
);

const makeSelectShowRestoreWallet = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('isShowRestoreWallet')
);

const makeSelectShowRestoreWalletFromPrivKey = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('isShowRestoreWalletFromPrivKey')
);

const makeSelectUserSeed = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('userSeed')
);

const makeSelectUserPK = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('userPK')
);

const makeSelectUserPassword = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('userPassword')
);

const makeSelectUserPasswordPK = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('userPasswordPK')
);

const makeSelectcheckingAdrIsInOurDBDone = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('checkingAdrIsInOurDBDone')
);
const makeSelecttheaddressRestoredFromSeed = () => createSelector( 
  selectInWalletDomain,
  (homeState) => homeState.get('theaddressRestoredFromSeed')
);
const makeSelecttheaddressRestoredFromPK = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('theaddressRestoredFromPK')
);
const makeSelectcheckingAdrIsInOurDBDonePK = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('checkingAdrIsInOurDBDonePK')
);

const makeSelectnameFromRestoreWalletSeed = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('nameFromRestoreWalletSeed')
);
const makeSelectnameFromRestoreWalletPK = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('nameFromRestoreWalletPK')
);

const makeSelectIsShowSendToken = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('isShowSendToken')
);

const makeSelectIsShowTokenChooser = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('isShowTokenChooser')
);

/*
* Deprecated, use makeSelectAddressMap instead.
*
*/
const makeSelectAddressList = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('addressList')
);

/**
 * returns map for specific given address or map of all addresses if no address is given
 * {
 *   index: 1 // optional
 *   eth: {balance: bigNumber / false},
 *   eos: {balance: bigNumber / false},
 *   ppt: {balance: bigNumber / false},
 * }
 * to return array of all adresses use: makeSelectAddress(false, { returnList: true })
 *
 * @param  {string} address as string (optional) returns map of all addresses if not provided
 * @param  {object} options may include the following:
 * @param  {boolean} options.returnList should returned array from keys instead of map? (optional)
 * @param  {boolean} options.removeIndex should remove the key index? (optional)
 * @param  {boolean} options.removeEth should remove the key eth? (optional)
 *
 * @return {object} An object which holds the tokens and balances or array
 */
const makeSelectAddressMap = (address, options = {}) => createSelector(
  selectInWalletDomain,
  (homeState) => {
    // console.dir(selectInWalletDomain);
    // console.dir(homeState.get('addressList'));
    const { returnList, removeIndex, removeEth } = options;//makeSelectwalletNameAvailable
    let addressMap = address ? homeState.getIn(['addressList', address]) : homeState.get('addressList');
    if (!addressMap) {
      return null;
    }
    if (address && removeIndex) {
      addressMap = addressMap.delete('index');
    }
    if (address && removeEth) {
      addressMap = addressMap.delete('eth');
    }
    // const returnS = (returnList ? addressMap.keySeq().toArray()  : addressMap.toJS());
    const returnS = (returnList ? addressMap.keySeq().toArray()  : addressMap.toJS());
    return returnS;
  }
);


const makeSelectAddressListLoading = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('addressListLoading')
);
const makeSelectAddressListError = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('addressListError')
);
const makeSelectAddressListMsg = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('addressListMsg')
);
const makeSelectExchangeRates = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('exchangeRates').toJS()
);

const makeSelectConvertTo = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('convertTo')
);

/**
 * returns details object for specific given symbol or map of all symbols if no symbol is given
 * for makeSelectTokenInfo('symb') we get:
 * {
 *  icon: 'populous_28.png',
 *  name: 'Sample',
 *  contractAddress: '0xd5b3812e67847af90aa5835abd5c253ff5252ec2',
 *  decimals: 1,
 * },
 * returns null if no info for given token symbol
 * to return array of all symbols use: makeSelectAddress(false, { returnList: true })
 *
 * @param  {string} [symbol] as string (optional) returns map of all symbols if not provided
 *
 * @return {object} An object which holds the tokensInfo for given symbol
 */
const makeSelectTokenInfo = (symbol) => createSelector(
  selectInWalletDomain,
  (homeState) => {
    const tokenInfo = symbol ? homeState.getIn(['tokenInfo', symbol]) : homeState.get('tokenInfo');
    if (tokenInfo) {
      return tokenInfo.toJS();
    }
    return null;
  }
);
/* return array of tokens from tokenInfo : ['eth','eos','ppt'] */
const makeSelectTokenInfoList = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('tokenInfo').keySeq().toArray() //Object.keys(homeState.tokenInfo) //keySeq().toArray()
);

/**
 * returns decimals map for all tokens
 *{
 *  eth: 18,
 *  eos: 18,
 *  ppt: 3
 *},
 * @return {object} An object which holds the decimals map
 */
const makeSelectTokenDecimalsMap = () => createSelector(
  selectInWalletDomain,
  (homeState) => {
    // const tokenInfo = homeState.tokenInfo') ? homeState.tokenInfo.toJS() : {};
    const tokenInfo = homeState.get('tokenInfo') ? homeState.get('tokenInfo').toJS() : {};
    return Object.assign({}, ...Object.keys(tokenInfo).map((k) => ({ [k]: tokenInfo[k].decimals })));
  }
);

const makeSelectwalletNameAvailable = () => createSelector(
  selectInWalletDomain,
  (homeState) => {
    let name = homeState.get('temporaryWalletNameAvailable');
    return name;
  }
);
const makeSelectSaveWalletLoading = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('saveWalletLoading')
);
const makeSelectSaveWalletError = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('saveWalletError')
);
const makeSelectLoadWalletLoading = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('loadWalletLoading')
);
const makeSelectLoadwalletError = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('loadWalletError')
);
const makeSelectwalletNameRestoredFromSeed = () => createSelector(
  selectInWalletDomain,
  (homeState) => homeState.get('theNameRestoredFromSeed')
);


export {
  selectInWalletDomain,
  makeSelectwalletNameRestoredFromSeed,
  makeSelectIsShowGenerateWallet,
  makeSelectGenerateWalletLoading,
  makeSelectGenerateWalletError,
  makeSelectGenerateKeystoreLoading,
  makeSelectGenerateKeystoreError,
  makeSelectRestoreWalletError,
  makeSelectRestoreWalletErrorPK,
  makeSelectSeed,
  makeSelectPassword,
  makeSelectIsComfirmed,
  makeSelectKeystore,
  makeSelectKeystores, //G
  makeSelectShowRestoreWallet,
  makeSelectShowRestoreWalletFromPrivKey,
  makeSelectUserSeed,
  makeSelectUserPassword,
  makeSelectIsShowSendToken,
  makeSelectIsShowTokenChooser,

  makeSelectAddressList,
  makeSelectAddressListLoading,
  makeSelectAddressListError,
  makeSelectAddressListMsg,
  makeSelectAddressMap,
  // makeSelectTokenMap,

  makeSelectExchangeRates,
  // makeSelectExchangeRate,
  makeSelectConvertTo,
  makeSelectTokenInfoList,
  makeSelectTokenInfo,
  makeSelectTokenDecimalsMap,

  makeSelectwalletNameAvailable,

  makeSelectSaveWalletLoading,
  makeSelectSaveWalletError,
  makeSelectLoadWalletLoading,
  makeSelectLoadwalletError,

  makeSelectUserPasswordPK,
  makeSelectUserPK,
  makeSelectcheckingAdrIsInOurDBDone,
  makeSelectcheckingAdrIsInOurDBDonePK,
  makeSelectnameFromRestoreWalletSeed,
  makeSelectnameFromRestoreWalletPK,
  makeSelectObjRom,

  makeSelecttheaddressRestoredFromSeed,
  makeSelecttheaddressRestoredFromPK
};
