import { createActions } from 'redux-actions';

import { ActionTypes } from '../constants/index';

export const {
  tagGetSimilar: getSimilarTags,
} = createActions({
  [ActionTypes.TAG_GET_SIMILAR]: payload => payload,
});
