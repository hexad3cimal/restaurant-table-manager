import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  branchAddInitiate: initiateBranchAdd,
  branchAdd: addBranch,
  branchGet: getBranchById,
  branchesGet: getBranchesOFOrg,
} = createActions({
  [ActionTypes.BRANCH_ADD_INITIATE]: () => ({}),
  [ActionTypes.BRANCH_ADD]: payload => payload,
  [ActionTypes.BRANCH_GET]: payload => payload,
  [ActionTypes.BRANCHES_GET]: () => ({}),
});
