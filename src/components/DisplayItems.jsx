import { BsArrowRightShort } from "react-icons/bs";
// import { solveBinPacking } from "../utilities/pso-function";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DisplayItems({ listItems, removeItem }) {
  const navigate = useNavigate();
  const { binWidth, binHeight } = useSelector((state) => state.binsize);
  const binSize = { binWidth, binHeight };

  const handleDoubleClick = (index) => {
    removeItem(index);
  };

  const handlePSOclick = () => {
    // const arrangedItems = solveBinPacking(binSize, listItems);
    // console.log(arrangedItems);
    const arrangedItems = [
      {
        binWidth: 50,
        binHeight: 50,
        items: [
          {
            name: "rice",
            width: 25,
            height: 25,
            x: 0,
            y: 0,
            rotate: false,
          },
          {
            name: "sugar",
            width: 20,
            height: 2,
            x: 25,
            y: 0,
            rotate: false,
          },
          {
            name: "drinks",
            width: 25,
            height: 5,
            x: 45,
            y: 0,
            rotate: true,
          },
        ],
        binDensity: 0.316, //(25*25)+(20*2)+(25*5) / (50*50)
      },
      {
        binWidth: 50,
        binHeight: 50,
        items: [
          {
            name: "battery",
            width: 15,
            height: 25,
            x: 0,
            y: 0,
            rotate: false,
          },
          {
            name: "bread",
            width: 20,
            height: 10,
            x: 15,
            y: 0,
            rotate: false,
          },
          {
            name: "soap",
            width: 25,
            height: 15,
            x: 35,
            y: 0,
            rotate: true,
          },
          {
            name: "milk",
            width: 15,
            height: 20,
            x: 15,
            y: 10,
            rotate: true,
          },
        ],
        binDensity: 0.5, //(15*25)+(10*20)+(25*15)+(15*20) / (50*50)
      },
      {
        binWidth: 50,
        binHeight: 50,
        items: [
          {
            name: "battery",
            width: 26,
            height: 13,
            x: 1,
            y: 37,
            rotate: false,
          },
          {
            name: "battery",
            width: 8,
            height: 22,
            x: 27,
            y: 0,
            rotate: false,
          },
          {
            name: "battery",
            width: 23,
            height: 28,
            x: 27,
            y: 22,
            rotate: false,
          },
          {
            name: "battery",
            width: 15,
            height: 14,
            x: 35,
            y: 8,
            rotate: false,
          },
          {
            name: "battery",
            width: 15,
            height: 8,
            x: 35,
            y: 0,
            rotate: false,
          },
          {
            name: "battery",
            width: 27,
            height: 37,
            x: 0,
            y: 0,
            rotate: false,
          },
        ],
        binDensity: 0.5, //(15*25)+(10*20)+(25*15)+(15*20) / (50*50)
      },
    ];

    navigate("/resulting-bins", { state: arrangedItems });
    /*     console.log("total bins:", result.length);
    console.log(JSON.stringify(result, null, 2)); */
  };

  /*  When we empty the listItems, it leaves the localstorage with [[]].
      We have to delete ListItems on localstorage when length is 0 so that
      we avoid getting NaN values for width and height when re-rendering listItems.
      
      try this on your own
      1. comment out the code below
      2. add item/s then empty it 
      3. refresh, check console and localstorage.
  */
  listItems.length === 0 && localStorage.removeItem("ListItems");

  return (
    <div className="bg-neutral-900 w-[500px] h-[400px] rounded-t-2xl shadow-neutral-950 shadow-sm dark:shadow-md text-slate-100">
      <nav
        className="px-4 py-8 rounded-t-xl h-2 flex justify-between items-center"
        style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25)" }}
      >
        <p>
          <span className="font-bold">{listItems.length}</span> ITEMS
        </p>
        <button
          className="bg-violet-900 text-slate-100 w-28 h-10 rounded-lg flex gap-1 justify-center items-center disabled:opacity-50"
          disabled={listItems.length === 0}
          onClick={handlePSOclick}
        >
          Next
          <BsArrowRightShort size={25} />
        </button>
      </nav>
      {/* ITEM CONTAINER */}
      <div
        className="p-2 mt-2 flex flex-wrap gap-2 overflow-y-scroll"
        style={{ maxHeight: "calc(100% - 5rem)" }}
      >
        {listItems.map((item, index) => (
          <div
            key={index}
            style={{ width: item.itemWidth * 3, height: item.itemHeight * 3 }}
            className="bg-neutral-500 flex flex-col items-center justify-center text-xs relative"
            onDoubleClick={() => handleDoubleClick(index)}
          >
            <p>{`${item.itemWidth} x ${item.itemHeight}`}</p>
            <p
              className={
                item.itemHeight <= 10 || item.itemWidth <= 10 ? "truncate" : ""
              }
            >
              {item.itemName}
            </p>
            {/* Display remove item when hovered */}
            <div className="absolute inset-0 text-center flex items-center justify-center bg-black bg-opacity-50 text-white text-xs opacity-0 hover:opacity-100 transition-opacity hover:bg-violet-900 duration-300">
              Double click to remove
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
