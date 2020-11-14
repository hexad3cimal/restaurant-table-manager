/**
 * @module Sagas/Branch
 * @desc Branch
 */

import { all, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Add new branch
 */
export function* add({ payload }) {
  try {
    yield request(`${window.geoConfig.api}branch`, {
      method: 'POST',
      payload,
    });

    yield put({
      type: ActionTypes.BRANCH_ADD_SUCCESS,
    });
    yield put({
      type: ActionTypes.SHOW_ALERT,
      payload: `Added ${payload.name} successfully!`,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.BRANCH_ADD_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Could not add branch,please retry',
      }),
    ]);
  }
}

/**
 * Get branch details by id
 */
export function* getById({ id }) {
  try {
    const branch = yield request(`${window.geoConfig.api}branch?id=${id}`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.BRANCH_GET_SUCCESS,
      payload: branch,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.BRANCH_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting branch details, please retry',
      }),
    ]);
  }
}

/**
 * Get all the branches for the current org
 */
export function* getForOrg() {
  try {
    const branches = yield request(`${window.geoConfig.api}branch/org`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.BRANCHES_GET_SUCCESS,
        payload: branches,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.BRANCHES_GET_SUCCESS_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting branches, please retry',
      }),
    ]);
  }
}

/**
 * Branch Sagas
 */
export default function* root() {
  yield all([
    takeEvery(ActionTypes.BRANCH_ADD, add),
    takeEvery(ActionTypes.BRANCH_GET, getById),
    takeEvery(ActionTypes.BRANCHES_GET, getForOrg),
  ]);
}
