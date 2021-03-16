/**
 * @module Sagas/Common
 * @desc Common
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Get currencies
 */
export function* getCurrencies() {
  try {
    const currenciesResponse = yield request(`${window.restAppConfig.api}config/currency`, {
      method: 'GET'
    });

    let currencies = [];
    for(let currency in currenciesResponse.data){
      currencies.push(currenciesResponse.data[currency])
    }
      yield put({
        type: ActionTypes.GET_CURRENCIES_SUCCESS,
        payload:currencies
      })

  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.GET_CURRENCIES_SUCCESS_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Could not get currencies,please retry',
      }),
    ]);
  }
}


/**
 * Get timezones 
 */
export function* getTimeZones() {
  try {
    const tzs = yield request(`${window.restAppConfig.api}config/tzs`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.GET_TIMEZONES_SUCCESS,
        payload: tzs && tzs.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.GET_TIMEZONES_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting timezones, please retry',
      }),
    ]);
  }
}

/**
 * Common Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.GET_CURRENCIES, getCurrencies),
    takeLatest(ActionTypes.GET_TIMEZONES, getTimeZones),
  ]);
}
