import React from "react";
import { useLocation } from "react-router-dom";
import RenderSingleBinPacking from "./RenderSingleBinPacking";

export default function ResultingBins() {
  const location = useLocation();
  const arrangedItems = location.state;

  return (
    <div className="flex flex-col">
      <p className="text-xl p-4 w-full text-center text-[40px]">
        You have used{" "}
        <span className="font-bold text-violet-500">
          {arrangedItems.length}
        </span>{" "}
        bin
        <span>{arrangedItems.length > 1 ? "s" : ""}</span>
      </p>
      {arrangedItems.map((bin, index) => (
        <RenderSingleBinPacking key={index} bin={bin} />
      ))}
    </div>
  );
}
