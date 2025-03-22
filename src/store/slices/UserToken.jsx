// tokenSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Slice for token management
export const tokenSlice = createSlice({
  name: "usertoken",
  initialState: {
    user_access_token: null,
    user_refresh_token: null,
  },
  reducers: {
    setTokens: (state, action) => {
      state.user_access_token = action.payload.user_access_token;
      state.user_refresh_token = action.payload.user_refresh_token;
    },
    clearTokens: (state) => {
      state.user_access_token = null;
      state.user_refresh_token = null;
    },
  },
});

export const { setTokens, clearTokens } = tokenSlice.actions;

export default tokenSlice.reducer;
