import { useDispatch, useSelector } from "react-redux";
import { LuFileClock } from "react-icons/lu";
import PageLoader from "./PageLoader";
import { FcAlarmClock } from "react-icons/fc";
import { useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { getUserPostHistory } from "../api/foodApi";
import { toast } from "react-hot-toast";
import { setUserHistoryPosts } from "../features/foodUnity";
import calculateTimeDifferenceString from "../utils/calculateTimeDifferenceString";
import getClockTime from "../utils/getClockTime";
import { MdDeliveryDining, MdLocationOn } from "react-icons/md";
import searchContext from "../store/searchContext";

const UserPostHistory = () => {
  const userHistoryPosts = useSelector((state) => state.userHistoryPosts);
  const searchedData = useSelector((state) => state.searchedData);

  const { searchData, handleOnChange, checkKey } = useContext(searchContext);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = secureLocalStorage.getItem("recipient");

    if (userHistoryPosts.length === 0 && user) {
      (async () => {
        try {
          const res = await getUserPostHistory();
          dispatch(setUserHistoryPosts(res));
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [userHistoryPosts]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : searchedData.length != 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="lg:hidden w-full flex items-center justify-center p-4 lg:py-6 gap-5 flex-wrap lg:flex-nowrap">
            <div className="gap-3 w-full inline-flex items-center justify-center text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search"
                className="p-2 rounded-md border-none outline-none w-full sm:w-[85%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
            {searchedData.map(({ foodId }, ind) => (
              <div
                className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800 sm:min-w-[313px]"
                key={ind}
              >
                <img
                  src={foodId.foodImage}
                  alt="Food Image"
                  className="w-full h-48 object-cover object-center"
                />
                <div className="px-6 py-4 h-[310px] flex flex-col items-start justify-between">
                  <div className="font-bold text-xl mb-2 text-black dark:text-slate-50 text-nowrap overflow-hidden text-ellipsis w-full">
                    {foodId.foodTitle}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll max-h-[92px] scroller-display-none">
                    {foodId.description}
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-black dark:text-slate-50 w-[57%] overflow-hidden text-nowrap text-ellipsis">
                      Posted By: {foodId.contactName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                      {calculateTimeDifferenceString(foodId.createdAt)?.split(
                        "hrs"
                      )[0] > 55
                        ? "A few days old"
                        : calculateTimeDifferenceString(foodId.createdAt) === 0
                        ? "Just now"
                        : calculateTimeDifferenceString(foodId.createdAt)}
                      <LuFileClock />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Expires in:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2">
                      {getClockTime(foodId.expiryTime)}
                      <FcAlarmClock className="text-xl" />
                    </span>
                  </div>

                  <div className="mt-2 inline-flex items-center gap-2 w-full">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 max-w-[80%]">
                      <p className="max-w-[80%] text-nowrap overflow-hidden text-ellipsis">
                        {foodId.pickupLocation}
                      </p>
                      <MdLocationOn className="text-[22px] text-red-600" />
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Delivery Options:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                      {foodId.pickupOptions}
                      <MdDeliveryDining className="text-[22px] text-blue-700" />
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-2 flex justify-between items-center w-full">
                  <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #
                    {foodId.foodType.charAt(0).toUpperCase() +
                      foodId.foodType.slice(1)}
                  </span>
                  <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                      searchedData[ind]?.status === "requested" ||
                      searchedData[ind]?.status === "approved" ||
                      searchedData[ind]?.status === "OTP Expired"
                        ? "opacity-70 pointer-events-none"
                        : ""
                    }`}
                  >
                    {searchedData[ind]?.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : userHistoryPosts.length !== 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="lg:hidden w-full flex items-center justify-center p-4 lg:py-6 gap-5 flex-wrap lg:flex-nowrap">
            <div className="gap-3 w-full inline-flex items-center justify-center text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search"
                className="p-2 rounded-md border-none outline-none w-full sm:w-[85%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
            {userHistoryPosts.map((food, ind) => (
              <div
                className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800 sm:min-w-[313px]"
                key={ind}
              >
                <img
                  src={food.foodImage}
                  alt="Food Image"
                  className="w-full h-48 object-cover object-center"
                />
                <div className="px-6 py-4 h-[310px] flex flex-col items-start justify-between">
                  <div className="font-bold text-xl mb-2 text-black dark:text-slate-50 text-nowrap overflow-hidden text-ellipsis w-full">
                    {food.foodTitle}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll max-h-[92px] scroller-display-none">
                    {food.description}
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-black dark:text-slate-50 w-[57%] overflow-hidden text-nowrap text-ellipsis">
                      Posted By: {food.contactName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                      {calculateTimeDifferenceString(food.createdAt)?.split(
                        "hrs"
                      )[0] > 55
                        ? "A few days old"
                        : calculateTimeDifferenceString(food.createdAt) === 0
                        ? "Just now"
                        : calculateTimeDifferenceString(food.createdAt)}
                      <LuFileClock />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Expires in:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2">
                      {getClockTime(food.expiryTime)}
                      <FcAlarmClock className="text-xl" />
                    </span>
                  </div>

                  <div className="mt-2 inline-flex items-center gap-2 w-full">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 max-w-[80%]">
                      <p className="max-w-[80%] text-nowrap overflow-hidden text-ellipsis">
                        {food.pickupLocation}
                      </p>
                      <MdLocationOn className="text-[22px] text-red-600" />
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Delivery Options:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                      {food.pickupOptions}
                      <MdDeliveryDining className="text-[22px] text-blue-700" />
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-2 flex justify-between items-center w-full">
                  <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #
                    {food.foodType.charAt(0).toUpperCase() +
                      food.foodType.slice(1)}
                  </span>
                  <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                      userHistoryPosts[ind]?.status === "requested" ||
                      userHistoryPosts[ind]?.status === "approved" ||
                      userHistoryPosts[ind]?.status === "OTP Expired" ||
                      userHistoryPosts[ind]?.status === "rejected"
                        ? "opacity-70 pointer-events-none"
                        : ""
                    }`}
                  >
                    {userHistoryPosts[ind]?.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 items-center h-screen dark:text-slate-50 text-black">
          <p className="text-2xl md:text-4xl text-center">
            Sorry, there are no posts available at the moment.
          </p>
        </div>
      )}
    </>
  );
};

export default UserPostHistory;
