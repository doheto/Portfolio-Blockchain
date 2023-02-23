import { combineReducers } from 'redux-immutable';
import { sessionReducer } from './session';
import { userReducer } from './user';
import { addressReducer } from './address';
import { currentpoolReducer } from './currentpool';
import { inWalletReducer } from './InWallet';

const myrootReducer = combineReducers({ // the whole is immutable
  sessionState: sessionReducer,
  userState: userReducer,
  addressState: addressReducer,
  currentPoolState: currentpoolReducer,
  inWalletState: inWalletReducer, // tis one is immutable
});

export { myrootReducer as rootReducer };