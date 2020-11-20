import { applyMiddleware, createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootSaga from '../sagas/index';
import rootReducer from '../reducers/index';

import middleware, { sagaMiddleware } from './middleware';

const reducer = persistReducer(
  {
    key: 'rrsb', // key is required
    storage, // storage is now required
    whitelist: ['user'],
  },
  combineReducers({ ...rootReducer }),
);

/* istanbul ignore next */
const configStore = (initialState = {}) => {
  const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(require('../reducers/index').default);
    });
  }

  return {
    persistor: persistStore(store),
    store,
  };
};

const { store, persistor } = configStore();

global.store = store;

export { store, persistor };
