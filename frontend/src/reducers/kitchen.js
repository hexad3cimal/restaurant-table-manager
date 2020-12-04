import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const kitchenState = {
  status: STATUS.IDLE,
  add: false,
  new: false,
  error: null,
  kitchens: [],
  branchKitchens: [],
  selectedKitchen: null,
};

export default {
  kitchen: handleActions(
    {
      [ActionTypes.KITCHEN_ADD_INITIATE]: draft => {
        draft.add = true;
      },
      [ActionTypes.KITCHEN_ADD]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.KITCHEN_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.KITCHEN_ADD_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.IDLE;
        draft.add = false;
        draft.new = true;
      },
      [ActionTypes.KITCHEN_EDIT]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.KITCHEN_EDIT_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.KITCHEN_EDIT_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.KITCHEN_DELETE]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.KITCHEN_DELETE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.KITCHEN_DELETE_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.KITCHEN_GET]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.KITCHEN_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedKitchen = payload;
        draft.new = false;
      },
      [ActionTypes.KITCHEN_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.new = false;
      },
      [ActionTypes.KITCHENS_GET]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.KITCHENS_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.kitchens = payload;
      },
      [ActionTypes.KITCHENS_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.KITCHENS_GET_BRANCH]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.KITCHENS_GET_BRANCH_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.branchKitchens = payload;
      },
      [ActionTypes.KITCHENS_GET_BRANCH_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.SET_SELECTED_KITCHEN]: (draft, { payload }) => {
        draft.selectedKitchen = payload;
      },
    },
    kitchenState,
  ),
};
