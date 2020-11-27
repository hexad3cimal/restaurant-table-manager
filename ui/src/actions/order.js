import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  orderAddInitiate: initiateOrderAdd,
  orderAdd: addOrder,
  orderGet: getOrderById,
  ordersGet: getOrders,
} = createActions({
  [ActionTypes.ORDER_ADD_INITIATE]: () => ({}),
  [ActionTypes.ORDER_ADD]: payload => payload,
  [ActionTypes.ORDER_GET]: payload => payload,
  [ActionTypes.ORDERS_GET]: () => ({}),
});
