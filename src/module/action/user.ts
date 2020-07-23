import { createRoutine } from '@module/routine'
import { MUser, MUserFilter, MLogin } from '@model/user'

const UserAction = {
  GET_LIST: createRoutine<MUser[], MUserFilter>('GET_USER_LIST'),
  LOGIN: createRoutine<MUser, MLogin>('LOGIN'),
  // LOGIN: createSagaRoutine<MLogin>('LOGIN'),
  LOGOUT: createRoutine('LOGOUT')
}
export default UserAction
