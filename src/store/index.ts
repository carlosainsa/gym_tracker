import { configureStore } from '@reduxjs/toolkit';
import workoutReducer from './slices/workoutSlice';
import userReducer from './slices/userSlice';
import exerciseReducer from './slices/exerciseSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    workout: workoutReducer,
    user: userReducer,
    exercise: exerciseReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;