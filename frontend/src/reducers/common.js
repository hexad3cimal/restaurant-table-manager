import { handleActions } from '../modules/helpers';

import { ActionTypes } from '../constants/index';

export const appState = {
  alert: { show: false, message: null },
  tzs:[],
  currencies:[]
};

export default {
  app: handleActions(
    {
      [ActionTypes.SHOW_ALERT]: (draft, { payload }) => {
        draft.alert.show = true;
        draft.alert.message = payload;
      },
      [ActionTypes.HIDE_ALERT]: draft => {
        draft.alert.show = false;
        draft.alert.message = null;
      },
      [ActionTypes.GET_TIMEZONES_SUCCESS]: (draft, { payload }) => {
        draft.tzs = payload;
      },
      [ActionTypes.GET_TIMEZONES_FAILURE]: (draft, { payload }) => {
        draft.alert.show = true;
        draft.alert.message = payload;
      },
      [ActionTypes.GET_CURRENCIES_SUCCESS]: (draft, { payload }) => {
        draft.alert.show = true;
        draft.currencies = payload;
      },
      [ActionTypes.GET_CURRENCIES_FAILURE]: (draft, { payload }) => {
        draft.alert.show = true;
        draft.alert.message = payload;
      },
    },
    appState,
  ),
};
