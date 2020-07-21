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
const initialState = {}
export default () => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(enhancedReducer, initialState, applyMiddleware(sagaMiddleware, logger))
  sagaMiddleware.run(rootSaga)
  const persistor = persistStore(store)
  return { store, persistor }
}
