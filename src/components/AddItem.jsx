import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../store/item-slice";
import DisplayItems from "./DisplayItems";
import FormAddItem from "./FormAddItem";
import Loader from "./Loader";

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

  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    <>
      <div className="flex mt-16 lg:mt-0 flex-wrap-reverse md:flex-nowrap justify-center items-center w-full h-5/6 mx-10 gap-5">
        {isLoading && <Loader />}
        <FormAddItem
          addItem={addItemHandler}
          binWidth={binWidth}
          binHeight={binHeight}
        />
        <DisplayItems listItems={listItems} removeItem={removeItemHandler} />
      </div>
    </>
  );
}
