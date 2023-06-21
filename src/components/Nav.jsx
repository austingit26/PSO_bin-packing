import React from "react";
import Darkmode from "../utilities/Darkmode";
import { Link } from "react-router-dom";
export default function Nav() {
  return (
    <nav className="bg-neutral-100 dark:bg-neutral-800 dark:text-slate-100 drop-shadow px-8 w-full p-4 flex justify-between items-center max-w-[300px]:px-4">
      <Link to="/">
        <p className="font-bold max-[300px]:hidden">Logo</p>
      </Link>
      <div className="flex justify-between items-center gap-6 max-[300px]:w-full">
        <p className="text-sm">What is Bin Packing?</p>
        <Darkmode />
      </div>
    </nav>
  );
}
