import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  deletePostAsAdminPrevilage,
  getAllFoodPostsForAdmin,
  searchPost,
} from "../api/food.api";
import { setPostsData, setSearchedData } from "../features/adminFeatures";
import calculateTimeDifferenceString from "../utils/calculateTimeDifferenceString";
import { LuFileClock } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { FcAlarmClock } from "react-icons/fc";
import { MdDelete, MdDeliveryDining, MdLocationOn } from "react-icons/md";
import getClockTime from "../utils/getClockTime";

const PostsForAdmin = () => {
  const dispatch = useDispatch();

  const [popupBox, setPopupBox] = useState(false);
  const [delIndex, setDelIndex] = useState(null);

  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const postsData = useSelector((state) => state.postsData);
  const searchedData = useSelector((state) => state.searchedData);

  const [searchData, setSearchData] = useState({
    searchQuery: "",
  });

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (searchedData.length !== 0 && value === "") {
      dispatch(setSearchedData([]));
    }
    setSearchData((preData) => ({ ...preData, searchQuery: value }));
  };

  const checkKey = async (e) => {
    if (
      e.key === "Enter" &&
      location.pathname === "/users-posts-admin" &&
      searchData.searchQuery.trim() !== ""
    ) {
      try {
        setLoading(true);
        const res = await searchPost(searchData);
        dispatch(setSearchedData(res));
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

  const getDeletePost = (ind) => {
    setDelIndex(ind);
    setPopupBox(true);
  };

  useEffect(() => {
    if (postsData.length === 0 || postsData) {
      getAllFoodPostsForAdmin()
        .then((data) => dispatch(setPostsData(data.data)))
        .catch((error) => toast.error(error.message))
        .finally(() => setLoading(false));
    }
    if (postsData.length !== 0) {
      setLoading(false);
    }
  }, []);

  const deletePost = async () => {
    try {
      setPopupBox(false);
      if (searchedData.length !== 0) {
        await deletePostAsAdminPrevilage(searchedData[delIndex]._id);
        const res = await getAllFoodPostsForAdmin();
        dispatch(setPostsData(res.data));
        toast.success("Post deleted successfully");
      } else if (postsData.length !== 0) {
        await deletePostAsAdminPrevilage(postsData[delIndex]._id);
        const res = await getAllFoodPostsForAdmin();
        dispatch(setPostsData(res.data));
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : postsData.length != 0 ? (
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
            {searchedData.length !== 0
              ? searchedData.map((e, ind) => (
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
                      <div className="p-2 inline-flex items-center gap-3 text-black dark:text-slate-50">
                        <MdDelete
                          className="text-2xl cursor-pointer hover:scale-105 duration-500"
                          onClick={() => getDeletePost(ind)}
                        />
                      </div>
                    </div>

                    {popupBox && delIndex === ind && (
                      <div
                        className="before:bg-black before:opacity-85 before:fixed before:top-0 before:left-0 before:h-full before:z-10 before:w-full h-full w-full fixed left-0 top-0 bg-transparent inline-flex items-center justify-center"
                        key={ind}
                      >
                        <div className="inline-flex flex-col items-center gap-5 bg-slate-50 p-4 rounded-lg relative z-20">
                          <p className="text-xl font-semibold">
                            Are you sure want to delete this post?
                          </p>
                          <div className="inline-flex items-center mt-2 w-full justify-around">
                            <button
                              className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-green-500"
                              onClick={() => deletePost(e)}
                            >
                              Yes
                            </button>
                            <button
                              className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-red-500"
                              onClick={() => setPopupBox(!popupBox)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              : postsData.map((e, ind) => (
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
                      <div className="p-2 inline-flex items-center gap-3 text-black dark:text-slate-50">
                        <MdDelete
                          className="text-2xl cursor-pointer hover:scale-105 duration-500"
                          onClick={() => getDeletePost(ind)}
                        />
                      </div>
                    </div>

                    {popupBox && delIndex === ind && (
                      <div
                        className="before:bg-black before:opacity-85 before:fixed before:top-0 before:left-0 before:h-full before:z-10 before:w-full h-full w-full fixed left-0 top-0 bg-transparent inline-flex items-center justify-center"
                        key={ind}
                      >
                        <div className="inline-flex flex-col items-center gap-5 bg-slate-50 p-4 rounded-lg relative z-20">
                          <p className="text-xl font-semibold">
                            Are you sure want to delete this post?
                          </p>
                          <div className="inline-flex items-center mt-2 w-full justify-around">
                            <button
                              className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-green-500"
                              onClick={() => deletePost(e)}
                            >
                              Yes
                            </button>
                            <button
                              className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-red-500"
                              onClick={() => setPopupBox(!popupBox)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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

export default PostsForAdmin;
