import { useEffect, useState } from "react";
import {
  getAllPostsForUser,
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

const FoodCardsUsers = () => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postData);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : postData.length != 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
          {postData.map((food, ind) => (
            <div
              className="max-w-sm rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700 shadow-slate-800 bg-white dark:bg-gray-800"
              key={ind}
            >
              <img
                src={food.food.foodImage}
                alt="Food Image"
                className="w-full h-48 object-cover object-center"
              />
              <div className="px-6 py-4 h-[220px] flex flex-col items-start justify-between">
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
                    {calculateTimeDifferenceString(food.food.createdAt)?.split(
                      "hrs"
                    )[0] > 55
                      ? "A few days old"
                      : calculateTimeDifferenceString(food.food.createdAt) === 0
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
              </div>
              <div className="px-6 pt-4 pb-2 flex justify-between items-center w-full">
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
