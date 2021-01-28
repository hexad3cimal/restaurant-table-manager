import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  dashboardStatsGet: getDashboardStats,
} = createActions({
  [ActionTypes.DASHBOARD_STATS_GET]: () => ({}),
});
