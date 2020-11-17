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
export function* addTable({ payload }) {
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
export function* getTableById({ id }) {
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
export function* getTablesForBranch({ payload }) {
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
 * Get all the tables for org
 */
export function* getTablesForOrg() {
  try {
    const tables = yield request(`${window.geoConfig.api}table/org`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.TABLES_GET_ORG_SUCCESS,
        payload: tables && tables.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.TABLES_GET_ORG_FAILURE,
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
    takeLatest(ActionTypes.TABLE_ADD, addTable),
    takeLatest(ActionTypes.TABLE_GET, getTableById),
    takeLatest(ActionTypes.TABLES_GET, getTablesForBranch),
    takeLatest(ActionTypes.TABLES_GET_ORG, getTablesForOrg),
  ]);
}
