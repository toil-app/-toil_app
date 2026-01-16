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
  // Small helper: decide if styled CSS output is available (browser devtools)
  const supportsCss = () => {
    try {
      // In Chrome/DevTools console, %c styling works. In Metro/Node, it doesn't.
      // Heuristic: if globalThis.document exists, assume browser devtools.
      // Use globalThis to avoid TypeScript window/global issues.
      return typeof globalThis !== 'undefined' && (globalThis as any).document;
    } catch {
      return false;
    }
  };

  const ansi = {
    reset: '\u001b[0m',
    red: '\u001b[31m',
    yellow: '\u001b[33m',
    green: '\u001b[32m',
    blue: '\u001b[34m',
  };

  const formatLabel = () => `[${ts()}] [${prefix}]`;

  return {
    log: (..._args: any[]) => {
      const label = formatLabel();
      if (supportsCss()) {
        // browser console: use %c styling
        // green label
        console.log(`%c${label}`, 'color: #0a0; font-weight: 600;', ..._args);
      } else {
        // terminal / metro: use ANSI colors
        console.log(`${ansi.green}${label}${ansi.reset}`, ..._args);
      }
    },
    warn: (..._args: any[]) => {
      const label = formatLabel();
      if (supportsCss()) {
        console.warn(
          `%c${label}`,
          'color: #b58900; font-weight: 600;',
          ..._args,
        );
      } else {
        console.warn(`${ansi.yellow}${label}${ansi.reset}`, ..._args);
      }
    },
    error: (..._args: any[]) => {
      const label = formatLabel();
      if (supportsCss()) {
        console.error(`%c${label}`, 'color: #d00; font-weight: 700;', ..._args);
      } else {
        console.error(`${ansi.red}${label}${ansi.reset}`, ..._args);
      }
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
