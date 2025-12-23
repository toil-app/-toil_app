// import {Actions} from '../../core/modules/Actions';
import { createLogger } from '../../core/util/AppUtil';
import { ModuleEvents } from './Action';

const Logger = createLogger('Auth');

export default {
  [ModuleEvents.LOG_IN]: ({
    payload,
    appState,
  }: {
    payload: any;
    appState: any;
  }) => {
    if (payload?.error) {
      console.log('Network Error:', appState);
    }

    Logger.info(JSON.stringify(payload));
  },
};
