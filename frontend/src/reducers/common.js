import { handleActions } from '../modules/helpers';

import { ActionTypes } from '../constants/index';

export const appState = {
  alert: { show: false, message: null },
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
    },
    appState,
  ),
};
