import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { indicateBinSize } from "../store/bin-size-slice";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function AddBinSize() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    binWidth: yup
      .number()
      .min(40, "Bin width should not be less than 40")
      .max(100, "Bin width should not be greater than 100")
      .typeError("Please enter a valid number for bin width")
      .required(),
    binHeight: yup
      .number()
      .min(40, "Bin height should not be less than 40")
      .max(100, "Bin height should not be greater than 100")
      .typeError("Please enter a valid number for bin height")
      .required(),
  });

  const storedBinSize = localStorage.getItem("binSize");
  const { width: storedWidth, height: storedHeight } =
    JSON.parse(storedBinSize);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      binWidth: storedWidth || null,
      binHeight: storedHeight || null,
    },
  });

  const binSizeFormSubmit = (data) => {
    const { binWidth, binHeight } = data;
    dispatch(indicateBinSize({ binWidth, binHeight }));
    localStorage.removeItem("ListItems");
    navigate("/add-item");
  };

  return (
    <div className="flex-grow flex justify-center items-center">
      <div className="xl:w-2/5 lg:w-3/5 md:w-3/5 sm:w-4/5 w-5/5 h-5/6 border dark:border-neutral-900 rounded-2xl shadow-neutral-900 shadow-md p-5 flex flex-col justify-center">
        <form
          className="flex flex-col justify-center gap-6 w-full items-center h-4/5"
          onSubmit={handleSubmit(binSizeFormSubmit)}
          noValidate
        >
          <p className="text-center font-bold tracking-wide max-[350px]:text-[14px]">
            Indicate Bin size
          </p>
          <div className="flex flex-col items-center justify-center w-max gap-y-5 max-[350px]:w-full">
            <div className="flex items-center justify-center w-full gap-x-2 max-[350px]:flex-col max-[350px]:items-start">
              <label
                htmlFor="binWidth"
                className="w-max text-end max-[350px]:text-[14px]"
              >
                Width (cm)
              </label>
              <input
                type="number"
                {...register("binWidth")}
                className="bg-transparent p-3 border-neutral-500 border outline-none w-max max-[350px]:w-full"
              />
            </div>
            <p className="text-red-500 text-xs tracking-wide font-thin text-end -mt-4 h-0 w-full max-[350px]:text-[11px]">
              {errors.binWidth?.message}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center w-max max-[350px]:w-full gap-y-5">
            <div className="flex items-center justify-center w-full gap-x-2 max-[350px]:flex-col max-[350px]:items-start">
              <label
                htmlFor="binHeight"
                className="w-max text-end max-[350px]:text-[14px]"
              >
                Height (cm)
              </label>
              <input
                type="number"
                {...register("binHeight")}
                className="bg-transparent p-3 border-neutral-500 border outline-none w-max max-[350px]:w-full"
              />
            </div>
            <p className="text-red-500 text-xs tracking-wide font-thin text-end w-full -mt-4 h-0 max-[350px]:text-[11px]">
              {errors.binHeight?.message}
            </p>
          </div>
          <button
            type="submit"
            className="bg-violet-900 w-32 h-10 flex justify-center items-center font-bold tracking-widest text-sm text-white max-[350px]:p-5"
          >
            Confirm
          </button>
        </form>
        <p className="text-center text-xs sm:text-xs mt-5 tracking-wide text-neutral-600 dark:text-neutral-400">
          Bin size should be within 40cm - 100cm for visualization purposes
        </p>
      </div>
    </div>
  );
}
