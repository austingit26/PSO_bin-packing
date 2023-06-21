import { createSlice } from "@reduxjs/toolkit";

const storedBinSize = localStorage.getItem("binSize");
const initialState = storedBinSize
  ? JSON.parse(storedBinSize)
  : { binWidth: 40, binHeight: 40 };

const binsizeSlice = createSlice({
  name: "binsize",
  initialState,
  reducers: {
    indicateBinSize(state, action) {
      const { binWidth, binHeight } = action.payload;
      state.binWidth = binWidth;
      state.binHeight = binHeight;
      localStorage.setItem("binSize", JSON.stringify({ binWidth, binHeight }));
    },
  },
});

export const { indicateBinSize } = binsizeSlice.actions;
export default binsizeSlice.reducer;
