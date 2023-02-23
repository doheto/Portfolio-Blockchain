import {
    FETCH_CURRENTPOOL_BEGIN,
    FETCH_CURRENTPOOL_SUCCESS,
    FETCH_CURRENTPOOL_FAILURE
} from '../_actions';
import { fromJS } from 'immutable';
const initialState = fromJS({ //{
    items: [],
    loading: false,
    error: null
//};
});

function mycurrentpoolReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CURRENTPOOL_BEGIN:
            // Mark the state as "loading" so we can show a spinner or something
            // Also, reset any errors. We're starting fresh.
            // return {
            //     ...state,
            //     loading: true,
            //     error: null
            // };
            return state
                .set('loading', true)
                .set('error', null);

        case FETCH_CURRENTPOOL_SUCCESS:
            // All done: set loading "false".
            // Also, replace the items with the ones from the server
            //console.dir(action.payload);
            // return {
            //     ...state,
            //     loading: false,
            //     items: action.payload
            // };
            return state
                .set('loading', false)
                .set('items', action.payload);

        case FETCH_CURRENTPOOL_FAILURE:
            // The request failed, but it did stop, so set loading to "false".
            // Save the error, and we can display it somewhere
            // Since it failed, we don't have items to display anymore, so set it empty.
            // This is up to you and your app though: maybe you want to keep the items
            // around! Do whatever seems right.
            // return {
            //     ...state,
            //     loading: false,
            //     error: action.payload.error,
            //     items: []
            // };
            return state
                .set('loading', false)
                .set('error', action.payload.error)
                .set('items', []);

        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export { mycurrentpoolReducer as currentpoolReducer};