/**
 * @module Sagas/Product
 * @desc Product
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Add new product
 */
export function* add({payload}) {
  try {
    yield request(`${window.restAppConfig.api}product`, {
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
      },
      payload,
    });
    yield all([
    yield put({
      type: ActionTypes.PRODUCT_ADD_SUCCESS,
    }),
    yield put({
      type: ActionTypes.PRODUCTS_GET,
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
        type: ActionTypes.PRODUCT_ADD_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Could not add product,please retry',
      }),
    ]);
  }
}

/**
 * Get product details by id
 */
export function* getById({ id }) {
  try {
    const product = yield request(`${window.restAppConfig.api}product?id=${id}`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.PRODUCT_GET_SUCCESS,
      payload: product,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.PRODUCT_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting product details, please retry',
      }),
    ]);
  }
}

/**
 * Get products
 */
export function* getProducts() {
  try {
    const products = yield request(`${window.restAppConfig.api}products`, {
      method: 'GET',
    });

    yield 
      put({
        type: ActionTypes.PRODUCTS_GET_SUCCESS,
        payload: products && products.data,
      })
   
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.PRODUCTS_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting products, please retry',
      }),
    ]);
  }
}

/**
 * Branch Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.PRODUCT_ADD, add),
    takeLatest(ActionTypes.PRODUCT_GET, getById),
    takeLatest(ActionTypes.PRODUCTS_GET, getProducts),
  ]);
}
