import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  categoryAddInitiate: initiateCategoryAdd,
  categoryAdd: addCategory,
  categoryGet: getCategoryById,
  categoriesGet: getCategoryies,
  categoryDelete: deleteCategory,
  categoryEdit: editCategory,
  categorySetInState: setCategoryInState
} = createActions({
  [ActionTypes.CATEGORY_ADD_INITIATE]: payload => payload,
  [ActionTypes.CATEGORY_ADD]: payload => payload,
  [ActionTypes.CATEGORY_GET]: payload => payload,
  [ActionTypes.CATEGORY_SET_IN_STATE]: payload => payload,
  [ActionTypes.CATEGORIES_GET]: () => ({}),
  [ActionTypes.CATEGORY_DELETE]: payload => payload,
  [ActionTypes.CATEGORY_EDIT]: payload => payload,
  [ActionTypes.CATEGORY_SET_IN_STATE]: payload => payload,
});
