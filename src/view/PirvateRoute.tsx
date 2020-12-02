import { MUser } from '@model/UserModel'
import { userSelector } from '@module/reducer/UserReducer'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'

type RoutePageComponent = React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
interface IProps {
  page: RoutePageComponent
}
const PrivateRoute: React.FC<IProps & RouteProps> = (props) => {
  const Page: RoutePageComponent = props.page
  const user: MUser = useSelector(userSelector)
  const isLogin = (user: MUser): boolean => {
    return user.id !== ''
  }
  const authentication: boolean = useMemo(() => isLogin(user), [user])
  return (
    <Route
      {...props}
      render={(props) => (authentication ? <Page {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  )
}
export default PrivateRoute
