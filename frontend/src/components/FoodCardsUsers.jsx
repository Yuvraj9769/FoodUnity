import { useContext, useEffect, useState } from "react";
import {
  getAllPostsForUser,
  getFifteenKMPosts,
  getUserPostHistory,
  sendOrderReuest,
} from "../api/foodApi";
import { useDispatch, useSelector } from "react-redux";
import { setPostData, setUserHistoryPosts } from "../features/foodUnity";
import { toast } from "react-hot-toast";
import { LuFileClock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import secureLocalStorage from "react-secure-storage";
import { FcAlarmClock } from "react-icons/fc";
import calculateTimeDifferenceString from "../utils/calculateTimeDifferenceString";
import getClockTime from "../utils/getClockTime";
import { MdLocationOn } from "react-icons/md";
import { MdDeliveryDining } from "react-icons/md";
import searchContext from "../store/searchContext";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";

const FoodCardsUsers = () => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postData);
  const searchedData = useSelector((state) => state.searchedData);

  const {
    searchData,
    handleOnChange,
    checkKey,
    setSearchData,
    checkandSetFilter,
  } = useContext(searchContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [filtedPosts, setFilteredPosts] = useState([]);

  const sendReuest = async (id) => {
    try {
      setLoading(true);
      const res = await sendOrderReuest(id);
      toast.success(res.data.message);
      const data = await getAllPostsForUser();
      dispatch(setPostData(data));
      const historyData = await getUserPostHistory();
      dispatch(setUserHistoryPosts(historyData));
    } catch (error) {
      toast.error(error.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const getFilterdData = async () => {
    try {
      if (filtedPosts.length !== 0) {
        setFilteredPosts([]);
        checkandSetFilter(false);
        return;
      }

      checkandSetFilter(true);

      const res = await getFifteenKMPosts();
      setSearchData({
        searchQuery: "",
      });
      setFilteredPosts(res.data);
    } catch (error) {
      toast.error(error.message);
      setFilteredPosts([]);
      checkandSetFilter(false);
    }
  };

  useEffect(() => {
    const user = secureLocalStorage.getItem("recipient");
    setTimeout(() => {
      if (user && postData.length == 0) {
        (async () => {
          try {
            const data = await getAllPostsForUser();
            dispatch(setPostData(data));
          } catch (error) {
            toast.error(error.message);
            navigate("/");
          } finally {
            setLoading(false);
          }
        })();
      } else {
        setLoading(false);
      }
    }, 200);
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : filtedPosts.length !== 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-full flex items-center justify-center p-4 lg:py-6 gap-5 flex-wrap sm:flex-nowrap">
            <div className="w-full inline-flex items-center lg:hidden sm:justify-start justify-center text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search"
                className="p-2 rounded-md border-none outline-none sm:w-[85%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 w-full dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>

            <button
              onClick={getFilterdData}
              className="bg-white text-red-400 lg:ml-auto font-semibold py-2 px-4 rounded-lg transition hover:bg-slate-100 duration-300 text-sm lg:text-base inline-flex items-center justify-between gap-2 border border-gray-300 dark:border-transparent"
            >
              Filter Posts Within 15KM
              <span
                className={`text-lg ${
                  filtedPosts.length === 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {filtedPosts.length === 0 ? (
                  <IoMdAddCircle />
                ) : (
                  <IoIosRemoveCircle />
                )}
              </span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
            {filtedPosts.map((food, ind) => (
              <div
                className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800"
                key={ind}
              >
                <img
                  src={food.food.foodImage}
                  alt="Food Image"
                  className="w-full h-48 object-cover object-center"
                />
                <div className="px-6 py-4 h-[260px] flex flex-col items-start justify-between">
                  <div className="font-bold text-xl mb-2 text-black dark:text-slate-50">
                    {food.food.foodTitle}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll h-[92px] scroller-display-none">
                    {food.food.description}
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-black dark:text-slate-50">
                      Posted By: {food.food.contactName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                      {calculateTimeDifferenceString(
                        food.food.createdAt
                      )?.split("hrs")[0] > 55
                        ? "A few days old"
                        : calculateTimeDifferenceString(food.food.createdAt) ===
                          0
                        ? "Just now"
                        : calculateTimeDifferenceString(food.food.createdAt)}
                      <LuFileClock />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Expires in:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2">
                      {getClockTime(food.food.expiryTime)}
                      <FcAlarmClock className="text-xl" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 ">
                      {food.food.pickupLocation}
                      <MdLocationOn className="text-[22px] text-red-600" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Delivery Options:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                      {food.food.pickupOptions}
                      <MdDeliveryDining className="text-[22px] text-blue-700" />
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-2 pb-2 flex justify-between items-center w-full">
                  <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #
                    {food.food.foodType.charAt(0).toUpperCase() +
                      food.food.foodType.slice(1)}
                  </span>
                  <button
                    onClick={() => sendReuest(food.food._id)}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                      filtedPosts[ind]?.requestStatus === "requested" ||
                      filtedPosts[ind]?.requestStatus === "approved"
                        ? "opacity-70 pointer-events-none"
                        : ""
                    }`}
                  >
                    {filtedPosts[ind]?.requestStatus || "request"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : searchedData.length !== 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-full flex items-center justify-center p-4 lg:py-6 gap-5 flex-wrap sm:flex-nowrap">
            <div className="w-full inline-flex items-center lg:hidden sm:justify-start justify-center text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search"
                className="p-2 rounded-md border-none outline-none sm:w-[85%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 w-full dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
            {searchedData.map((food, ind) => (
              <div
                className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800 min-w-[313px]"
                key={ind}
              >
                <img
                  src={food.food.foodImage}
                  alt="Food Image"
                  className="w-full h-48 object-cover object-center"
                />
                <div className="px-6 py-4 h-[260px] flex flex-col items-start justify-between">
                  <div className="font-bold text-xl mb-2 text-black dark:text-slate-50">
                    {food.food.foodTitle}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll h-[92px] scroller-display-none">
                    {food.food.description}
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-black dark:text-slate-50">
                      Posted By: {food.food.contactName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                      {calculateTimeDifferenceString(
                        food.food.createdAt
                      )?.split("hrs")[0] > 55
                        ? "A few days old"
                        : calculateTimeDifferenceString(food.food.createdAt) ===
                          0
                        ? "Just now"
                        : calculateTimeDifferenceString(food.food.createdAt)}
                      <LuFileClock />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Expires in:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2">
                      {getClockTime(food.food.expiryTime)}
                      <FcAlarmClock className="text-xl" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 ">
                      {food.food.pickupLocation}
                      <MdLocationOn className="text-[22px] text-red-600" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Delivery Options:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                      {food.food.pickupOptions}
                      <MdDeliveryDining className="text-[22px] text-blue-700" />
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-2 pb-2 flex justify-between items-center w-full">
                  <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #
                    {food.food.foodType.charAt(0).toUpperCase() +
                      food.food.foodType.slice(1)}
                  </span>
                  <button
                    onClick={() => sendReuest(food.food._id)}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                      searchedData[ind]?.requestStatus === "requested" ||
                      searchedData[ind]?.requestStatus === "approved"
                        ? "opacity-70 pointer-events-none"
                        : ""
                    }`}
                  >
                    {searchedData[ind]?.requestStatus}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : postData.length != 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-full flex items-center justify-center p-4 lg:py-6 gap-5 flex-wrap sm:flex-nowrap">
            <div className="gap-4 w-full inline-flex items-center lg:hidden justify-start text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search"
                className="p-2 rounded-md border-none outline-none sm:w-[85%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 w-full dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>

            <button
              onClick={getFilterdData}
              className="bg-white lg:ml-auto text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-slate-100 transition duration-300 text-sm lg:text-base inline-flex items-center justify-between gap-2 border border-gray-300 dark:border-transparent"
            >
              Filter Posts Within 15KM
              <span
                className={`text-lg ${
                  filtedPosts.length === 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {filtedPosts.length === 0 ? (
                  <IoMdAddCircle />
                ) : (
                  <IoIosRemoveCircle />
                )}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
            {postData.map((food, ind) => (
              <div
                className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800 min-w-[313px]"
                key={ind}
              >
                <img
                  src={food.food.foodImage}
                  alt="Food Image"
                  className="w-full h-48 object-cover object-center"
                />
                <div className="px-6 py-4 h-[310px] flex flex-col items-start justify-between">
                  <div className="font-bold text-xl mb-2 text-black dark:text-slate-50">
                    {food.food.foodTitle}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll max-h-[92px] scroller-display-none">
                    {food.food.description}
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-black dark:text-slate-50">
                      Posted By: {food.food.contactName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                      {calculateTimeDifferenceString(
                        food.food.createdAt
                      )?.split("hrs")[0] > 55
                        ? "A few days old"
                        : calculateTimeDifferenceString(food.food.createdAt) ===
                          0
                        ? "Just now"
                        : calculateTimeDifferenceString(food.food.createdAt)}
                      <LuFileClock />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Expires in:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2">
                      {getClockTime(food.food.expiryTime)}
                      <FcAlarmClock className="text-xl" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 ">
                      {food.food.pickupLocation}
                      <MdLocationOn className="text-[22px] text-red-600" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Delivery Options:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                      {food.food.pickupOptions}
                      <MdDeliveryDining className="text-[22px] text-blue-700" />
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-2 pb-2 flex justify-between items-center w-full">
                  <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #
                    {food.food.foodType.charAt(0).toUpperCase() +
                      food.food.foodType.slice(1)}
                  </span>
                  <button
                    onClick={() => sendReuest(food.food._id)}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                      postData[ind]?.requestStatus === "requested" ||
                      postData[ind]?.requestStatus === "approved"
                        ? "opacity-70 pointer-events-none"
                        : ""
                    }`}
                  >
                    {postData[ind]?.requestStatus}
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

export default FoodCardsUsers;
