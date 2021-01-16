/**
 * @module Sagas/Category
 * @desc Category
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Add new Category
 */
export function* addCategory({ payload }) {
  try {
    yield request(`${window.restAppConfig.api}category`, {
      method: 'POST',
      payload,
    });
    yield all([
      yield put({
        type: ActionTypes.CATEGORY_ADD_SUCCESS,
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
        type: ActionTypes.CATEGORY_ADD_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Could not add category,please retry',
      }),
    ]);
  }
}

/**
 * Get category details by id
 */
export function* getCategoryById({ id }) {
  try {
    const category = yield request(`${window.restAppConfig.api}category?id=${id}`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.CATEGORY_GET_SUCCESS,
      payload: category,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.CATEGORY_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting category details, please retry',
      }),
    ]);
  }
}



/**
 * Get all the categories 
 */
export function* getCategories() {
  try {
    const categories = yield request(`${window.restAppConfig.api}categories`, {
      method: 'GET',
    });

    yield all([
      put({
        type: ActionTypes.CATEGORIES_GET_SUCCESS,
        payload: categories && categories.data,
      }),
    ]);
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.CATEGORIES_GET_FAILURE,
        payload: err,
      }),
      put({
        type: ActionTypes.SHOW_ALERT,
        payload: 'Error while gettting categories, please retry',
      }),
    ]);
  }
}

/**
 * delete category by id
 */
export function* deleteById({ payload }) {
  try {
    yield request(`${window.restAppConfig.api}category?id=${payload.id}`, {
      method: 'DELETE',
    });

    yield put({
      type: ActionTypes.CATEGORY_DELETE_SUCCESS,
    });
    put({
      type: ActionTypes.SHOW_ALERT,
      payload: 'Deleted category successfully',
    })
  } catch (err) {
    /* istanbul ignore next */
    yield all([
      put({
        type: ActionTypes.CATEGORY_DELETE_FAILURE,
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
 * Category Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.CATEGORY_ADD, addCategory),
    takeLatest(ActionTypes.CATEGORY_GET, getCategoryById),
    takeLatest(ActionTypes.CATEGORIES_GET, getCategories),
    takeLatest(ActionTypes.CATEGORY_DELETE, deleteById),
  ]);
}
