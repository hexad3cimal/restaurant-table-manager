import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  tableAddInitiate: initiateTableAdd,
  tableAdd: addTable,
  tableGet: getTableById,
  tablesGet: getTablesForBranch,
} = createActions({
  [ActionTypes.TABLE_ADD_INITIATE]: () => ({}),
  [ActionTypes.TABLE_ADD]: payload => payload,
  [ActionTypes.TABLE_GET]: payload => payload,
  [ActionTypes.TABLES_GET]: payload => payload,
});
