// import {Actions} from '../../core/modules/Actions';
import { ModuleEvents } from './Action';

export default {
  [ModuleEvents.NETWORK_ERROR]: ({
    payload,
    appState,
  }: {
    payload: any;
    appState: any;
  }) => {
    if (payload?.error) {
      console.log('Network Error:', appState);
    }
    //  Logger.infor(JSON.stringify(payload))
  },
};
