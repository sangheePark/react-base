import React from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '@module/reducer/user'
import { MUser } from '@model/user'

const Home: React.FC = (): React.ReactElement => {
  const user = useSelector(userSelector)
  return <div>home: user: {user.id}</div>
}

export default Home
