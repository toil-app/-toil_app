import _ from 'lodash';
import { AllHandlers } from '../modules/Handlers';
import { Actions } from '../modules/Actions';
import { Action } from '../util/AppUtil';
import { NetworkError } from '../models';

// const logger = createLogger('[Action]');

/**
 * bind the handlers
 */
export const actionMiddleware = () => {
  return ({ dispatch, getState }: any) =>
    (next: any) =>
    (action: Action) => {
      const handlers = AllHandlers[action.type];
      const { payload: data, error }: Action = action;

      if (error) {
        if (data instanceof NetworkError) {
          dispatch(Actions.common.networkError(action));
        } else {
          if (error.code) {
          } else {
          }
        }
      }

      const nextResult = next(action);

      _.forEach(handlers, handler => {
        handler({
          dispatch,
          payload: action.payload,
          appState: getState(),
          error,
        });
      });

      return nextResult;
      //return next(action);
    };
};

export default actionMiddleware;
