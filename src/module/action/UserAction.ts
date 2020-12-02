import { MLogin, MUser, MUserFilter } from '@model/UserModel'
import { createRoutine, createAsyncRoutine } from '@module/routine'

const UserAction = {
  LOGIN: createAsyncRoutine<MLogin, MUser>('LOGIN'),
  GET_LIST: createAsyncRoutine<MUserFilter, MUser[]>('GET_USER_LIST'),
  LOGOUT: createRoutine('LOGOUT')
}
export default UserAction
