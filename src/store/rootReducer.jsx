import { combineReducers } from "redux";
import  userSlice  from "./slices/userAuthentication"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminSlice from "./slices/adminAuthentication";
import agentslice  from "./slices/agentAuthentication";
import tokenSlice  from "./slices/UserToken";
import AdmintokenSlice  from "./slices/AdminToken";
import agenttokenSlice  from "./slices/AgentToken";


const persistConfig = {
    key: "root",
    storage,
};


const rootReducer = combineReducers({
    userAuth: userSlice,
    adminAuth: adminSlice,
    agentAuth:agentslice,
    userToken: tokenSlice,
    adminToken: AdmintokenSlice,
    agentToken: agenttokenSlice,
});

export default persistReducer(persistConfig, rootReducer);