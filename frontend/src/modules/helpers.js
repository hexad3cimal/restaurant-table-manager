// @flow
/**
 * Helper functions
 * @module Helpers
 */
import produce from 'immer';
import { request } from './client';


export const isFormValid = (errors, touched) => {
  let bool = true;
  if(!Object.keys(touched).length)return false
  for (let key in errors) {
    if (Boolean(errors[key])) {
      bool = false;
      break;
    }
  }
  if (bool) {
    for (let key in touched) {
      if (!Boolean(touched[key])) {
        bool = false;
        break;
      }
    }
  }
  return bool;
};
export function handleActions(actionsMap , defaultState ) {
  return (state = defaultState, { type, ...rest }  = {})  =>
    produce(state, (draft)  => {
      const action = actionsMap[type];
      let newState;

      if (action) {
        newState = action(draft, rest);
      }

      if (newState) {
        return newState;
      }

      return draft;
    });
}

export function keyMirror(obj) {
  const output = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(output, key)) {
      output[key] = key;
    }
  }

  return output;
}

export const spread = produce(Object.assign);


export const handleRefreshToken = (url) => {
  setTimeout( () => { request(url, {method: 'GET'})},1000*60*1)
}