import { handleActions } from "../modules/helpers";

import { ActionTypes } from "../constants/index";

export const dashboardState = {
  stats: {},
  error: null,
};

export default {
  dashboard: handleActions(
    {
      [ActionTypes.DASHBOARD_STATS_GET_SUCCESS]: (draft, { payload }) => {
        draft.stats = payload;
      },
    },
    {
      [ActionTypes.DASHBOARD_STATS_GET_FAILURE]: (draft, { payload }) => {
        draft.error = payload;
      },
    },
    dashboardState
  ),
};
