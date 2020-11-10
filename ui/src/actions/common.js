// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const { hideAlert: hideAlert } = createActions({
  [ActionTypes.HIDE_ALERT]: () => ({}),
});
