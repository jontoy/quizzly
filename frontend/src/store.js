import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import thunk from "redux-thunk";
import root from "./reducers/root";
import { createStore, applyMiddleware } from "redux";

// Config for redux-persist. Changes to the store while persisting
// will be merged 2 levels deep with existing store values.
const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

// Enhances root reducer with persist functionality
const persistedReducer = persistReducer(persistConfig, root);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const persistedStore = persistStore(store);
