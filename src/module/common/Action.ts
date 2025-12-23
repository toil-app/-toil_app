import { createAction } from '../../core/util/AppUtil';

export const ModuleEvents = {
  LOADING_STARTED: 'LOADING_STARTED',
  LOADING_FINISHED: 'LOADING_FINISHED',
  NETWORK_ERROR: 'NETWORK_ERROR',
};

export default {
  networkError: createAction(ModuleEvents.NETWORK_ERROR, error => error),
  loadingStarted: createAction(ModuleEvents.LOADING_STARTED, action => action),
  loadingFinished: createAction(
    ModuleEvents.LOADING_FINISHED,
    action => action,
  ),
};
