import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  addBranch: addBranch,
  getBranchById: getBranchById,
  getBranchesForOrg: getBranchesForOrg,
} = createActions({
  [ActionTypes.BRANCH_ADD]: branchDetails => branchDetails,
  [ActionTypes.BRANCH_GET]: ({ branchID }) => ({ branchID }),
  [ActionTypes.BRANCHES_GET]: ({}) => ({}),
});
