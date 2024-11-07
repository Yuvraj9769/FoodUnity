import { configureStore } from "@reduxjs/toolkit";
import foodUnityReducers from "../features/foodUnity";

const store = configureStore({
  reducer: foodUnityReducers,
});

export default store;
