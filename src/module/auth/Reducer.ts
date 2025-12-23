import { Map } from 'immutable';
// import _ from 'lodash';
import { ModuleEvents } from './Action';
import { Action } from '../../core/util/AppUtil';

const InitialState = Map({
  credentials: null,
});

export const Reducer = (
  state: Map<string, any> = InitialState,
  action: Action,
) => {
  const { payload, type } = action;
  switch (type) {
    case ModuleEvents.LOG_IN: {
      return state.set('credentials', payload);
    }
    default:
      break;
  }
  return state;
};
