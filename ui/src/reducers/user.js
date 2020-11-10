import { handleActions } from '../modules/helpers';

import { STATUS, ActionTypes } from '../constants/index';

export const userState = {
  isAuthenticated: false,
  registered: false,
  status: STATUS.IDLE,
  error: null,
  data: {},
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
      },
      [ActionTypes.USER_LOGIN_SUCCESS]: (draft, { payload }) => {
        draft.isAuthenticated = true;
        draft.status = STATUS.READY;
        draft.data.user = payload;
      },
      [ActionTypes.USER_LOGOUT]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.USER_LOGOUT_SUCCESS]: draft => {
        draft.isAuthenticated = false;
        draft.status = STATUS.IDLE;
      },
      [ActionTypes.USER_REGISTER]: draft => {
        draft.status = STATUS.RUNNING;
      },
      [ActionTypes.USER_REGISTER_FAILURE]: (draft, { payload }) => {
        draft.status = STATUS.ERROR;
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
