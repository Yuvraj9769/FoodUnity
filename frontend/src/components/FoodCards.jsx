import { useContext, useEffect, useState } from "react";
import { getDonorPostedPosts } from "../api/foodApi";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../features/foodUnity";
import { toast } from "react-hot-toast";
import { LuFileClock } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import secureLocalStorage from "react-secure-storage";
import { FcAlarmClock } from "react-icons/fc";
import { MdDelete, MdDeliveryDining, MdLocationOn } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { deleteFoodPost } from "../api/foodApi";
import calculateTimeDifferenceString from "../utils/calculateTimeDifferenceString";
import getClockTime from "../utils/getClockTime";
import searchContext from "../store/searchContext";

const FoodCards = () => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postData);
  const userData = useSelector((state) => state.userData);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const searchedData = useSelector((state) => state.searchedData);

  const [popupBox, setPopupBox] = useState(false);
  const [delIndex, setDelIndex] = useState(null);
  const { searchData, handleOnChange, checkKey } = useContext(searchContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const donor = secureLocalStorage.getItem("donor");

    setTimeout(() => {
      if (donor && postData.length == 0) {
        (async () => {
          try {
            const data = await getDonorPostedPosts();
            dispatch(setPostData(data));
          } catch (error) {
            toast.error(error.message);
            navigate("/");
          }
        })();
      }

      setLoading(false);
    }, 700);
  }, []);

  const getDeletePost = (ind) => {
    setDelIndex(ind);
    setPopupBox(true);
  };

  const deletePost = async () => {
    try {
      setPopupBox(false);
      if (searchedData.length !== 0) {
        const res = await deleteFoodPost(searchedData[delIndex]._id);
        if (res.statusCode === 200 && res.success) {
          const updatedPostData = await getDonorPostedPosts();
          dispatch(setPostData(updatedPostData));
          toast.success("Post deleted successfully");
        }
      } else if (postData.length !== 0) {
        const res = await deleteFoodPost(postData[delIndex]._id);
        if (res.statusCode === 200 && res.success) {
          const updatedPostData = await getDonorPostedPosts();
          dispatch(setPostData(updatedPostData));
          toast.success("Post deleted successfully");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : postData.length != 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-full flex items-center justify-center lg:hidden p-4 lg:py-6 gap-4 flex-wrap lg:flex-nowrap">
            <div className="gap-3 w-full inline-flex items-center justify-center text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search"
                className="p-2 rounded-md border-none outline-none sm:w-[85%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-6 xl:gap-5">
            {searchedData.length !== 0
              ? searchedData.map((e, ind) => (
                  <div
                    className="max-w-sm rounded-lg my-2 sm:my-0 overflow-hidden shadow-lg shadow-gray-500 dark:shadow-slate-700 bg-white dark:bg-gray-800 min-w-[313px]"
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
                      <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll scroller-display-none scroll-smooth h-[92px]">
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
                        <Link to={`/updateFoodPost/${ind}`}>
                          <CiEdit className="text-2xl cursor-pointer hover:scale-105 duration-500" />
                        </Link>
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
              : postData.map((e, ind) => (
                  <div
                    className="max-w-sm rounded-lg my-2 sm:my-0 overflow-hidden shadow-lg shadow-gray-500 dark:shadow-slate-700 bg-white dark:bg-gray-800 min-w-[313px]"
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
                      <p className="text-gray-700 dark:text-gray-300 text-base mb-2 overflow-y-scroll scroller-display-none scroll-smooth max-h-[92px]">
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
                        <Link to={`/updateFoodPost/${ind}`}>
                          <CiEdit className="text-2xl cursor-pointer hover:scale-105 duration-500" />
                        </Link>
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
          {isLoggedIn && userData.role === "donor" && (
            <Link to="/doPost">
              <button className="text-slate-50 text-lg bg-blue-700 px-4 py-2 rounded-lg my-2 outline-none border-none hover:bg-blue-800 self-center duration-200 inline-flex items-center gap-2">
                <IoMdAdd /> Create
              </button>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default FoodCards;
