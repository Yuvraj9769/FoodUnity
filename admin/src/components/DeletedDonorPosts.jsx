import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getDonorDeletedPosts, searchDeletedFoodPosts } from "../api/food.api";
import {
  setDeletedPostsData,
  setSearchDonorDeletedPosts,
  setSearchedData,
} from "../features/adminFeatures";
import calculateTimeDifferenceString from "../utils/calculateTimeDifferenceString";
import { LuFileClock } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { FcAlarmClock } from "react-icons/fc";
import { MdDeliveryDining, MdLocationOn } from "react-icons/md";
import getClockTime from "../utils/getClockTime";

const DeletedDonorPosts = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const deletedPostsData = useSelector((state) => state.deletedPostsData);
  const searchDonorDeletedPosts = useSelector(
    (state) => state.searchDonorDeletedPosts
  );

  const [searchData, setSearchData] = useState({
    searchQuery: "",
  });

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (searchDonorDeletedPosts.length !== 0 && value === "") {
      dispatch(setSearchedData([]));
    }
    setSearchData((preData) => ({ ...preData, searchQuery: value }));
  };

  const checkKey = async (e) => {
    if (
      e.key === "Enter" &&
      location.pathname === "/donors-deleted-posts-admin" &&
      searchData.searchQuery.trim() !== ""
    ) {
      try {
        setLoading(true);
        const res = await searchDeletedFoodPosts(searchData);
        dispatch(setSearchDonorDeletedPosts(res));
      } catch (error) {
        setSearchData({
          searchQuery: "",
        });
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (deletedPostsData.length === 0 || deletedPostsData) {
      getDonorDeletedPosts()
        .then((data) => dispatch(setDeletedPostsData(data)))
        .catch((error) => toast.error(error.message))
        .finally(() => setLoading(false));
    }
    if (deletedPostsData.length !== 0) {
      setLoading(false);
    }

    return () => {
      dispatch(setSearchDonorDeletedPosts([]));
      setSearchData({
        searchQuery: "",
      });
    };
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : deletedPostsData.length != 0 ? (
        <div className="flex flex-col items-center gap-3 overflow-y-scroll scroll-smooth scroll-bar-custom">
          <div className="w-full flex items-center justify-center p-4 lg:py-6 gap-4 flex-wrap lg:flex-nowrap">
            <div className="gap-3 w-full inline-flex mt-2 items-center justify-center text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search food by type/name"
                className="p-2 rounded-md border-none outline-none w-[85%] lg:w-[45%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-6 xl:gap-5">
            {searchDonorDeletedPosts.length !== 0
              ? searchDonorDeletedPosts.map((e, ind) => (
                  <div
                    className="max-w-sm rounded-lg my-2 sm:my-0 overflow-hidden shadow-lg shadow-gray-500 dark:shadow-slate-700 bg-white dark:bg-gray-800"
                    key={ind}
                  >
                    <img
                      src={e.foodImage}
                      alt="Food Image"
                      className="w-full h-48 object-cover object-center"
                    />
                    <div className="px-6 py-4 h-[260px] flex flex-col items-start justify-between">
                      <div className="font-bold text-xl mb-2 text-black dark:text-slate-50">
                        {e.foodTitle}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll child-scrollbar scroll-smooth h-[92px]">
                        {e.description}
                      </p>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold text-black dark:text-slate-50">
                          Posted By: {e.contactName}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                          {calculateTimeDifferenceString(e.createdAt)?.split(
                            "hrs"
                          )[0] > 55
                            ? "A few days old"
                            : calculateTimeDifferenceString(e.createdAt) === 0
                            ? "Just now"
                            : calculateTimeDifferenceString(e.createdAt)}
                          <LuFileClock />
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Expires in:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2">
                          {getClockTime(e.expiryTime)}
                          <FcAlarmClock className="text-xl" />
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Location:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 ">
                          {e.pickupLocation}
                          <MdLocationOn className="text-[22px] text-red-600" />
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Delivery Options:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                          {e.pickupOptions}
                          <MdDeliveryDining className="text-[22px] text-blue-700" />
                        </span>
                      </div>
                    </div>
                    <div className="px-6 pt-4 pb-2 flex flex-wrap w-full justify-between items-center">
                      <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        #
                        {e.foodType.charAt(0).toUpperCase() +
                          e.foodType.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              : deletedPostsData.map((e, ind) => (
                  <div
                    className="max-w-sm rounded-lg my-2 sm:my-0 overflow-hidden shadow-lg shadow-gray-500 dark:shadow-slate-700 bg-white dark:bg-gray-800"
                    key={ind}
                  >
                    <img
                      src={e.foodImage}
                      alt="Food Image"
                      className="w-full h-48 object-cover object-center"
                    />
                    <div className="px-6 py-4 h-[260px] flex flex-col items-start justify-between">
                      <div className="font-bold text-xl mb-2 text-black dark:text-slate-50">
                        {e.foodTitle}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll child-scrollbar scroll-smooth h-[92px] ">
                        {e.description}
                      </p>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold text-black dark:text-slate-50">
                          Posted By: {e.contactName}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                          {calculateTimeDifferenceString(e.createdAt)?.split(
                            "hrs"
                          )[0] > 55
                            ? "A few days old"
                            : calculateTimeDifferenceString(e.createdAt) === 0
                            ? "Just now"
                            : calculateTimeDifferenceString(e.createdAt)}
                          <LuFileClock />
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Expires in:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2">
                          {getClockTime(e.expiryTime)}
                          <FcAlarmClock className="text-xl" />
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Location:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 ">
                          {e.pickupLocation}
                          <MdLocationOn className="text-[22px] text-red-600" />
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Delivery Options:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                          {e.pickupOptions}
                          <MdDeliveryDining className="text-[22px] text-blue-700" />
                        </span>
                      </div>
                    </div>
                    <div className="px-6 pt-4 pb-2 flex flex-wrap w-full justify-between items-center">
                      <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        #
                        {e.foodType.charAt(0).toUpperCase() +
                          e.foodType.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 items-center h-screen dark:text-slate-50 text-black">
          <p className="text-2xl md:text-4xl text-center my-4">
            Sorry, there are no posts available at the moment.
          </p>
        </div>
      )}
    </>
  );
};

export default DeletedDonorPosts;
