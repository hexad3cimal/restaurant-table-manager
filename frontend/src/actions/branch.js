import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  branchAddInitiate: initiateBranchAdd,
  branchAdd: addBranch,
  branchGet: getBranchById,
  branchesGet: getBranches,
  branchGetTopProducts: getTopProductsOfBranch
} = createActions({
  [ActionTypes.BRANCH_ADD_INITIATE]: () => ({}),
  [ActionTypes.BRANCH_ADD]: payload => payload,
  [ActionTypes.BRANCH_GET]: payload => payload,
  [ActionTypes.BRANCHES_GET]: () => ({}),
  [ActionTypes.BRANCH_GET_TOP_PRODUCTS]: payload => payload,

});
