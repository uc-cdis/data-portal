import type store from './store';

export type AppDispatch = typeof store.dispatch;

export type AppGetState = typeof store.getState;

export type RootState = ReturnType<typeof store.getState>;

export type RootStore = typeof store;
