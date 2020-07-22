import { call, put, fork, takeEvery } from 'redux-saga/effects'
import { UserAction } from '@module/action'
import { MUser, MUserFilter } from '@model/user'
import { UserService } from '@module/service'

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

function* getUser({ meta }: ReturnType<typeof UserAction.GET.trigger>) {
  try {
    const user = yield call(UserService.login, meta)
    yield put(UserAction.GET.success(user, meta))
  } catch (error) {
    yield put(UserAction.GET.failure(error, meta))
  }
}

function* get() {
  yield takeEvery(UserAction.GET.TRIGGER, getUser)
}

// function* runUpsert({ payload: { id, username } }) {
//   const error = yield call(db.update, 'users', id, { username })
//   if (!error) {
//     yield put(successUpsertUser())
//   } else {
//     yield put(failureUpsertUser())
//   }
// }

// function* upsert() {
//   yield* takeEvery(REQUEST_UPSERT_USER, runUpsert)
// }

// function* runGet({ payload: { id } }) {
//   const user = yield call(db.get, 'users', id)
//   if (user) {
//     yield put(successGetUser({ id, data: user }))
//   } else {
//     yield put(failureGetUser())
//   }
// }

// function* triggerUpsertUser() {
//   while (true) {
//     let {
//       payload: { id, username }
//     } = yield take(SET_USERNAME)
//     if (!username || username.length === 0) {
//       id = '@@anonymous'
//       username = 'Anonymous'
//     }
//     yield put(requestUpsertUser({ id, username }))
//   }
// }

// function* triggerGetUser() {
//   while (true) {
//     const {
//       payload: { data }
//     } = yield take(SYNC_ADDED_POST)
//     const post = data.val()
//     yield put(requestGetUser({ id: post.userId }))
//   }
// }

export default function* userSaga() {
  yield fork(getList)
  yield fork(get)

  // yield fork(triggerUpsertUser)
  // yield fork(triggerGetUser)
}
