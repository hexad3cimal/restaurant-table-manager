import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  productAddInitiate: initiateProductAdd,
  productAdd: addProduct,
  productGet: getProductById,
  productsGet: getProducts,
} = createActions({
  [ActionTypes.PRODUCT_ADD_INITIATE]: () => ({}),
  [ActionTypes.PRODUCT_ADD]: payload => payload,
  [ActionTypes.PRODUCT_GET]: payload => payload,
  [ActionTypes.PRODUCTS_GET]: () => ({}),
});
