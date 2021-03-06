/**
 * @module Sagas/Branch
 * @desc Branch
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Add new branch
 */
export function* add({payload}) {
  try {
    yield request(`${window.restAppConfig.api}branch`, {
      method: 'POST',
      payload,
    });
    yield all([
    yield put({
      type: ActionTypes.BRANCH_ADD_SUCCESS,
    }),
    yield put({
      type: ActionTypes.SHOW_ALERT,
      payload: `Added ${payload.name} successfully!`,
    }),
  ]);
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
    const branch = yield request(`${window.restAppConfig.api}branch?id=${id}`, {
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
 * delete branch by id
 */
export function* deleteById({ payload }) {
  try {
    yield request(`${window.restAppConfig.api}branch?id=${payload.branchId}`, {
      method: 'DELETE',
    });

    yield put({
      type: ActionTypes.BRANCH_DELETE_SUCCESS,
    });
    put({
      type: ActionTypes.SHOW_ALERT,
      payload: 'Deleted branch successfully',
    })
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.DELETE_FAILURE,
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
 * Get branches
 */
export function* getBranches() {
  try {
    const branches = yield request(`${window.restAppConfig.api}branches`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.BRANCHES_GET_SUCCESS,
        payload: branches && branches.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.BRANCHES_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting branches, please retry',
      }),
    ]);
  }
}

export function* getTopProducts() {
  try {
    const branchProducts = yield request(`${window.restAppConfig.api}product/top`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.BRANCH_GET_TOP_PRODUCTS_SUCCESS,
        payload: branchProducts && branchProducts.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.BRANCH_GET_TOP_PRODUCTS_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting branch Products, please retry',
      }),
    ]);
  }
}

/**
 * Branch Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.BRANCH_ADD, add),
    takeLatest(ActionTypes.BRANCH_GET, getById),
    takeLatest(ActionTypes.BRANCH_DELETE, deleteById),
    takeLatest(ActionTypes.BRANCHES_GET, getBranches),
    takeLatest(ActionTypes.BRANCH_GET_TOP_PRODUCTS, getTopProducts),
  ]);
}
