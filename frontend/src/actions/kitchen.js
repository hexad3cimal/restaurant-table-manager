import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  kitchenAddInitiate: initiateKitchenAdd,
  kitchenAdd: addKitchen,
  kitchenGet: getKitchenById,
  kitchensGet: getKitchens,
  kitchensGetBranch: getKitchensOfBranch,
  kitchenDelete: deleteKitchen,
  kitchenEdit: editKitchen,
  kitchenSetInState: setKitchenInState
} = createActions({
  [ActionTypes.KITCHEN_ADD_INITIATE]: payload => payload,
  [ActionTypes.KITCHEN_ADD]: payload => payload,
  [ActionTypes.KITCHEN_GET]: payload => payload,
  [ActionTypes.KITCHEN_SET_IN_STATE]: payload => payload,
  [ActionTypes.KITCHENS_GET]: () => ({}),
  [ActionTypes.KITCHENS_GET_BRANCH]: () => ({}),
  [ActionTypes.KITCHEN_DELETE]: payload => payload,
  [ActionTypes.KITCHEN_EDIT]: payload => payload,
  [ActionTypes.KITCHEN_SET_IN_STATE]: payload => payload,
});
