import { createRoutine } from 'redux-routines-ts'
import { MUser, MUserFilter, MLogin } from '@model/user'

const UserAction = {
  GET_LIST: createRoutine<MUser[], MUserFilter>('GET_USER_LIST'),
  GET: createRoutine<MUser, MLogin>('GET_USER')
}
export default UserAction
