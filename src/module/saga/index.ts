import { all, fork } from 'redux-saga/effects'
import user from './UserSaga'
import app from './AppSaga'

/**
 * SAGA 여러 상태의 변경과 비동기 로직이 있을 경우에만 구현 나머지... reducer에서 처리..
 */
export default function* rootSaga() {
  yield all([fork(app), fork(user)])
}
