import { replace } from 'react-router-redux'
import { call, put, fork, takeEvery, take, delay } from 'redux-saga/effects'
import { UserAction, AppAction } from '@module/action'
import { UserService } from '@module/service'

/**
 * 로그인
 * @param param0
 */
function* login({ payload }: ReturnType<typeof UserAction.LOGIN.trigger>) {
  try {
    yield put(AppAction.SET_LOADING.action(true))
    yield delay(3000)
    const user = yield call(UserService.login, payload)
    yield put(UserAction.LOGIN.success(user))
    yield call(replace, '/')
  } catch (error) {
    // yield fork(logout)
    yield put(UserAction.LOGIN.failure(error))
    // yield cancelled()
  } finally {
    yield put(AppAction.SET_LOADING.action(false))
  }
}

export default function* userSaga() {
  yield takeEvery(UserAction.LOGIN.TRIGGER_TYPE, login)
}
