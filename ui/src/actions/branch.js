import { createActions, createAction } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const { branchAddInitiate:initiateBranchAdd, branchAdd: add, branchGet: getById, branchesGet: getForOrg } = createActions({
    [ActionTypes.BRANCH_ADD_INITIATE]: () => ({}),
    [ActionTypes.BRANCH_ADD]: payload => payload,
    [ActionTypes.BRANCH_GET]: payload => payload,
    [ActionTypes.BRANCHES_GET]: () => ({}),
  });
  