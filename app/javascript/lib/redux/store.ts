import { configureStore } from '@reduxjs/toolkit';
import noteSliceReducer from './noteSlice';

export const store = configureStore({ reducer: noteSliceReducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
