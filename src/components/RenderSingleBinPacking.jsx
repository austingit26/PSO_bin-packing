import React, { useEffect, useState } from "react";

export default function RenderSingleBinPacking({ bin }) {
  const [fontSize, setFontSize] = useState(() => {
    if (window.innerWidth >= 1024) {
      return 10;
    } else if (window.innerWidth >= 768) {
      return 8;
    } else {
      return 6;
    }
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        // Large screen size and above
        setFontSize(10);
      } else if (window.innerWidth >= 768) {
        // Medium screen size
        setFontSize(8);
      } else {
        // Small screen size
        setFontSize(6);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full p-5 text-white">
      <div className="flex justify-center items-center">
        <div
          className="bg-neutral-100 dark:bg-neutral-800 absolute rounded-b-xl z-10"
          style={{
            width: (bin.binWidth * fontSize) / 2,
            height: (bin.binHeight * fontSize) / 3,
          }}
        ></div>
        <div
          className="bg-neutral-900 rounded-t-lg"
          style={{
            width: bin.binWidth * fontSize,
            height: (bin.binHeight * fontSize) / 3,
          }}
        ></div>
      </div>

      {/* BIN CONTAINER */}
      <div
        className="bg-neutral-900 flex-col-reverse rotate-180"
        style={{
          width: bin.binWidth * fontSize,
          height: bin.binHeight * fontSize,
        }}
      >
        {/* ITEMS ON BIN */}
        <div className="flex flex-row-reverse">
          {bin.items.map((item, index) => (
            <div
              className={`flex bg-violet-900 justify-center items-center border-y-2 border-x rounded-sm border-neutral-900 absolute`}
              key={index}
              style={{
                width: item.width * fontSize,
                height: item.height * fontSize,
                left: item.x * fontSize,
                top: item.y * fontSize,
              }}
            >
              <span
                className={`rotate-180 text-center flex items-center ${
                  item.rotate ? "flex-row-reverse" : "flex-col"
                } text-${fontSize}px`}
              >
                <p className={item.rotate ? "rotate-90" : ""}>
                  {item.width} x {item.height}
                </p>
                <p className={item.rotate ? "rotate-90" : ""}>
                  {item.height <= 5 || item.width <= 5 ? "" : item.name}
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
