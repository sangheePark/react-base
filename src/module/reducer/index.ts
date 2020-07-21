import { combineReducers } from 'redux'
import { loadingReducer } from 'redux-routines-ts'
// import auth from './auth'
import { getUser as user } from './user'

const rootReducer = combineReducers({ user, loading: loadingReducer })
export type State = ReturnType<typeof rootReducer>

export default rootReducer
