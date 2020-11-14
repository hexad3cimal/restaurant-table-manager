import { createActions, createAction } from 'redux-actions';

import { ActionTypes } from '../constants/index';

// export const {
//   addBranch: add,
//   getBranchById: getById,
//   getBranchesForOrg: getForOrg,
// } = createActions({
//   [ActionTypes.BRANCH_ADD]: branchDetails => branchDetails,
//   [ActionTypes.BRANCH_GET]: ({ branchID }) => ({ branchID }),
//   [ActionTypes.BRANCHES_GET]: () => ({}),
// });

export const add = createAction([ActionTypes.BRANCH_ADD], branchDetails => branchDetails);

export const getById = createAction([ActionTypes.BRANCH_ADD], ({ branchID }) => ({ branchID }));

export const getForOrg = createAction([ActionTypes.BRANCH_ADD], () => ({}));
