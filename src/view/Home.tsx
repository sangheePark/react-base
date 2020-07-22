import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { userSelector } from '@module/reducer/user'
import { MUser } from '@model/user'
import { UserAction } from '@module/action'

const Home: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const handleLogout = (e: React.MouseEvent) => {
    dispatch(UserAction.LOGOUT.trigger())
  }
  return (
    <div>
      home: user: {user.id}
      <button onClick={handleLogout}> 로그아웃</button>
    </div>
  )
}

export default Home
