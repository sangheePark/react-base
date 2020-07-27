import React, { useMemo, useEffect } from 'react'
import { Router, Route, Switch, useHistory } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import * as Views from './view'
import './i18n'
import './App.css'
import PrivateRoute from '@view/PirvateRoute'
import { useSelector } from 'react-redux'
import { userSelector } from '@module/reducer/user'
import { MUser } from '@model/user'
import Loder from '@component/Loder'
import { MApp } from '@model/app'
import { appSelector } from '@module/reducer/app'

const history = createBrowserHistory()
const App: React.FC = () => {
  // const history = useHistory()
  const app: MApp = useSelector(appSelector)
  const user: MUser = useSelector(userSelector)
  const isLogin = (user: MUser): boolean => {
    return user.id !== ''
  }
  const authentication: boolean = useMemo(() => isLogin(user), [user])
  useEffect(() => {
    console.log('authentication:' + authentication)
    console.log('authentication:' + history.location.pathname)
    if (history.location.pathname === '/login' && authentication) {
      history.replace('/')
    }
  }, [user])
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/login" component={Views.Login} />
        <PrivateRoute authentication={authentication} exact path="/" page={Views.Home} />
        <Route component={Views.NotFound} />
      </Switch>
      <Loder show={app.loding}></Loder>
    </Router>
  )
}

export default App
