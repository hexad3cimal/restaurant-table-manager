/**
 * @module Sagas/Dashboard
 * @desc Dashboard
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Get dashboard stats
 */
export function* getStats() {
  try {
    const stats = yield request(`${window.restAppConfig.api}dashboard/stats`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.DASHBOARD_STATS_GET_SUCCESS,
      payload: (stats && stats.data) || [],
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
        type: ActionTypes.DASHBOARD_STATS_GET_FAILURE,
        payload: err,
      })
    
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.DASHBOARD_STATS_GET, getStats),
  ]);
}
