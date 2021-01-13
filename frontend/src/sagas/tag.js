/**
 * @module Sagas/Tag
 * @desc Tag
 */

import { all, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants/index';
import { request } from '../modules/client';

/**
 * Get similar tags
 */
export function* getSimilarTags({payload }) {
  try {
    const tags = yield request(`${window.restAppConfig.api}tag?branchId=${payload.branchId}&tagName=${payload.tagName}`, {
      method: 'GET',
    });

    yield put({
      type: ActionTypes.TAG_GET_SIMILAR_SUCCESS,
      payload: (tags && tags.data) || [],
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
        type: ActionTypes.TAG_GET_SIMILAR_FAILURE,
        payload: err,
      })
    
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.TAG_GET_SIMILAR, getSimilarTags),
  ]);
}
