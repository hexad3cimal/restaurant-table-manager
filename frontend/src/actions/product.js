import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  productAddInitiate: initiateProductAdd,
  productAdd: addProduct,
  productGet: getProductById,
  productsGet: getProducts,
  productSetInState: setProductInState,
  productDelete: deleteProduct,
} = createActions({
  [ActionTypes.PRODUCT_ADD_INITIATE]: payload => payload,
  [ActionTypes.PRODUCT_ADD]: payload => payload,
  [ActionTypes.PRODUCT_GET]: payload => payload,
  [ActionTypes.PRODUCTS_GET]: () => ({}),
  [ActionTypes.PRODUCT_SET_IN_STATE]: payload => payload,
  [ActionTypes.PRODUCT_DELETE]: payload => payload,

});
