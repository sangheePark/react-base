import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as Views from './view'
import './i18n'
import './App.css'
import PrivateRoute from '@view/PirvateRoute'
import { useSelector } from 'react-redux'
import Loder from '@component/Loder'
import { appSelector } from '@module/reducer/AppReducer'
import LoginRoute from '@view/LoginRoute'
import { MApp } from '@model/AppModel'

const App: React.FC = () => {
	const app: MApp = useSelector(appSelector);
	return (
		<>
			<Switch>
				<LoginRoute exact path="/login" page={Views.Login} />
				<PrivateRoute exact path="/" page={Views.Home} />
				<Route component={Views.NotFound} />
			</Switch>
			<Loder show={app.loding}></Loder>
		</>
	)
}

export default App
