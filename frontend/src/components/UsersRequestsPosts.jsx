import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";
import { useSelector, useDispatch } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { getUserRequestsPosts } from "../api/foodApi";
import { toast } from "react-hot-toast";
import calculateTimeDifferenceString from "../utils/calculateTimeDifferenceString";
import getClockTime from "../utils/getClockTime";
import { LuFileClock } from "react-icons/lu";
import { FcAlarmClock } from "react-icons/fc";
import { setUserRequestPostsData } from "../features/foodUnity";

const UsersRequestsPosts = () => {
  const userRequestPostsData = useSelector(
    (state) => state.userRequestPostsData
  );

  const searchedData = useSelector((state) => state.searchedData);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = secureLocalStorage.getItem("recipient");

    if (userRequestPostsData.length === 0 && user) {
      (async () => {
        try {
          const data = await getUserRequestsPosts(user);
          if (data.statusCode === 200 && data.success) {
            dispatch(setUserRequestPostsData(data.data));
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [userRequestPostsData]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : searchedData.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
          {searchedData.map(({ foodId }, ind) => (
            <div
              className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800"
              key={ind}
            >
              <img
                src={foodId.foodImage}
                alt="Food Image"
                className="w-full h-48 object-cover object-center"
              />
              <div className="px-6 py-4 h-[220px] flex flex-col items-start justify-between">
                <div className="font-bold text-xl mb-2 text-black dark:text-slate-50">
                  {foodId.foodTitle}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll h-[92px] scroller-display-none">
                  {foodId.description}
                </p>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-black dark:text-slate-50">
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
      ) : userRequestPostsData.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
          {userRequestPostsData.map((food, ind) => (
            <div
              className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800"
              key={ind}
            >
              <img
                src={food.foodImage}
                alt="Food Image"
                className="w-full h-48 object-cover object-center"
              />
              <div className="px-6 py-4 h-[220px] flex flex-col items-start justify-between">
                <div className="font-bold text-xl mb-2 text-black dark:text-slate-50">
                  {food.foodTitle}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll h-[92px] scroller-display-none">
                  {food.description}
                </p>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-black dark:text-slate-50">
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
              </div>
              <div className="px-6 pt-4 pb-2 flex justify-between items-center w-full">
                <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  #
                  {food.foodType.charAt(0).toUpperCase() +
                    food.foodType.slice(1)}
                </span>
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                    userRequestPostsData[ind]?.status === "requested" ||
                    userRequestPostsData[ind]?.status === "approved" ||
                    userRequestPostsData[ind]?.status === "OTP Expired"
                      ? "opacity-70 pointer-events-none"
                      : ""
                  }`}
                >
                  {userRequestPostsData[ind]?.status}
                </button>
              </div>
            </div>
          ))}
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

export default UsersRequestsPosts;
