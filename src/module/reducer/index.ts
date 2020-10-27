import { combineReducers } from 'redux'
import { fetchApp as app } from './app'
import { fetchUser as user } from './user'

const rootReducer = combineReducers({
  app,
  user
})
export type State = ReturnType<typeof rootReducer>

export default rootReducer
