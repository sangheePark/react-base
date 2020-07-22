import { createReducer } from 'deox'
import { State } from './index'
import { UserAction } from '@module/action'
import { MUser } from '@model/user'

// const defaultState = {} as Record<string, User>
const defaultState: MUser = {
  id: '',
  name: ''
}
export const getUser = createReducer(defaultState, (handleAction) => [
  handleAction(UserAction.GET.success, (state, { payload, meta }) => {
    return {
      ...state,
      user: payload
    }
  })
])

export const userSelector = (state: State) => {
  return state.user
}
