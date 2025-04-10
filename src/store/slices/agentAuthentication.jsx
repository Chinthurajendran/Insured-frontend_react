import { createSlice } from "@reduxjs/toolkit";

export const agentSlice = createSlice({
    name: "authentication_agent",
    initialState: {
        agent_email: null,
        agent_uuid: null,
        agent_username: null,
        agnet_userid:null,
        agent_role:null,
        isAuthenticated_agent: false
    },
    reducers: {
        agent_login: (state, action) => {
            state.agent_email = action.payload.agent_email;
            state.agent_uuid = action.payload.agent_uuid;
            state.agent_username = action.payload.agent_username;
            state.agnet_userid = action.payload.agnet_userid;
            state.agent_role = action.payload.agent_role;
            state.isAuthenticated_agent = action.payload.isAuthenticated_agent;
        },
        agent_logout: (state) => {
            state.agent_email = null;
            state.agent_uuid = null;
            state.agent_username = null;
            state.agnet_userid = null,
            state.agent_role = null,
            state.isAuthenticated_agent = false;
        }
    }
});

export const { agent_login, agent_logout } = agentSlice.actions;
export default agentSlice.reducer;
