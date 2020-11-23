import { keyMirror } from '../modules/helpers';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export const ActionTypes = keyMirror({
  EXCEPTION: undefined,
  USER_LOGIN: undefined,
  USER_LOGIN_SUCCESS: undefined,
  USER_LOGIN_FAILURE: undefined,
  USER_LOGOUT: undefined,
  USER_LOGOUT_SUCCESS: undefined,
  USER_LOGOUT_FAILURE: undefined,
  USER_REGISTER: undefined,
  USER_REGISTER_SUCCESS: undefined,
  USER_REGISTER_FAILURE: undefined,
  SHOW_ALERT: undefined,
  HIDE_ALERT: undefined,
  BRANCH_ADD_INITIATE: undefined,
  BRANCH_ADD: undefined,
  BRANCH_ADD_SUCCESS: undefined,
  BRANCH_ADD_FAILURE: undefined,
  BRANCH_GET: undefined,
  BRANCH_GET_SUCCESS: undefined,
  BRANCH_GET_FAILURE: undefined,
  BRANCHES_GET: undefined,
  BRANCHES_GET_SUCCESS: undefined,
  BRANCHES_GET_FAILURE: undefined,
  TABLE_ADD_INITIATE: undefined,
  TABLE_ADD: undefined,
  TABLE_ADD_SUCCESS: undefined,
  TABLE_ADD_FAILURE: undefined,
  TABLE_GET: undefined,
  TABLE_GET_SUCCESS: undefined,
  TABLE_GET_FAILURE: undefined,
  TABLES_GET: undefined,
  TABLES_GET_SUCCESS: undefined,
  TABLES_GET_FAILURE: undefined,
  TABLES_GET_BRANCH: undefined,
  TABLES_GET_ORG_SUCCESS: undefined,
  TABLES_GET_ORG_FAILURE: undefined,
  PRODUCT_ADD_INITIATE: undefined,
  PRODUCT_ADD: undefined,
  PRODUCT_ADD_SUCCESS: undefined,
  PRODUCT_ADD_FAILURE: undefined,
  PRODUCT_GET: undefined,
  PRODUCT_GET_SUCCESS: undefined,
  PRODUCT_GET_FAILURE: undefined,
  PRODUCTS_GET: undefined,
  PRODUCTS_GET_SUCCESS: undefined,
  PRODUCTS_GET_FAILURE: undefined,
});

/**
 * @constant {Object} STATUS
 * @memberof Constants
 */
export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'loading',
  READY: 'ready',
  SUCCESS: 'success',
  ERROR: 'exception',
};
