import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FormAddItem from "./FormAddItem";
import DisplayItems from "./DisplayItems";
import { addItem, removeItem } from "../store/item-slice";
import ResultingBins from "./ResultingBins";

export default function AddItem() {
  const { binWidth, binHeight } = useSelector((state) => state.binsize);
  const listItems = useSelector((state) => state.items);
  const dispatch = useDispatch();
  const addItemHandler = (item) => {
    dispatch(addItem(item));
  };
  const removeItemHandler = (index) => {
    dispatch(removeItem(index));
  };

  return (
    <div className="flex justify-center items-center w-full h-5/6 mx-10 gap-5">
      <FormAddItem
        addItem={addItemHandler}
        binWidth={binWidth}
        binHeight={binHeight}
      />
      <DisplayItems listItems={listItems} removeItem={removeItemHandler} />
    </div>
  );
}
