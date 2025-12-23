import ModuleSet from './AppModules';
import _ from 'lodash';
// TODO:  metro bundler dynamic issue
const actionModule: Record<string, any> = {
  common: require(`../../module/common/Action`),
  auth: require(`../../module/auth/Action`),
};

export const Actions = _(ModuleSet)
  .keyBy(module => module)
  .mapValues(module => {
    return actionModule[module];
  })
  .mapValues(module => module.default)
  .value();

export default Actions;
