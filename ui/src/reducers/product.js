import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const productState = {
  status: STATUS.IDLE,
  add: false,
  new: false,
  error: null,
  products: [],
  selectedProduct: null,
};

export default {
  product: handleActions(
    {
      [ActionTypes.PRODUCT_ADD_INITIATE]: draft => {
        draft.add = true;
      },
      [ActionTypes.PRODUCT_ADD]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.PRODUCT_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.PRODUCT_ADD_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.IDLE;
        draft.add =false;
        draft.new = true;
      },
      [ActionTypes.PRODUCT_EDIT]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.PRODUCT_EDIT_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.PRODUCT_EDIT_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.PRODUCT_DELETE]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.PRODUCT_DELETE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.PRODUCT_DELETE_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      }
      ,
      [ActionTypes.PRODUCT_GET]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.PRODUCT_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedProduct = payload;
        draft.new = false;
      },
      [ActionTypes.PRODUCT_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.new = false;
      },
      [ActionTypes.PRODUCTS_GET]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.PRODUCTS_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.products = payload;
      },
      [ActionTypes.PRODUCTS_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.products = [];
      }
    },
    productState,
  ),
};
