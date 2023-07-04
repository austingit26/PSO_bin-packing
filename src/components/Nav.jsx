import React from "react";
import { Link } from "react-router-dom";
import Darkmode from "./Darkmode";
import { GrDropbox } from "react-icons/gr";
export default function Nav() {
  return (
    <nav className="lg:px-32 bg-white shadow dark:shadow-none dark:bg-neutral-800 text-gray-900 dark:text-white px-3 w-full p-4 flex justify-between items-center max-w-[300px]:px-4">
      <Link to="/">
        <div className="flex justify-between items-center gap-2">
          <GrDropbox size={24} color={"#6d28d9"} />
          <p className="font-medium max-[300px]:hidden tracking-tighter">
            OptiBin
          </p>
        </div>
      </Link>
      <div className="flex justify-between items-center gap-6 max-[300px]:w-full">
        <Link to="/about-OB">
          <p className="text-sm cursor-pointer">What is OptiBin?</p>
        </Link>
        <Darkmode />
      </div>
    </nav>
  );
}
