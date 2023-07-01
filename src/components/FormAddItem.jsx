import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function FormAddItem({ addItem, binWidth, binHeight }) {
  const schema = yup.object().shape({
    itemName: yup
      .string()
      .max(10, "Item name should not be longer than 10 characters"),
    itemWidth: yup
      .number()
      .min(1, "Item width should not be less than 1 cm")
      .max(binWidth, `Item width should not exceed bin size of ${binWidth}`)
      .typeError("Please enter a valid number for item width")
      .required(),
    itemHeight: yup
      .number()
      .min(1, "Item height should not be less than 1 cm")
      .max(binHeight, `Item height should not exceed bin size of ${binHeight}`)
      .typeError("Please enter a valid number for item height")
      .required(),
  });

  const addItemSubmit = (data) => {
    const newItem = {
      itemName: data.itemName,
      itemWidth: data.itemWidth,
      itemHeight: data.itemHeight,
    };
    addItem(newItem);
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  return (
    <div className="pt-2 pb-16 md:pt-0 md:pb-0">
      <form
        className="flex flex-col gap-5 justify-around items-center"
        onSubmit={handleSubmit(addItemSubmit)}
        noValidate
      >
        <div className="flex flex-col items-center justify-center w-full gap-y-5">
          <div className="flex items-center justify-end w-full">
            <label htmlFor="itemName" className="w-max mr-5">
              Name (optional):
            </label>
            <input
              type="text"
              {...register("itemName")}
              className="bg-transparent rounded-lg p-2 border-neutral-500 border outline-none w-max"
            />
          </div>
          <p className="text-red-500 text-xs tracking-wide self-end -mt-4 h-0">
            {errors.itemName?.message}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-y-5">
          <div className="flex items-center justify-end w-full">
            <label htmlFor="itemWidth" className="w-max mr-5">
              Width (cm):
            </label>
            <input
              type="text"
              {...register("itemWidth")}
              className="bg-transparent p-2 rounded-lg border-neutral-500 border outline-none w-max"
            />
          </div>
          <p className="text-red-500 text-xs tracking-wide self-end -mt-4 h-0">
            {errors.itemWidth?.message}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-y-5">
          <div className="flex items-center justify-end w-full">
            <label htmlFor="itemHeight" className="w-max mr-5">
              Height (cm):
            </label>
            <input
              type="text"
              {...register("itemHeight")}
              className="bg-transparent p-2 rounded-lg border-neutral-500 border outline-none w-max"
            />
          </div>
          <p className="text-red-500 text-xs tracking-wide self-end -mt-4 h-0">
            {errors.itemHeight?.message}
          </p>
        </div>
        <div className="flex justify-end w-full">
          <button
            type="submit"
            className="px-10 mt-2 py-2 bg-neutral-900 w-full md:w-auto hover:bg-neutral-950 transition rounded-lg text-white font-bold tracking-wide"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}
