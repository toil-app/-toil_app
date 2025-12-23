import { createLogger, Logger, createAction } from './AppUtil';

// Example 1: use createLogger (recommended)
const logger = createLogger('AuthModule', 'debug');

logger.log('User login attempt', { username: 'alice' });
logger.info('Login flow started for', 'alice');
logger.warn('Login attempt with deprecated API');
logger.error('Login failed:', new Error('Invalid credentials'));

// Example 2: use Logger directly (minimal)
const fileLogger = Logger('PaymentModule', 'payments.ts');
fileLogger.log('Payment initiated', { amount: 12.5, currency: 'USD' });
fileLogger.warn('Payment retry scheduled');

// Example 3: createAction + logging (Redux-style action creator)
const sumAction = createAction('SUM', (a: number, b: number) => a + b);
const action = sumAction(3, 4); // { type: 'SUM', payload: 7 }

logger.log('Dispatching action', action);

// Example 4: helper to log method entry/exit
function exampleFn(x: number) {
  logger.log('exampleFn entered with', x);
  const result = x * 2;
  logger.log('exampleFn result', result);
  return result;
}

exampleFn(5);

// You can import and run this file from App.tsx or call these examples from a screen/component
// to observe console output during development.
