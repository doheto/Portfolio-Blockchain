import { createSelector } from 'reselect';
import { Network } from '../_constants';

const selectAddr = (state) => state.get('addressState');

const makeSelectItemsAddress = () => createSelector(
    selectAddr,
    (substate) => substate.get('items')
);

const makeSelectItemsAddressLoading = () => createSelector(
    selectAddr,
    (substate) => substate.get('loading')
);

const makeSelectItemsAddressError = () => createSelector(
    selectAddr,
    (substate) => substate.get('error')
);


// export default makeSelectHeader;
export {
    makeSelectItemsAddress,
    makeSelectItemsAddressLoading,
    makeSelectItemsAddressError,
};



