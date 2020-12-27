import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  orderAddInitiate: initiateOrderAdd,
  orderAdd: addOrder,
  orderGet: getOrderById,
  orderGetByTableId: getOrderByTableId,
  ordersGet: getOrders,
  orderAddProduct: addProductToOrder,
  orderRemoveProduct: removeProductFromOrder
} = createActions({
  [ActionTypes.ORDER_ADD_INITIATE]: () => ({}),
  [ActionTypes.ORDER_ADD]: payload => payload,
  [ActionTypes.ORDER_GET]: payload => payload,
  [ActionTypes.ORDER_GET_BY_TABLE_ID]: payload => payload,
  [ActionTypes.ORDERS_GET]: () => ({}),
  [ActionTypes.ORDER_ADD_PRODUCT]: payload => payload,
  [ActionTypes.ORDER_REMOVE_PRODUCT]: payload => payload,
});
