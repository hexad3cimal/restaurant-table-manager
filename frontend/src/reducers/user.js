import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';
import { remove, set } from '../modules/cacheManager';

export const userState = {
  isAuthenticated: false,
  registered: false,
  status: STATUS.IDLE,
  error: null,
  user: {},
};

export default {
  user: handleActions(
    {
      [ActionTypes.USER_LOGIN]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.USER_LOGIN_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.error = payload;
        draft.isAuthenticated = false;
      },
      [ActionTypes.USER_LOGIN_SUCCESS]: (draft, { payload }) => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
        draft.user = payload;
        set('user', payload);
      },
      [ActionTypes.USER_LOGOUT_SUCCESS]: draft => {
        draft.status = STATUS.READY;
        draft.user = null;
        draft.isAuthenticated = false;
        remove('user')
      },
      [ActionTypes.USER_LOGOUT_FAILURE]: draft => {
        draft.status = STATUS.READY;
        draft.user = null;
        draft.isAuthenticated = false;
        remove('user')
      },
      [ActionTypes.USER_REGISTER]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.USER_REGISTER_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
        draft.registered = false;
        draft.error = payload;
      },
      [ActionTypes.USER_REGISTER_SUCCESS]: draft => {
        draft.status = STATUS.READY;
        draft.registered = true;
      },
    },
    userState,
  ),
};
