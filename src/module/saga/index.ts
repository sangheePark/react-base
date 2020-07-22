import { all, fork } from 'redux-saga/effects'
// import auth from './auth';
import user from './user'

export default function* rootSaga() {
  yield all([fork(user)])
}
