import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const branchState = {
  status: STATUS.IDLE,
  add: false,
  new: false,
  error: null,
  tables: [],
  selectedTable: null,
};

export default {
  branch: handleActions(
    {
      [ActionTypes.TABLE_ADD_INITIATE]: draft => {
        draft.add = true;
      },
      [ActionTypes.TABLE_ADD]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.TABLE_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.TABLE_ADD_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.IDLE;
        draft.add = false;
        draft.new = true;
      },
      [ActionTypes.TABLE_EDIT]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.TABLE_EDIT_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.TABLE_EDIT_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.TABLE_DELETE]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.TABLE_DELETE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.TABLE_DELETE_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.TABLE_GET]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.TABLE_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedBranch = payload;
        draft.new = false;
      },
      [ActionTypes.TABLE_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.new = false;
      },
      [ActionTypes.TABLES_GET]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.TABLES_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.branches = payload;
      },
      [ActionTypes.TABLES_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
    },
    branchState,
  ),
};
