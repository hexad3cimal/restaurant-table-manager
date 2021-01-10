import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  branchAddInitiate: initiateBranchAdd,
  branchAdd: addBranch,
  branchGet: getBranchById,
  branchesGet: getBranches,
  branchGetTopProducts: getTopProductsOfBranch,
  branchSetInState: setBranch
} = createActions({
  [ActionTypes.BRANCH_ADD_INITIATE]: payload => payload,
  [ActionTypes.BRANCH_ADD]: payload => payload,
  [ActionTypes.BRANCH_GET]: payload => payload,
  [ActionTypes.BRANCHES_GET]: () => ({}),
  [ActionTypes.BRANCH_GET_TOP_PRODUCTS]: payload => payload,
  [ActionTypes.BRANCH_SET_IN_STATE]: payload => payload,
});
