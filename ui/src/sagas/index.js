import { all, fork } from 'redux-saga/effects';
import user from './user';
import branch from './branch';

/**
 * rootSaga
 */
export default function* root() {
  yield all([fork(user), fork(branch)]);
}
