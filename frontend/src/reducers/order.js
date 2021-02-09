import { handleActions } from "../modules/helpers";

import { STATUS, ActionTypes } from "../constants/index";

export const orderState = {
  status: STATUS.IDLE,
  add: false,
  new: false,
  error: null,
  orders: [],
  selectedOrder: null,
  selectedProducts: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  order: handleActions(
    {
      [ActionTypes.ORDER_ADD_INITIATE]: (draft, { payload }) => {
        draft.add = payload;
      },
      [ActionTypes.ORDER_ADD]: (draft) => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_ADD_SUCCESS]: (draft) => {
        draft.status = STATUS.IDLE;
        draft.add = false;
        draft.new = true;
      },
      [ActionTypes.ORDER_UPDATE]: (draft) => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_UPDATE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_UPDATE_SUCCESS]: (draft) => {
        draft.status = STATUS.IDLE;
      },
      [ActionTypes.ORDER_ADD_PRODUCT]: (draft, { payload }) => {
       if(!payload.cartItemPanel) payload.name = payload.name + payload.customisations.reduce(
          (a, b) => a + " + "+ b.name,
          ""
        );
        delete payload.cartItemPanel
        const product = draft.selectedProducts.find((p) => {
          return p.id === payload.id;
        });
        if (product) {
          draft.selectedProducts = draft.selectedProducts.map((p) => {
            if (p.id === payload.id) {

              let productFound = false;
              p.items = p.items.map((item) => {
                if(item.customisations.length)p.isCustomisationsThere=true
                  const cost = item.cost
                   delete item["cost"]  
                   delete payload["cost"]
                const customisationsEqual =
                  JSON.stringify(payload.customisations) ===
                  JSON.stringify(item.customisations);
                if (customisationsEqual) payload.quantity = item.quantity;
                if (JSON.stringify(item) === JSON.stringify(payload)) {
                  productFound = true;
                  item.quantity = item.quantity + 1;
                    item.cost =
                      item.quantity *
                      (payload.price +
                        payload.customisations.reduce(
                          (a, b) => a + b.price,
                          0
                        ));
                }else{
                  item.cost =cost
                }
                return item;
              });
              p.quantity = p.quantity + 1;
              p.cost =
                p.cost +
                payload.customisations.reduce((a, b) => a + b.price, 0);
              payload.cost =
                payload.price +
                payload.customisations.reduce((a, b) => a + b.price, 0);
              if (!productFound) p.items.push(payload);
            }
            return p;
          });
          
        } else {
          payload.cost = payload.price +
          payload.customisations.reduce((a, b) => a + b.price, 0);
    
          draft.selectedProducts = [
            ...draft.selectedProducts,
            {   ...payload, items: [payload], cost: payload.cost
            },
          ];
        }
      },
      [ActionTypes.ORDER_REMOVE_PRODUCT]: (draft, { payload }) => {
        draft.selectedProducts = draft.selectedProducts.filter( product => {
          if(product.id === payload.id){
            product[
              "items"
            ] = product[
                "items"
              ].filter((item) => {
                if (JSON.stringify(payload.customisations) === JSON.stringify(item.customisations)) {
                  product['quantity'] =  product['quantity'] - 1
                  product['cost'] =  product['cost'] - (payload.price +
                  payload.customisations.reduce((a, b) => a + b.price, 0));
                  item.quantity = item.quantity - 1;
                  if (!item.quantity)
                        return false
                    item.cost =
                    item.cost - (payload.price +
                      payload.customisations.reduce((a, b) => a + b.price, 0));
                    return true;
                  
                } else {
                  return true;
                }
              });
            }
            return product['quantity'] !== 0
        })
      },
      [ActionTypes.ORDER_EDIT]: (draft) => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_EDIT_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_EDIT_SUCCESS]: (draft) => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.ORDER_DELETE]: (draft) => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_DELETE_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_DELETE_SUCCESS]: (draft) => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
      },
      [ActionTypes.ORDER_GET]: (draft) => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.selectedOrder = payload;
        draft.new = false;
      },
      [ActionTypes.ORDER_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.new = false;
      },
      [ActionTypes.ORDERS_GET]: (draft) => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.ORDERS_GET_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.orders = payload;
      },
      [ActionTypes.ORDERS_GET_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.orders = [];
      },
      [ActionTypes.ORDER_GET_BY_TABLE_ID]: (draft) => {
        draft.status = STATUS.RUNNING;
        draft.new = false;
      },
      [ActionTypes.ORDER_GET_BY_TABLE_ID_SUCCESS]: (draft, { payload }) => {
        draft.status = STATUS.READY;
        draft.orders = payload;
      },
      [ActionTypes.ORDER_GET_BY_TABLE_ID_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.orders = [];
      },
    },
    orderState
  ),
};
