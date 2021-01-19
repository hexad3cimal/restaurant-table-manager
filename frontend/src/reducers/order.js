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

export default {
  order: handleActions(
    {
      [ActionTypes.ORDER_ADD_INITIATE]: (draft) => {
        draft.add = true;
      },
      [ActionTypes.ORDER_ADD]: (draft) => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.ORDER_ADD_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
      },
      [ActionTypes.ORDER_ADD_SUCCESS]: (draft) => {
        draft.isAuthenticated = true;
        draft.status = STATUS.IDLE;
        draft.add = false;
        draft.new = true;
      },
      [ActionTypes.ORDER_ADD_PRODUCT]: (draft, { payload }) => {
        const product = draft.selectedProducts.find((p) => {
          return p[payload.id]
        });
        if(product) {
          draft.selectedProducts = draft.selectedProducts.map((p) => {
           if(p[product.id]){
            let productFound =false
            p[product.id].items = p[product.id].items.map( item => {
              if(JSON.stringify(payload.customisations) === JSON.stringify(item.customisations))
                  payload.quantity = item.quantity
              if(JSON.stringify(item)===JSON.stringify(payload)){
                productFound =true
                item.quantity =item.quantity+1
              }
              return item
            })

            p[product.id].quantity = p[product.id].quantity + 1;
            p[product.id].cost = p[product.id].cost + parseInt(payload.price)
            p[product.id].cost = p[product.id].cost+ payload.customisations.reduce((a,b)=>(a+parseInt(b.price)),0)
           
            if(!productFound)p[product.id].items.push(payload)
          
          }
          p.customisations=payload.customisations
            return p;
          });
        } else {
        const cost =  parseInt(payload.price)+ payload.customisations.reduce((a,b)=>(a+parseInt(b.price)),0)
          draft.selectedProducts = [...draft.selectedProducts, {[payload.id]:{items:[payload]},...payload,cost:cost}];
        }
      },
      [ActionTypes.ORDER_REMOVE_PRODUCT]: (draft, { payload }) => {
        console.log(payload)
        draft.selectedProducts  = draft.selectedProducts[payload.id]['items'].filter((p) => {
          if(payload.id === p.id){
            p.quantity =  p.quantity-1
            if(p.quantity){
              p.cost = parseInt(p.cost) - payload.customisations.reduce((a,b)=>(a+parseInt(b.price)),0)
              return true
            }
            return false
          }else{
            return true
          }
        });
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
