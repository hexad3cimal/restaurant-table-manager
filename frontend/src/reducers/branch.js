import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const branchState = {
  status: STATUS.IDLE,
  add: false,
  edit:false,
  new: false,
  error: null,
  branches: [],
  topProducts: [],
  selectedBranch: null,
};

export default {
  branch: handleActions(
    {
      [ActionTypes.BRANCH_ADD_INITIATE]: (draft, { payload }) => {
        draft.add = payload;
      },
      [ActionTypes.BRANCH_ADD]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.BRANCH_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.BRANCH_ADD_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.IDLE;
        draft.add =false;
        draft.new = true;
      },
      [ActionTypes.BRANCH_EDIT]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.BRANCH_EDIT_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.BRANCH_EDIT_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.BRANCH_DELETE]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.BRANCH_DELETE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.BRANCH_DELETE_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      }
      ,
      [ActionTypes.BRANCH_GET]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.BRANCH_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedBranch = payload;
        draft.new = false;
      },
      [ActionTypes.BRANCH_SET_IN_STATE]: (draft, { payload }) => {
        draft.selectedBranch = payload;
        draft.edit = true;
      },
      [ActionTypes.BRANCH_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.new = false;
      },
      [ActionTypes.BRANCHES_GET]: draft => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.BRANCHES_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.branches = payload;
      },
      [ActionTypes.BRANCHES_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
    [ActionTypes.BRANCH_GET_TOP_PRODUCTS]: draft => {
      draft.status = STATUS.RUNNING;
      draft.new = false;
    },
    [ActionTypes.BRANCH_GET_TOP_PRODUCTS_SUCCESS]: (draft, { payload }) => {
      draft.status = STATUS.READY;
      draft.topProducts = payload;
    },
    [ActionTypes.BRANCH_GET_TOP_PRODUCTS_FAILURE]: (draft, { payload }) => {
      draft.status = STATUS.ERROR;
      draft.error = payload;
    }
  },
    branchState,
  ),
};
