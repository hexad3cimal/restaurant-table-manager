import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const categoryState = {
  status: STATUS.IDLE,
  add: false,
  new: false,
  error: null,
  categorys: [],
  branchCategorys: [],
  selectedCategory: null,
};

export default {
  category: handleActions(
    {
      [ActionTypes.CATEGORY_ADD_INITIATE]: (draft, { payload }) => {
        draft.add = payload;
      },
      [ActionTypes.CATEGORY_SET_IN_STATE]: (draft, { payload }) => {
        draft.selectedCategory = payload;
      },
      [ActionTypes.CATEGORY_ADD]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.CATEGORY_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.CATEGORY_ADD_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.IDLE;
        draft.add = false;
        draft.new = true;
      },
      [ActionTypes.CATEGORY_EDIT]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.CATEGORY_EDIT_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.CATEGORY_EDIT_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.CATEGORY_DELETE]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.CATEGORY_DELETE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.CATEGORY_DELETE_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.CATEGORY_GET]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.CATEGORY_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedCategory = payload;
        draft.new = false;
      },
      [ActionTypes.CATEGORY_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.new = false;
      },
      [ActionTypes.CATEGORIES_GET]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.CATEGORIES_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.categorys = payload;
      },
      [ActionTypes.CATEGORIES_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.SET_SELECTED_CATEGORY]: (draft, { payload }) => {
        draft.selectedCategory = payload;
      },
    },
    categoryState,
  ),
};
