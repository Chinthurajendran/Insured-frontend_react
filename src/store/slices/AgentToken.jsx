import { createSlice } from "@reduxjs/toolkit";

export const agenttokenSlice = createSlice({
  name: "agenttoken",
  initialState: {
    agent_access_token: null,
    agent_refresh_token: null,
  },
  reducers: {
    setagentTokens: (state, action) => {
      state.agent_access_token = action.payload.agent_access_token;
      state.agent_refresh_token = action.payload.agent_refresh_token;
    },
    clearagentTokens: (state) => {
      state.agent_access_token = null;
      state.agent_refresh_token = null;
    },
  },
});

export const { setagentTokens, clearagentTokens } = agenttokenSlice.actions;

export default agenttokenSlice.reducer;
