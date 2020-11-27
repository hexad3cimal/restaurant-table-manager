/**
 * @module Sagas/Order
 * @desc Order
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Add new order
 */
export function* add({payload}) {
  try {
    yield request(`${window.geoConfig.api}order`, {
      method: 'POST',
      payload,
    });
    yield all([
    yield put({
      type: ActionTypes.ORDER_ADD_SUCCESS,
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
        type: ActionTypes.ORDER_ADD_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Could not add order,please retry',
      }),
    ]);
  }
}

/**
 * Get order details by id
 */
export function* getById({ id }) {
  try {
    const order = yield request(`${window.geoConfig.api}order?id=${id}`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.ORDER_GET_SUCCESS,
      payload: order,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.ORDER_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting order details, please retry',
      }),
    ]);
  }
}

/**
 * Get orders
 */
export function* getOrders() {
  try {
    const orders = yield request(`${window.geoConfig.api}orders`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.ORDERS_GET_SUCCESS,
        payload: orders && orders.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    console.log("error",err)
    yield all([
      put({
        type: ActionTypes.ORDERS_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting orders, please retry',
      }),
    ]);
  }
}

/**
 * Branch Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.ORDER_ADD, add),
    takeLatest(ActionTypes.ORDER_GET, getById),
    takeLatest(ActionTypes.ORDERS_GET, getOrders),
  ]);
}
