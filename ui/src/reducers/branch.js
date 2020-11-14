import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const branchState = {
  status: STATUS.IDLE,
  error: null,
  branches: [],
  selectedBranch: null,
};

export default {
  branch: handleActions(
    {
      [ActionTypes.BRANCH_ADD]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.BRANCH_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.BRANCH_ADD_SUCCESS]: draft => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
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
      },
      [ActionTypes.BRANCH_GET]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedBranch = payload;
      },
      [ActionTypes.BRANCHES_GET]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.branches = payload;
      },
    },
    branchState,
  ),
};
