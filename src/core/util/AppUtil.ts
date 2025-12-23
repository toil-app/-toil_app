import _ from 'lodash';

interface Action<T = string, P = any, M = any> {
  type: T;
  payload: P;
  meta?: M;
  error?: any;
}

type AnyFunction = (...args: any[]) => any;
type ActionCreator<
  T extends string = string,
  A extends AnyFunction = AnyFunction,
  M = any,
> = (...args: Parameters<A>) => Action<T, ReturnType<A>, M>;

const createAction = <
  T extends string = string,
  A extends AnyFunction = AnyFunction,
  M = any,
>(
  type: T,
  action: A = ((..._args: any[]) => undefined) as A,
  meta?: M,
): ActionCreator<T, A, M> => {
  return (...args: Parameters<A>) =>
    ({
      type,
      payload: action.apply(null, args) as ReturnType<A>,
      meta,
    } as Action<T, ReturnType<A>, M>);
};

const Logger = (_module: string, _file?: string) => {
  const prefix = _file ? `${_module}:${_file}` : _module;
  const ts = () => new Date().toISOString();

  return {
    log: (..._args: any[]) => {
      console.log(`[${ts()}] [${prefix}]`, ..._args);
    },
    warn: (..._args: any[]) => {
      console.warn(`[${ts()}] [${prefix}]`, ..._args);
    },
    error: (..._args: any[]) => {
      console.error(`[${ts()}] [${prefix}]`, ..._args);
    },
  };
};

const createLogger = (_module = 'default', _level = 'debug') => {
  const logger = Logger(_module);
  const levels: Record<string, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  const current = levels[_level] ?? 0;

  return {
    log: (..._args: any[]) => {
      if (current <= levels.debug) {
        logger.log(..._args);
      }
    },
    info: (..._args: any[]) => {
      if (current <= levels.info) {
        // eslint-disable-next-line no-console
        console.info &&
          console.info(`[${new Date().toISOString()}] [${_module}]`, ..._args);
      }
    },
    warn: (..._args: any[]) => {
      if (current <= levels.warn) {
        logger.warn(..._args);
      }
    },
    error: (..._args: any[]) => {
      if (current <= levels.error) {
        logger.error(..._args);
      }
    },
  };
};

export { _, createAction, createLogger, Logger };
export type { Action };
