import React from "react";
import { Link } from "react-router-dom";
import Darkmode from "../utilities/Darkmode";
export default function Nav() {
  return (
    <nav className="lg:px-32 bg-white shadow dark:shadow-none dark:bg-neutral-800 text-gray-900 dark:text-white px-3 w-full p-4 flex justify-between items-center max-w-[300px]:px-4">
      <Link to="/">
        <p className="font-medium max-[300px]:hidden tracking-tighter">Bin Packing - PSO</p>
      </Link>
      <div className="flex justify-between items-center gap-6 max-[300px]:w-full">
        <p className="text-sm">What is Bin Packing?</p>
        <Darkmode />
      </div>
    </nav>
  );
}
