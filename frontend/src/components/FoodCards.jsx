import { useEffect, useState } from "react";
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
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { deleteFoodPost } from "../api/foodApi";

const FoodCards = () => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postData);
  const userData = useSelector((state) => state.userData);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const [popupBox, setPopupBox] = useState(false);
  const [delIndex, setDelIndex] = useState(null);

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

  const calculateTimeDifferenceString = (createdAt) => {
    const postCreatedAt = createdAt ? new Date(createdAt).getTime() : null;
    const currentTime = Date.now();
    let timeDifferenceString = "";

    if (postCreatedAt !== null) {
      const timeDifference = currentTime - postCreatedAt; // in milliseconds
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      const hoursDifference = Math.floor(minutesDifference / 60);
      const remainingMinutes = minutesDifference % 60;

      if (hoursDifference > 0) {
        timeDifferenceString += `${hoursDifference} hr${
          hoursDifference > 1 ? "s" : ""
        } `;
      }

      timeDifferenceString += `${remainingMinutes} min${
        remainingMinutes !== 1 ? "s" : ""
      } `;
    }

    return timeDifferenceString.trim();
  };

  const getClockTime = (time) => {
    const [hour, minute] = time.split(":");
    let hourInt = parseInt(hour, 10); //converts the string hour into an integer using the decimal (base-10) numeral system.
    const ampm = hourInt >= 12 ? "PM" : "AM";
    hourInt = hourInt % 12 || 12;
    return `${hourInt}:${minute} ${ampm}`;
  };

  const getDeletePost = (ind) => {
    setDelIndex(ind);
    setPopupBox(true);
  };

  const deletePost = async () => {
    try {
      setPopupBox(false);
      const res = await deleteFoodPost(postData[delIndex]._id);
      console.log(res);
      if (res.statusCode === 200 && res.success) {
        const updatedPostData = await getDonorPostedPosts();
        dispatch(setPostData(updatedPostData));
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
      ) : postData.length != 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4 lg:gap-6 xl:gap-5">
          {postData.map((e, ind) => (
            <div
              className="max-w-sm rounded-lg my-2 sm:my-0 overflow-hidden shadow-lg shadow-gray-500 dark:shadow-slate-700 bg-white dark:bg-gray-800"
              key={ind}
            >
              <img
                src={e.foodImage}
                alt="Food Image"
                className="w-full h-48 object-cover object-center"
              />
              <div className="px-6 py-4 h-[220px] flex flex-col items-start justify-between">
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
                    {calculateTimeDifferenceString(e.createdAt)}
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
              </div>
              <div className="px-6 pt-4 pb-2 flex flex-wrap w-full justify-between bg-red-500 items-center">
                <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  #{e.foodType.charAt(0).toUpperCase() + e.foodType.slice(1)}
                </span>
                <div className="p-2 inline-flex items-center gap-3">
                  <MdDelete
                    className="text-2xl cursor-pointer hover:scale-105 duration-500"
                    onClick={() => getDeletePost(ind)}
                  />
                  <CiEdit className="text-2xl cursor-pointer hover:scale-105 duration-500" />
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
