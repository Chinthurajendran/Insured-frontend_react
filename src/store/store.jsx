import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"
import { persistStore } from "redux-persist";

// const store = configureStore({
//   reducer: rootReducer,
// })

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check
      }),
  });

// Create Persistor
export const persistor = persistStore(store);

export default store
