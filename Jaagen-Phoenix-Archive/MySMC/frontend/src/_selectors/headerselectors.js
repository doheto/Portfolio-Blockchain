import { createSelector } from 'reselect';
import { Network } from '../_constants';

const selectInWalletDomain = (state) => state.get('inWalletState');

const makeSelectLoading = () => createSelector(
  selectInWalletDomain,
  (substate) => substate.get('loadingNetwork')
);

const makeSelectError = () => createSelector(
  selectInWalletDomain,
  (substate) => substate.get('errorNetwork')
);

const makeSelectNetworkName = () => createSelector(
  selectInWalletDomain,
  (substate) => substate.get('networkName')
);
// const makeSelectPrevNetworkName = () => createSelector(
//   selectInWalletDomain,
//   (substate) => substate.get('prevNetworkName
// );
const makeSelectTxExplorer = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? Network[substate.get('networkName')].tx_explorer : null
);
const makeSelectAvailableNetworks = () => createSelector(
  selectInWalletDomain,
  (substate) => substate.get('availableNetworks')
);

const makeSelectBlockNumber = () => createSelector(
  selectInWalletDomain,
  (substate) => substate.get('blockNumber') 
);

/* Will return null if header didn't loaded yet (initial load) */
const makeSelectNetworkReady = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('networkReady') : null
);

const makeSelectCheckingBalanceDoneTime = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('checkingBalanceDoneTime') : null
);

const makeSelectCheckingBalances = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('checkingBalances') : null
);

const makeSelectCheckingBalancesError = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('checkingBalancesError') : null
);

const makeSelectGetExchangeRatesDoneTime = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('getExchangeRatesDoneTime') : null
);

const makeSelectGetExchangeRatesLoading = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('getExchangeRatesLoading') : null
);

const makeSelectGetExchangeRatesError = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('getExchangeRatesError') : null
);

// faucet
const makeSelectUsedFaucet = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('usedFaucet') : null
);

const makeSelectCheckFaucetLoading = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('checkFaucetLoading') : null
);
const makeSelectCheckFaucetSuccess = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('checkFaucetSuccess') : null
);
const makeSelectAskFaucetLoading = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('askFaucetLoading') : null
);
const makeSelectAskFaucetSuccess = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('askFaucetSuccess') : null
);
const makeSelectAskFaucetError = () => createSelector(
  selectInWalletDomain,
  (substate) => substate ? substate.get('askFaucetError') : null
);




// export default makeSelectHeader;
export {
  selectInWalletDomain,
  makeSelectNetworkReady,
  makeSelectLoading,
  makeSelectError,
  // makeSelectPrevNetworkName,
  makeSelectNetworkName,
  makeSelectTxExplorer,
  makeSelectAvailableNetworks,
  makeSelectBlockNumber,
  makeSelectCheckingBalanceDoneTime,
  makeSelectCheckingBalances,
  makeSelectCheckingBalancesError,
  makeSelectGetExchangeRatesDoneTime,
  makeSelectGetExchangeRatesLoading,
  makeSelectGetExchangeRatesError,
  makeSelectUsedFaucet,
  makeSelectCheckFaucetLoading,
  makeSelectCheckFaucetSuccess,
  makeSelectAskFaucetLoading,
  makeSelectAskFaucetSuccess,
  makeSelectAskFaucetError,
};



