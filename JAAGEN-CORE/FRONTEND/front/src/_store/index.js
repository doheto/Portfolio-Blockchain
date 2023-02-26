import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS, Map } from 'immutable';
import thunk from 'redux-thunk';
import { rootReducer } from '../_reducers';
import createSagaMiddleware from 'redux-saga';
import InWalletData from '../_actions/InWalletActions'; 


const sagaMiddleware = createSagaMiddleware();

const initialState = Map();

// const mystore = createStore(rootReducer, applyMiddleware(thunk));

    // Create the store with two middlewares
    // 1. sagaMiddleware: Makes redux-sagas work
    const middlewares = [
        sagaMiddleware,
        thunk,
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
                // Prevent recomputing reducers for `replaceReducer`
                shouldHotReload: false,
            })
            : compose;
    /* eslint-enable */

    const configureStore = createStore(
        rootReducer,
        initialState,
        composeEnhancers(...enhancers)
    );

    // Extensions
    configureStore.runSaga = sagaMiddleware.run(InWalletData);

export { configureStore as store };
