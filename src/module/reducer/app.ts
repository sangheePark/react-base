import { createReducer } from 'deox'
import { State } from './index'
import { AppAction } from '@module/action'
import { MApp } from '@model/app'

// const defaultState = {} as Record<string, User>
const defaultState: MApp = {
  loding: false,
  version: ''
}
export const fetchApp = createReducer(defaultState, (handleAction) => [
  //Looding
  handleAction(AppAction.LODING.on, (state) => {
    return {
      ...state,
      loding: true
    }
  }),
  handleAction(AppAction.LODING.off, (state) => {
    return {
      ...state,
      loding: false
    }
  })
])

export const appSelector = (state: State) => {
  return state.app
}
