import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import reducer from '@module/reducer'
import rootSaga from '@module/saga'

declare const window: any
const persistConfig = {
  key: 'root',
  storage,
  debug: true,
  whitelist: ['user']
}

const enhancedReducer = persistReducer(persistConfig, reducer)
const sagaMiddleware = createSagaMiddleware()
const createStroeWithMddleware = applyMiddleware(sagaMiddleware, logger)(createStore)
export default () => {
  const store = createStroeWithMddleware(enhancedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  sagaMiddleware.run(rootSaga)
  const persistor = persistStore(store)
  return { store, persistor }
}
