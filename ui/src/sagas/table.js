/**
 * @module Sagas/Table
 * @desc Table
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Add new table
 */
export function* add({ payload }) {
  try {
    yield request(`${window.geoConfig.api}table`, {
      method: 'POST',
      payload,
    });
    yield all([
      yield put({
        type: ActionTypes.TABLE_ADD_SUCCESS,
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
        type: ActionTypes.TABLE_ADD_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Could not add table,please retry',
      }),
    ]);
  }
}

/**
 * Get table details by id
 */
export function* getById({ id }) {
  try {
    const table = yield request(`${window.geoConfig.api}table?id=${id}`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.TABLE_GET_SUCCESS,
      payload: table,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.TABLE_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting table details, please retry',
      }),
    ]);
  }
}

/**
 * Get all the tables for given branch
 */
export function* getForBranch({ payload }) {
  try {
    const tables = yield request(`${window.geoConfig.api}table/branch?branch=${payload.id}`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.TABLES_GET_SUCCESS,
        payload: tables && tables.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.TABLES_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting tables, please retry',
      }),
    ]);
  }
}

/**
 * Table Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.TABLE_ADD, add),
    takeLatest(ActionTypes.TABLE_GET, getById),
    takeLatest(ActionTypes.TABLES_GET, getForBranch),
  ]);
}
