import { createSlice } from "@reduxjs/toolkit";

export const agentSlice = createSlice({
    name: "authentication_agent",
    initialState: {
        email: null,
        userid: null,
        username: null,
        isAuthenticated: false
    },
    reducers: {
        agent_login: (state, action) => {
            state.email = action.payload.email;
            state.userid = action.payload.userid;
            state.username = action.payload.username;
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        agent_logout: (state) => {
            state.email = null;
            state.userid = null;
            state.username = null;
            state.isAuthenticated = false;
        }
    }
});

export const { agent_login, agent_logout } = agentSlice.actions;
export default agentSlice.reducer;
