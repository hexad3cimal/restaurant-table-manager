import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  kitchenAddInitiate: initiateKitchenAdd,
  kitchenAdd: addKitchen,
  kitchenGet: getKitchenById,
  setSelectedKitchen: selectedKitchen,
  kitchensGet: getKitchens,
  kitchensGetBranch: getKitchensOfBranch,
} = createActions({
  [ActionTypes.KITCHEN_ADD_INITIATE]: () => ({}),
  [ActionTypes.KITCHEN_ADD]: payload => payload,
  [ActionTypes.KITCHEN_GET]: payload => payload,
  [ActionTypes.SET_SELECTED_KITCHEN]: payload => payload,
  [ActionTypes.KITCHENS_GET]: () => ({}),
  [ActionTypes.KITCHENS_GET_BRANCH]: () => ({}),
});
