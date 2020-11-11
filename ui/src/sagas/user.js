/**
 * @module Sagas/User
 * @desc User
 */

import { all, delay, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Login
 */
export function* login({ payload }) {
  try {
    const user = yield request(`${window.geoConfig.api}user/login`, {
      method: 'POST',
      payload,
    });

    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
      payload: user,
    });
    yield put({
      type: ActionTypes.SHOW_ALERT,
      payload: 'Successfully logged in',
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.USER_LOGIN_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Login failed,please retry',
      }),
    ]);
  }
}

/**
 * Register
 */
export function* register({ payload }) {
  try {
    yield request(`${window.geoConfig.api}user/register`, {
      method: 'POST',
      payload,
    });

    yield all([
      put({
        type: ActionTypes.USER_REGISTER_SUCCESS,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Successfully registered',
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.USER_REGISTER_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while registering, please retry',
      }),
    ]);
  }
}

/**
 * Logout
 */
export function* logout() {
  try {
    yield delay(200);

    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: err,
    });
  }
}

/**
 * User Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.USER_LOGIN, login),
    takeLatest(ActionTypes.USER_LOGOUT, logout),
    takeLatest(ActionTypes.USER_REGISTER, register),
  ]);
}
