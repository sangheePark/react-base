import { createReducer } from 'deox'
import { State } from './index'
import { UserAction } from '@module/action'
import { MUser } from '@model/user'

const defaultState: MUser = {
  id: '',
  name: ''
}
export const fetchUser = createReducer(defaultState, (handleAction) => [
  handleAction(UserAction.LOGIN.success, (state, { payload, meta }) => {
    console.log('LOGIN:palLoad:' + payload)
    return {
      ...state,
      ...payload
    }
  }),
  handleAction(UserAction.LOGOUT.success, (state, { payload }) => {
    console.log('LOGOUT:palLoad:' + payload)
    return {
      ...state,
      ...defaultState
    }
  })
])

export const userSelector = (state: State) => {
  console.log('userSelector:' + JSON.stringify(state))
  return state.user
}
