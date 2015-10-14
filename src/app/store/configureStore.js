import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import sync from 'browser-redux-sync';
import storage from './storage';
import rootReducer from '../reducers';
import rehydrateAction from '../actions/bg/receive';

let finalCreateStore;
if (__DEVELOPMENT__) {
  const middleware = [
    require('redux-logger')({level: 'info', collapsed: true}),
    require('redux-immutable-state-invariant')(),
    thunk
  ];
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    autoRehydrate(),
    require('redux-devtools').devTools()
  )(createStore);
} else {
  finalCreateStore = compose(
    applyMiddleware(thunk),
    autoRehydrate()
  )(createStore);
}

export default function configureStore(initialState, isFromBackground, callback) {
  let store = finalCreateStore(rootReducer(isFromBackground));
  const config = isFromBackground ? {rehydrateAction: rehydrateAction(store)} : {};
  const persistor = persistStore(store, {
    ...config,
    storage: storage,
    serialize: data => data,
    deserialize: data => data
  }, callback);
  sync(persistor);
  return store;
}
