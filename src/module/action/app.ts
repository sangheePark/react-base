import { createRoutine } from '@module/routine'
import { MUser, MUserFilter, MLogin } from '@model/user'

const AppAction = {
  OPEN_LODING: createRoutine('OPEN_LODING'),
  CLOSE_LODING: createRoutine('CLOSE_LODING')
}
export default AppAction
