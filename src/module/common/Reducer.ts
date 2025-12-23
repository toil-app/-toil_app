import { Map } from 'immutable';
// import _ from 'lodash';
import { ModuleEvents } from './Action';
import { Action } from '../../core/util/AppUtil';

const InitialState = Map({
  loadingAction: { loading: false, action: {} },
});

export const Reducer = (
  state: Map<string, any> = InitialState,
  action: Action,
) => {
  const { payload, type } = action;
  switch (type) {
    case ModuleEvents.LOADING_STARTED: {
      return state.set('loadingAction', { loading: true, action: payload });
    }
    case ModuleEvents.LOADING_FINISHED: {
      return state.set('loadingAction', { loading: false, action: payload });
    }
  }
  return state;
};
