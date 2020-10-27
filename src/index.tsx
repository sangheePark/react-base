import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configStroe from '@module/store'

import './index.css'
import App from './App'

const { store, persistor, history } = configStroe()
const renderReactDom = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Router history={history}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
renderReactDom()
