import { combineReducers } from 'redux'
import { loadingReducer } from 'redux-routines-ts'
// import auth from './auth'
import { fetchApp as app } from './app'
import { fetchUser as user } from './user'

const rootReducer = combineReducers({
  app,
  user,
  loading: loadingReducer
})
export type State = ReturnType<typeof rootReducer>

export default rootReducer
