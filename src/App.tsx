import React, { useMemo } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import * as Views from './view'
import './App.css'
import PrivateRoute from '@view/PirvateRoute'
import { useSelector } from 'react-redux'
import { userSelector } from '@module/reducer/user'
import { MUser } from '@model/user'

const App: React.FC = () => {
  const state: MUser = useSelector(userSelector)
  const isLogin = (user: MUser): boolean => {
    console.log("user.id !== '':" + user.id !== '')
    return user.id !== ''
  }
  const authentication: boolean = useMemo(() => isLogin(state), [state])

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Views.Login} />
        <PrivateRoute authentication={authentication} exact path="/" page={Views.Home} />
        <Route component={Views.NotFound} />
      </Switch>
    </Router>
  )
}

export default App
