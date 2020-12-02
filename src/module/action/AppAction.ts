import { createRoutine } from '@module/routine'

const AppAction = {
  SET_LOADING: createRoutine<boolean>('SET_LOADING')
}
export default AppAction
