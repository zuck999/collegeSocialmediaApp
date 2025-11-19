import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import  postSlice  from "./postSlice.js";

//other from redux presist used bcoz when the page is reloded the data in the store
// will be deleted ... to solve  this issue we usw redix presist following code in doc... 
//5.57
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
