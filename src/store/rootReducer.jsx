// import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux";
import  userSlice  from "./slices/userAuthentication"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import adminSlice from "./slices/adminAuthentication";
import agentslice  from "./slices/agentAuthentication";


// Redux Persist Config
const persistConfig = {
    key: "root",
    storage,
};

// Combine Reducers
const rootReducer = combineReducers({
    userAuth: userSlice, // Your Authentication Reducer
    adminAuth: adminSlice,
    agentAuth:agentslice,
});

// Wrap Reducer with Redux Persist
export default persistReducer(persistConfig, rootReducer);