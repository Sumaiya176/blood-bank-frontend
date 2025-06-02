import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

type TUser = {
  name: string;
  email: string;
  id: string;
  iat: string;
  exp: string;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
  route: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  route: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setRoute: (state, action) => {
      const { path } = action.payload;
      state.route = path;
    },
    removeRoute: (state) => {
      state.route = null;
    },
  },
});

export const { setUser, logout, setRoute, removeRoute } = authSlice.actions;
export default authSlice.reducer;
export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentUser = (state: RootState) => state.auth.user;
export const useCurrentRoute = (state: RootState) => state.auth.route;
export const useCurrentAuth = (state: RootState) => state.auth;
