import React, { useMemo } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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

const App: React.FC = () => {
  const app: MApp = useSelector(appSelector)
  const user: MUser = useSelector(userSelector)
  const isLogin = (user: MUser): boolean => {
    return user.id !== ''
  }
  const authentication: boolean = useMemo(() => isLogin(user), [user])

  return (
    <Router>
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
