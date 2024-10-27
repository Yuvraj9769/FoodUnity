import { configureStore } from "@reduxjs/toolkit";
import adminSLiceReducers from "../features/adminFeatures";

const store = configureStore({
  reducer: adminSLiceReducers,
});

export default store;
