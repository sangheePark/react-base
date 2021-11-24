import React, { useState, useEffect } from 'react'
import Login from './Login'
import { MLogin } from '@model/UserModel'
import { useDispatch, useSelector } from 'react-redux'
import { UserAction } from '@module/action'
import { userSelector } from '@module/reducer/UserReducer'
import { useHistory } from 'react-router'

const LoginContainer: React.FC = (): React.ReactElement => {
	const history = useHistory()
	const dispatch = useDispatch()
	const user = useSelector(userSelector)
	const [state, setState] = useState<MLogin>({
		id: '',
		password: '',
	})

	// useEffect(() => {
	//   history.replace('/')
	// }, [user])

	const doLogin = (login: MLogin) => {
		// console.log(login)
		dispatch(UserAction.LOGIN.trigger(login))
	}
	// return <div>xxxxxx</div>
	return <Login value={state} onClick={doLogin}></Login>
}

export default LoginContainer
