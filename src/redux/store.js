import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userSlice";

// **Fix: Changed `reducer={...}` to `reducer: {...}` (correct syntax for `configureStore`)**
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;