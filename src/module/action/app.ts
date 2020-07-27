import { createRoutine, createTogleRoutine } from '@module/routine'
import { MUser, MUserFilter, MLogin } from '@model/user'

const AppAction = {
  LODING: createTogleRoutine('LODING')
}
export default AppAction
