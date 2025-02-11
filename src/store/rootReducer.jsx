import { combineReducers } from "redux";
import  userSlice  from "./slices/userAuthentication"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminSlice from "./slices/adminAuthentication";
import agentslice  from "./slices/agentAuthentication";


const persistConfig = {
    key: "root",
    storage,
};


const rootReducer = combineReducers({
    userAuth: userSlice,
    adminAuth: adminSlice,
    agentAuth:agentslice,
});

export default persistReducer(persistConfig, rootReducer);