import { BsArrowRightShort } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { solveBinPacking } from "../utilities/pso-function";
import { setIsLoading } from "../store/loader-slice";
import { Loader } from "../components/Loader";

export default function DisplayItems({ listItems, removeItem }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { binWidth, binHeight } = useSelector((state) => state.binsize);
  const binSize = { binWidth, binHeight };
  const isLoading = useSelector((state) => state.loader.isLoading);

  const handleDoubleClick = (index) => {
    removeItem(index);
  };

  const handlePSOclick = () => {
    dispatch(setIsLoading(true));
    const arrangedItems = solveBinPacking(binSize, listItems);
    dispatch(setIsLoading(false));
    navigate("/resulting-bins", { state: arrangedItems });
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
    <div className="bg-neutral-900 w-[500px] mx-4 md:mx-0 h-[400px] rounded-lg shadow-md dark:shadow-md text-slate-100">
      <nav className="px-4 py-8 shadow-md rounded-t-xl h-2 flex justify-between items-center">
        <p className="text-white">
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
      {isLoading && <Loader />}
      <div
        className="scrollbar px-4 py-5 mt-2 flex flex-wrap gap-2 h-full overflow-y-scroll"
        style={{ maxHeight: "calc(100% - 5rem)" }}
      >
        {listItems.map((item, index) => (
          <div
            key={index}
            style={{ width: item.itemWidth * 3, height: item.itemHeight * 3 }}
            className="bg-violet-900 p-0.5 rounded-sm flex flex-col items-center justify-center text-xs relative"
            onDoubleClick={() => handleDoubleClick(index)}
          >
            <p className="text-white">
              {`${item.itemWidth} x ${item.itemHeight}`}
            </p>
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
