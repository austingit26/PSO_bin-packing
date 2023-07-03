import { configureStore } from "@reduxjs/toolkit";
import binSizeReducer from "./bin-size-slice";
import itemReducer from "./item-slice";
import loaderReducer from "./loader-slice";

const store = configureStore({
  reducer: {
    binsize: binSizeReducer,
    items: itemReducer,
    loader: loaderReducer,
  },
});

export default store;
