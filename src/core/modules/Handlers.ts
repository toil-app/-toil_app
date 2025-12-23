var _ = require('lodash');
import ModuleSet from './AppModules';

// TODO:  metro bundler dynamic issue
const handlerModule: Record<string, any> = {
  common: require(`../../module/common/Handler`),
  auth: require(`../../module/auth/Handler`),
};

export const Handlers = _(ModuleSet)
  .keyBy((module: string) => module)
  .mapValues((module: string) => {
    try {
      const moduleHandler = handlerModule[module];
      return moduleHandler.default;
    } catch {
      // console.warn('ok');
      return { default: {} };
    }
  })
  .value();

export const AllHandlers = _(Handlers)
  .transform((result: { [x: string]: any }, handler: any) => {
    _.mapKeys(handler, (fn: any, key: string) => {
      if (key === 'default') {
        return;
      }
      result[key] = result[key] ? _.concat(result[key], fn) : [fn];
    });
    return result;
  }, {})
  .value();
export default Handlers;
