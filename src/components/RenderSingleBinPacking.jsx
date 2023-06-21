import React from "react";

export default function RenderSingleBinPacking({ bin }) {
  const c = 10; // enlarge all items 10px times

  return (
    <div className="flex flex-col justify-center items-center w-screen h-full p-5 text-white">
      <div className="flex justify-center items-center">
        <div
          className="bg-neutral-100 dark:bg-neutral-800 absolute rounded-b-xl z-10"
          style={{
            width: (bin.binWidth * c) / 2,
            height: (bin.binHeight * c) / 3,
          }}
        ></div>
        <div
          className="bg-neutral-900 rounded-t-lg"
          style={{ width: bin.binWidth * c, height: (bin.binHeight * c) / 3 }}
        ></div>
      </div>
      {/* BIN CONTAINER */}
      <div
        className="bg-neutral-900 flex-col-reverse rotate-180"
        style={{ width: bin.binWidth * c, height: bin.binHeight * c }}
      >
        {/* ITEMS ON BIN */}
        <div className="flex flex-row-reverse">
          {bin.items.map((item, index) => (
            <div
              className={`flex bg-neutral-500 dark:bg-violet-900 justify-center items-center border border-neutral-400 absolute`}
              key={index}
              style={{
                width: item.rotate ? item.height * c : item.width * c,
                height: item.rotate ? item.width * c : item.height * c,
                left: item.x * c,
                top: item.y * c,
              }}
            >
              <span
                className={`rotate-180 text-center flex items-center ${
                  item.rotate ? "flex-row-reverse" : "flex-col"
                } text-[12px]`}
              >
                <p className={item.rotate ? "rotate-90" : ""}>
                  {item.width} x {item.height}
                </p>
                <p className={item.rotate ? "rotate-90" : ""}>
                  {(item.height <= 5 || item.width <= 5) ? "":item.name}
                </p>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* bin details */}
      <div className="w-[200px] text-[14px] py-2 text-black">
        <p className="flex justify-between dark:text-neutral-200 italic">
          Number of Items:{" "}
          <span className="text-violet-900 dark:text-violet-500 font-semibold">
            {bin.items.length}
          </span>
        </p>
        <p className="flex justify-between dark:text-neutral-200 italic">
          Bin Density:{" "}
          <span className="text-violet-900 dark:text-violet-500 font-semibold">
            {bin.binDensity}
          </span>
        </p>
      </div>
    </div>
  );
}
