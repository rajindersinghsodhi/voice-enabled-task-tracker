import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './chatSlice';
import themeReducer from './themeSlice';
import userConnectionReducer from './userConnections';
import aiReducer from './aiSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { createBlacklistFilter } from "redux-persist-transform-filter"
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const saveWithoutRole = createBlacklistFilter("user", ["selectedRole"])
// 1. Create persist config
const persistConfig = {
  key: 'root',
  storage,
  transforms: [saveWithoutRole],
};

// 2. Combine reducers if you plan to add more slices
const appReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  theme: themeReducer,
  userConnection: userConnectionReducer,
  aiState: aiReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    storage.removeItem('persist:root'); // clear persisted storage
    return appReducer(undefined, action); // reset redux state
  }
  return appReducer(state, action);
};

// 3. Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Export persistor to use in Provider
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
