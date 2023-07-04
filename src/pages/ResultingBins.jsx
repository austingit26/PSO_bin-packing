import React from "react";
import { AiOutlineReload } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import RenderSingleBinPacking from "../components/RenderSingleBinPacking";

export default function ResultingBins() {
  const location = useLocation();
  const arrangedItems = location.state;
  const navigate = useNavigate();
  const binSize = localStorage.getItem("binSize");

  const handleRetry = () => {
    //reset all items and bin sizes on local storage
    localStorage.removeItem("binSize");
    localStorage.removeItem("ListItems");
    navigate("/");
  };

  return (
    <div className="flex flex-col mt-8">
      <p className="text-xl p-4 w-full text-center text-[40px]">
        You have used{" "}
        <span className="font-bold text-violet-500">
          {arrangedItems.length}
        </span>{" "}
        bin
        <span>{arrangedItems.length > 1 ? "s" : ""}</span>
      </p>

      <div
        className={`grid grid-cols-1 ${
          binSize.binWidth < 40 && arrangedItems.length >= 3
            ? "lg:grid-cols-3"
            : binSize.binWidth < 40 && arrangedItems.length === 2
            ? "md:grid-cols-2"
            : ""
        } gap-4 items-center `}
      >
        {arrangedItems.map((bin, index) => (
          <RenderSingleBinPacking key={index} bin={bin} />
        ))}
      </div>
      <div className="flex justify-center items-center">
        <button
          className="text-white bg-neutral-900 dark:bg-yellow-600 tracking-widest w-32 h-10 mb-10 flex gap-2 justify-center items-center"
          onClick={handleRetry}
        >
          <AiOutlineReload size={20} />
          Retry
        </button>
      </div>
    </div>
  );
}
