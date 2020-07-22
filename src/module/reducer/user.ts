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
    return {
      ...state,
      ...payload
    }
  }),
  handleAction(UserAction.LOGOUT.success, (state, {}) => {
    return {
      ...defaultState
    }
  })
])

export const userSelector = (state: State) => {
  return state.user
}
