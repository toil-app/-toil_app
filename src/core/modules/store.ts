import { configureStore } from '@reduxjs/toolkit';
import Reducers from './Reducers';
import actionMiddleware from '../middleware/ActionMiddleware';
import promiseMiddleware from '../middleware/PromiseMiddleware';
import { createLogger } from 'redux-logger';
import { Middleware } from 'redux';

const logger = createLogger({
  collapsed: true,
  duration: true,
});

export const store = configureStore({
  reducer: {
    ...Reducers,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      promiseMiddleware as unknown as Middleware,
      logger as unknown as Middleware,
      actionMiddleware() as unknown as Middleware,
    ),
  devTools: __DEV__,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
