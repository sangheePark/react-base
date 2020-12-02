import { combineReducers } from 'redux'
import { appReducer as app } from './AppReducer'
import { userReducer as user } from './UserReducer'

const rootReducer = combineReducers({
  app,
  user
})
export type State = ReturnType<typeof rootReducer>
export default rootReducer
