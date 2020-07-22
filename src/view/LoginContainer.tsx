import React, { useState } from 'react'
import Login from './Login'
import { MLogin } from '@model/user'
import { useDispatch } from 'react-redux'
import { UserAction } from '@module/action'

const LoginContainer: React.SFC = (): React.ReactElement => {
  const [state, setState] = useState<MLogin>({
    id: '',
    password: ''
  })
  const dispatch = useDispatch()
  const doLogin = (login: MLogin) => {
    console.log('doLogin:' + login)
    dispatch(UserAction.GET.trigger(login))
  }
  return <Login value={state} onClick={doLogin}></Login>
}

export default LoginContainer
