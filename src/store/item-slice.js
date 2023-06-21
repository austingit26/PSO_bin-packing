import { createSlice } from "@reduxjs/toolkit";

const storedItems = localStorage.getItem("ListItems");
const initialState = storedItems
  ? JSON.parse(storedItems)
  : [];

  const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem(state, action) {
      state.push(action.payload);
      localStorage.setItem("ListItems", JSON.stringify(state));
    },
    removeItem(state, action) {
      state.splice(action.payload, 1);
      localStorage.setItem("ListItems", JSON.stringify([state]));
    },
  },
});

export const { addItem, removeItem } = itemSlice.actions;
export default itemSlice.reducer;
