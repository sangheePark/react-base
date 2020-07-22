import { createRoutine } from 'redux-routines-ts'
import { MUser, MUserFilter, MLogin } from '@model/user'

const AppAction = {
  SET_LODER: createRoutine<boolean>('SET_LODER')
  // GET: createRoutine<MUser, MLogin>('GET_USER')
}
export default AppAction
