import { all, fork } from 'redux-saga/effects';
import user from './user';
import branch from './branch';
import table from './table';
import product from './product';

/**
 * rootSaga
 */
export default function* root() {
  yield all([fork(user), fork(table), fork(branch), fork(product)]);
}
