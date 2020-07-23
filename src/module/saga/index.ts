import { all, fork } from 'redux-saga/effects'
import user from './user'
import app from './app'

export default function* rootSaga() {
  yield all([fork(app), fork(user)])
}
