import { createReducer } from 'deox'
import { State } from './index'
import { UserAction } from '@module/action'
import { MUser } from '@model/UserModel'

const defaultState: MUser = {
  id: '',
  name: ''
}
export const userReducer = createReducer(defaultState, (handleAction) => [
  handleAction(UserAction.LOGIN.success, (state, { payload }) => {
    return payload
  }),
  handleAction(UserAction.LOGOUT.action, () => {
    return defaultState
  })
])

export const userSelector = (state: State) => {
  return state.user
}
