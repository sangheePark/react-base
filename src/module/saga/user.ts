import { call, put, fork, takeEvery } from 'redux-saga/effects'
import { UserAction, AppAction } from '@module/action'
import { UserService } from '@module/service'
import { MUser, MUserFilter } from '@model/user'

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

function* login({ meta }: ReturnType<typeof UserAction.LOGIN.trigger>) {
  try {
    yield put(AppAction.SET_LODER.success(true))
    const user = yield call(UserService.login, meta)
    yield put(UserAction.LOGIN.success(user, meta))
  } catch (error) {
    yield put(UserAction.LOGIN.failure(error, meta))
  } finally {
    yield put(AppAction.SET_LODER.success(false))
  }
}

function* doLogin() {
  yield takeEvery(UserAction.LOGIN.TRIGGER, login)
}

function* logout({}: ReturnType<typeof UserAction.LOGOUT.trigger>) {
  try {
    yield put(AppAction.SET_LODER.success(true))
    yield put(UserAction.LOGOUT.success({}))
  } catch (error) {
    yield put(UserAction.LOGOUT.failure(error))
  } finally {
    yield put(AppAction.SET_LODER.success(false))
  }
}

function* doLogout() {
  yield takeEvery(UserAction.LOGOUT.TRIGGER, logout)
}

export default function* userSaga() {
  yield fork(getList)
  yield fork(doLogin)
  yield fork(doLogout)
}
