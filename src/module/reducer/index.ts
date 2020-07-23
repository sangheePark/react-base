import { combineReducers } from 'redux'
import { loadingReducer } from '@module/routine'
import { fetchApp as app } from './app'
import { fetchUser as user } from './user'

const rootReducer = combineReducers({
  app,
  user,
  loading: loadingReducer
})
export type State = ReturnType<typeof rootReducer>

export default rootReducer
