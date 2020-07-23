import { call, put, fork, takeEvery, delay, take, cancelled } from 'redux-saga/effects'
import { UserAction, AppAction } from '@module/action'
import { UserService } from '@module/service'
import { MUser, MUserFilter, MLogin } from '@model/user'
import { Z_UNKNOWN } from 'zlib'

const api2 = (user: MUserFilter): Promise<MUser[]> => Promise.resolve([])

function* getList() {
  yield takeEvery(UserAction.GET_LIST.TRIGGER, getUserList)
}

function* getUserList({ meta }: ReturnType<typeof UserAction.GET_LIST.trigger>) {
  try {
    const userList = yield call(api2, meta)
    yield put(UserAction.GET_LIST.success(userList, meta))
  } catch (error) {
    yield put(UserAction.GET_LIST.failure(error, meta))
  }
}

function* doLogin() {
  yield takeEvery(UserAction.LOGIN.TRIGGER, login)
}

function* logout({}: ReturnType<typeof UserAction.LOGOUT.trigger>) {
  try {
    // yield put(AppAction.SET_LODER.success(true))
    yield put(UserAction.LOGOUT.success({}))
  } catch (error) {
    yield put(UserAction.LOGOUT.failure(error))
  } finally {
    // yield put(AppAction.SET_LODER.success(false))
  }
}

function* doLogout() {
  yield takeEvery(UserAction.LOGOUT.TRIGGER, logout)
}
/**
 * 로그인
 * @param param0
 */
function* login({ meta }: ReturnType<typeof UserAction.LOGIN.trigger>) {
  try {
    yield put(AppAction.OPEN_LODING.trigger(undefined))
    const user = yield call(UserService.login, meta)
    // console.log('user:' + JSON.stringify(user))
    yield put(UserAction.LOGIN.success(user, meta))
  } catch (error) {
    yield put(UserAction.LOGIN.failure(error, meta))
    // yield cancelled()
  } finally {
    yield put(AppAction.CLOSE_LODING.trigger(undefined))
  }
}

/**
 * 로그인 & 로그아웃
 */
function* loginFlow() {
  while (true) {
    const params = yield take(UserAction.LOGIN.TRIGGER)
    console.log(JSON.stringify(params))
    // yield put(AppAction.OPEN_LODING.trigger)
    yield call(login, params)
    // yield put(AppAction.CLOSE_LODING.trigger)
    yield take([UserAction.LOGOUT.TRIGGER, UserAction.LOGIN.FAILURE])
  }
}

export default function* userSaga() {
  // yield fork(getList)
  yield fork(loginFlow)
  // yield fork(doLogin)
  // yield fork(doLogout)
}
