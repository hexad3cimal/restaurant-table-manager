// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const { hideAlert, showAlert} = createActions({
  [ActionTypes.HIDE_ALERT]: () => ({}),
  [ActionTypes.SHOW_ALERT]: payload => payload,

});
