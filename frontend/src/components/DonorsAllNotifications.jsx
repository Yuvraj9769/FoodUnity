import { useContext, useEffect, useState } from "react";
import {
  getDonorsAllNotifications,
  rejectOrAcceptRequest,
} from "../api/foodApi";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";
import { useSelector } from "react-redux";
import { MdDeliveryDining, MdLocationOn } from "react-icons/md";
import searchContext from "../store/searchContext";

const DonorsAllNotifications = () => {
  const searchedData = useSelector((state) => state.searchedData);

  const [notifications, setNotifications] = useState([]);
  let [loading, setLoading] = useState(true);

  const { searchData, handleOnChange, checkKey } = useContext(searchContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getDonorsAllNotifications();
        setNotifications(response);
      } catch (error) {
        toast.error(error.message);
      }
    };

    setLoading(false);

    fetchRequests();
  }, []);

  const acceptOrRejectRequest = async (status, cardInd, foodId) => {
    try {
      const email = notifications[cardInd].requesterId.email;
      const data = {
        recipientEmail: email,
        reqStatus: status,
        foodId,
      };
      const response = await rejectOrAcceptRequest(data);
      toast.success(response.message);

      const res = await getDonorsAllNotifications();
      setNotifications(res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : searchedData.length !== 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-full flex items-center lg:hidden justify-center p-4 lg:py-6 gap-5 flex-wrap lg:flex-nowrap">
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
          <div className="container mx-auto mt-8 pt-2 pb-4">
            <h1 className="text-3xl text-center sm:text-start font-bold mb-6 text-black dark:text-slate-50">
              Requests for Your Food Posts
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-4">
              {searchedData.map((notification, ind) => (
                <div
                  key={ind}
                  className="bg-white dark:bg-gray-800 shadow-md  rounded-lg p-4 w-[90%] max-w-[346px] sm:w-auto flex flex-col items-start gap-2"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <h2 className="text-xl font-semibold text-black dark:text-slate-50">
                      {notification.foodId.foodTitle}
                    </h2>
                    <p className="text-sm text-gray-500  dark:text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <img
                    src={notification.foodId.foodImage}
                    alt="Food Image"
                    className="w-full h-48 object-cover object-center mb-2 rounded-md"
                  />
                  <p className="text-gray-600 mb-2 overflow-y-scroll h-[92px] dark:text-slate-50 scroller-display-none">
                    {notification.foodId.description}
                  </p>
                  <p className="text-gray-700 mb-1 dark:text-slate-50">
                    <b>Requested by: {notification.requesterId.username}</b>
                  </p>

                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 ">
                      {notification.foodId.pickupLocation}
                      <MdLocationOn className="text-[22px] text-red-600" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Delivery Options:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                      {notification.foodId.pickupOptions}
                      <MdDeliveryDining className="text-[22px] text-blue-700" />
                    </span>
                  </div>

                  <div className="flex justify-around items-center w-full">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 duration-500 text-white inline-flex items-center gap-2 font-bold py-2 px-4 rounded-full"
                      onClick={() =>
                        acceptOrRejectRequest(
                          "Accept",
                          ind,
                          notification.foodId._id
                        )
                      }
                    >
                      Accept
                      <img
                        src="/icons/accept.png"
                        alt=""
                        className="w-[28px]"
                      />
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 duration-500 text-white font-bold inline-flex items-center gap-2 py-2 px-4 rounded-full"
                      onClick={() =>
                        acceptOrRejectRequest(
                          "Reject",
                          ind,
                          notification.foodId._id
                        )
                      }
                    >
                      Reject
                      <img
                        src="/icons/reject.png"
                        alt=""
                        className="w-[30px]"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : notifications.length != 0 ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-full flex items-center lg:hidden justify-center p-4 lg:py-6 gap-5 flex-wrap lg:flex-nowrap">
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
          <div className="container mx-auto mt-8 pt-2 pb-4">
            <h1 className="text-3xl text-center sm:text-start font-bold mb-6 text-black dark:text-slate-50">
              Requests for Your Food Posts
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-4">
              {notifications.map((notification, ind) => (
                <div
                  key={ind}
                  className="bg-white dark:bg-gray-800 shadow-md  rounded-lg p-4 w-[90%] max-w-[346px] sm:w-auto flex flex-col items-start gap-2"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <h2 className="text-xl font-semibold text-black dark:text-slate-50">
                      {notification.foodId.foodTitle}
                    </h2>
                    <p className="text-sm text-gray-500  dark:text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <img
                    src={notification.foodId.foodImage}
                    alt="Food Image"
                    className="w-full h-48 object-cover object-center mb-2 rounded-md"
                  />
                  <p className="text-gray-600 mb-2 overflow-y-scroll h-[92px] dark:text-slate-50 scroller-display-none">
                    {notification.foodId.description}
                  </p>
                  <p className="text-gray-700 mb-1 dark:text-slate-50">
                    <b>Requested by: {notification.requesterId.username}</b>
                  </p>

                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 ">
                      {notification.foodId.pickupLocation}
                      <MdLocationOn className="text-[22px] text-red-600" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Delivery Options:
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                      {notification.foodId.pickupOptions}
                      <MdDeliveryDining className="text-[22px] text-blue-700" />
                    </span>
                  </div>

                  <div className="flex justify-around items-center w-full">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 duration-500 text-white inline-flex items-center gap-2 font-bold py-2 px-4 rounded-full"
                      onClick={() =>
                        acceptOrRejectRequest(
                          "Accept",
                          ind,
                          notification.foodId._id
                        )
                      }
                    >
                      Accept
                      <img
                        src="/icons/accept.png"
                        alt=""
                        className="w-[28px]"
                      />
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 duration-500 text-white font-bold inline-flex items-center gap-2 py-2 px-4 rounded-full"
                      onClick={() =>
                        acceptOrRejectRequest(
                          "Reject",
                          ind,
                          notification.foodId._id
                        )
                      }
                    >
                      Reject
                      <img
                        src="/icons/reject.png"
                        alt=""
                        className="w-[30px]"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 items-center h-screen dark:text-slate-50 text-black mt-4">
          <p className="text-2xl md:text-4xl text-center">
            Sorry, there are no requests available at the moment.
          </p>
        </div>
      )}
    </>
  );
};

export default DonorsAllNotifications;
