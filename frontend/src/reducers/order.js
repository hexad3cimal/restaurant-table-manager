import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const orderState = {
  status: STATUS.IDLE,
  add: false,
  new: false,
  error: null,
  orders: [],
  selectedOrder: null,
};

export default {
  order: handleActions(
    {
      [ActionTypes.ORDER_ADD_INITIATE]: draft => {
        draft.add = true;
      },
      [ActionTypes.ORDER_ADD]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_ADD_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.IDLE;
        draft.add =false;
        draft.new = true;
      },
      [ActionTypes.ORDER_EDIT]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_EDIT_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_EDIT_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.ORDER_DELETE]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_DELETE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_DELETE_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      }
      ,
      [ActionTypes.ORDER_GET]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedOrder = payload;
        draft.new = false;
      },
      [ActionTypes.ORDER_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.new = false;
      },
      [ActionTypes.ORDERS_GET]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.ORDERS_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.orders = payload;
      },
      [ActionTypes.ORDERS_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.orders = [];
      }
      ,
      [ActionTypes.ORDER_GET_BY_TABLE_ID]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.ORDER_GET_BY_TABLE_ID_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.orders = payload;
      },
      [ActionTypes.ORDER_GET_BY_TABLE_ID_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.orders = [];
      }
    },
    orderState,
  ),
};
