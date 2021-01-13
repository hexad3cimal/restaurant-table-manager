import { handleActions } from '../modules/helpers';

import { ActionTypes } from '../constants/index';

export const tagState = {
  similar: [],
};

export default {
  tag: handleActions(
    {
      [ActionTypes.TAG_GET_SIMILAR_SUCCESS]: (draft, { payload }) => {
        draft.similar = payload;
      },
    },
    tagState,
  ),
};