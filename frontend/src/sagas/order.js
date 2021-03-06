/**
 * @module Sagas/Order
 * @desc Order
 */

import { all, put, takeLatest } from "redux-saga/effects";

import { ActionTypes } from "../constants/index";
import { request } from "../modules/client";

/**
 * Add new order
 */
export function* add({ payload }) {
  try {
    yield request(`${window.restAppConfig.api}order`, {
      method: "POST",
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
        payload: "Could not add order,please retry",
      }),
    ]);
  }
}

/**
 * Update order item
 */
export function* update({ payload }) {
  try {
    yield request(`${window.restAppConfig.api}order/item`, {
      method: "PUT",
      payload,
    });
    yield all([
      yield put({
        type: ActionTypes.ORDER_UPDATE_SUCCESS,
      }),
      yield put({
        type: ActionTypes.ORDERS_GET,
      }),
      yield put({
        type: ActionTypes.SHOW_ALERT,
        payload: `Updated  order  successfully!`,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.ORDER_UPDATE_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: "Could not update order,please retry",
      }),
    ]);
  }
}

/**
 * Get order details by id
 */
export function* getById({ id }) {
  try {
    const order = yield request(`${window.restAppConfig.api}order?id=${id}`, {
      method: "GET",
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
        payload: "Error while gettting order details, please retry",
      }),
    ]);
  }
}


/**
 * Get order details by table id
 */
export function* getByTableId({ payload }) {
  try {
    const order = yield request(`${window.restAppConfig.api}order?tableId=${payload}`, {
      method: "GET",
    });

    yield put({
      type: ActionTypes.ORDER_GET_BY_TABLE_ID_SUCCESS,
      payload: order.data,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.ORDER_GET_BY_TABLE_ID_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: "Error while gettting order details, please retry",
      }),
    ]);
  }
}
/**
 * Get orders
 */
export function* getOrders() {
  try {
    const orders = yield request(`${window.restAppConfig.api}orders`, {
      method: "GET",
    });

    yield all([
      put({
        type: ActionTypes.ORDERS_GET_SUCCESS,
        payload: orders && orders.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    console.log("error", err);
    yield all([
      put({
        type: ActionTypes.ORDERS_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: "Error while gettting orders, please retry",
      }),
    ]);
  }
}

/**
 * Branch Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.ORDER_UPDATE, update),
    takeLatest(ActionTypes.ORDER_ADD, add),
    takeLatest(ActionTypes.ORDER_GET, getById),
    takeLatest(ActionTypes.ORDER_GET_BY_TABLE_ID, getByTableId),
    takeLatest(ActionTypes.ORDERS_GET, getOrders),
  ]);
}
