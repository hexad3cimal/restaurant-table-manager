// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const { hideAlert, showAlert, getTimezones, getCountries, getCurrencies} = createActions({
  [ActionTypes.HIDE_ALERT]: () => ({}),
  [ActionTypes.SHOW_ALERT]: payload => payload,
  [ActionTypes.GET_TIMEZONES]: () => ({}),
  [ActionTypes.GET_COUNTRIES]: () => ({}),
  [ActionTypes.GET_CURRENCIES]: () => ({}),
});
