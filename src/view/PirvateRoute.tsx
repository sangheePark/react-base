import React from 'react'
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'

type RoutePageComponent = React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
interface IProps {
  page: RoutePageComponent
}
interface IStateToProps {
  authentication: boolean
}
const PrivateRoute: React.FC<IProps & IStateToProps & RouteProps> = (props) => {
  const Page: RoutePageComponent = props.page
  const { authentication } = props
  console.log('authentication:' + authentication)
  return (
    <Route
      {...props}
      render={(props) => (authentication ? <Page {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  )
}
// const mapStateToProps = (
//   state: IStoreState,
//   ownProps: IProps
// ): IProps & IStateToProps => ({
//   ...state,
//   ...ownProps
// });

// export default connect(mapStateToProps)(PrivateRouter);
export default PrivateRoute
