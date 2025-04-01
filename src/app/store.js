import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import todoReducer from '../features/todo/todoSlice';
import authReducer from '../features/auth/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'todo']
};

const store = configureStore({
  reducer: {
    todo: persistReducer(persistConfig, todoReducer),
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);
export default store;