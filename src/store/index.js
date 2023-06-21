import { configureStore } from "@reduxjs/toolkit";
import binSizeReducer from "./bin-size-slice";
import itemReducer from "./item-slice";

const store = configureStore({
  reducer: {
    binsize: binSizeReducer,
    items: itemReducer,
  },
});

export default store;
