import React from "react";
import { Dna } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="z-10 absolute w-full h-full top-0 flex justify-center items-center bg-neutral-900 opacity-95">
      <Dna
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
}
