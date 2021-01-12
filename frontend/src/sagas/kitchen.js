/**
 * @module Sagas/Kitchen
 * @desc Kitchen
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Add new Kitchen
 */
export function* addKitchen({ payload }) {
  try {
    yield request(`${window.restAppConfig.api}kitchen`, {
      method: 'POST',
      payload,
    });
    yield all([
      yield put({
        type: ActionTypes.KITCHEN_ADD_SUCCESS,
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
        type: ActionTypes.KITCHEN_ADD_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Could not add kitchen,please retry',
      }),
    ]);
  }
}

/**
 * Get kitchen details by id
 */
export function* getKitchenById({ id }) {
  try {
    const kitchen = yield request(`${window.restAppConfig.api}kitchen?id=${id}`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.KITCHEN_GET_SUCCESS,
      payload: kitchen,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.KITCHEN_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting kitchen details, please retry',
      }),
    ]);
  }
}

/**
 * Get all the kitchens for given branch
 */
export function* getKitchensForBranch({ payload }) {
  try {
    const kitchens = yield request(`${window.restAppConfig.api}kitchen/branch?branch=${payload.id}`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.KITCHENS_GET_SUCCESS,
        payload: kitchens && kitchens.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.KITCHENS_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting kitchens, please retry',
      }),
    ]);
  }
}

/**
 * Get all the kitchens 
 */
export function* getKitchens() {
  try {
    const kitchens = yield request(`${window.restAppConfig.api}kitchens`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.KITCHENS_GET_SUCCESS,
        payload: kitchens && kitchens.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.KITCHENS_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting kitchens, please retry',
      }),
    ]);
  }
}

/**
 * delete kitchen by id
 */
export function* deleteById({ payload }) {
  try {
    yield request(`${window.restAppConfig.api}kitchen?id=${payload.id}`, {
      method: 'DELETE',
    });

    yield put({
      type: ActionTypes.KITCHEN_DELETE_SUCCESS,
    });
    put({
      type: ActionTypes.SHOW_ALERT,
      payload: 'Deleted kitchen successfully',
    })
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.KITCHEN_DELETE_FAILURE,
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
 * Kitchen Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.KITCHEN_ADD, addKitchen),
    takeLatest(ActionTypes.KITCHEN_GET, getKitchenById),
    takeLatest(ActionTypes.KITCHENS_GET, getKitchens),
    takeLatest(ActionTypes.KITCHENS_GET, deleteById),
  ]);
}
