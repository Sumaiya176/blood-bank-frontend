/* eslint-disable @typescript-eslint/no-unused-vars */
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// export const reducer = {
//   [baseApi.reducerPath]: baseApi.reducer,
//   auth: persistedAuthReducer,
// };

export const reducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedAuthReducer,
});
