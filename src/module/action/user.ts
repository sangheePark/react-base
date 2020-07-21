import { createRoutine } from 'redux-routines-ts'
import { MUser, MUserFilter } from '@model/user'

const UserAction = {
  GET_LIST: createRoutine<MUser[], MUserFilter>('GET_USER_LIST'),
  GET: createRoutine<MUser, { id: string }>('GET_USER')
}
export default UserAction
