import { call, put, fork, takeEvery, delay, take } from 'redux-saga/effects'
import { AppAction } from '@module/action'

/**
 * 로딩
 */
function* lodingFlow() {
  while (true) {
    yield take(AppAction.OPEN_LODING.TRIGGER)
    yield put(AppAction.OPEN_LODING.success(null))
    yield take(AppAction.CLOSE_LODING.TRIGGER)
    yield delay(1000)
    yield put(AppAction.CLOSE_LODING.success(null))
  }
}

export default function* appSaga() {
  yield fork(lodingFlow)
}
