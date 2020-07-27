import { replace } from 'react-router-redux'
import { call, put, fork, takeEvery, take } from 'redux-saga/effects'
import { UserAction, AppAction } from '@module/action'
import { UserService } from '@module/service'

/**
 * 로그인
 * @param param0
 */
function* login({ meta }: ReturnType<typeof UserAction.LOGIN.trigger>) {
  try {
    yield put(AppAction.LODING.on())
    const user = yield call(UserService.login, meta)
    yield put(UserAction.LOGIN.success(user, meta))
    yield call(replace, '/')
  } catch (error) {
    yield fork(logout)
    yield put(UserAction.LOGIN.failure(error, meta))
    // yield cancelled()
  } finally {
    yield put(AppAction.LODING.off())
  }
}

/**
 * 로그아웃
 */
function* logout() {
  try {
    yield put(UserAction.LOGOUT.success())
  } catch (error) {
    yield put(UserAction.LOGOUT.failure(error))
  } finally {
    yield call(replace, '/')
  }
}

/**
 * 로그인 & 로그아웃
 */
function* loginFlow() {
  while (true) {
    const params = yield take(UserAction.LOGIN.TRIGGER)
    yield call(login, params)
    yield take(UserAction.LOGIN.FAILURE)
    yield fork(logout)
  }
}

export default function* userSaga() {
  yield takeEvery(UserAction.LOGIN.TRIGGER, login)
  yield takeEvery(UserAction.LOGOUT.TRIGGER, logout)
}
