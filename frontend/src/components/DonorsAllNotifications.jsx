import React, { useEffect, useState } from "react";
import {
  getDonorsAllNotifications,
  rejectOrAcceptRequest,
} from "../api/foodApi";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";

const DonorsAllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  let [loading, setLoading] = useState(true);

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

  console.log(notifications);

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
      ) : notifications.length != 0 ? (
        <div className="container mx-auto mt-8 pt-2 pb-4">
          <h1 className="text-3xl text-center sm:text-start font-bold mb-6 text-black dark:text-slate-50">
            Requests for Your Food Posts
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-4">
            {notifications.map((notification, ind) => (
              <div
                key={ind}
                className="bg-white shadow-md rounded-lg p-4 w-[90%] max-w-[346px] sm:w-auto flex flex-col items-start gap-2"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <h2 className="text-xl font-semibold">
                    {notification.foodId.foodTitle}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <img
                  src={notification.foodId.foodImage}
                  alt="Food Image"
                  className="w-full h-48 object-cover object-center mb-2 rounded-md"
                />
                <p className="text-gray-600 mb-2 overflow-y-scroll h-[92px] scroller-display-none">
                  {notification.foodId.description}
                </p>
                <p className="text-gray-700 mb-1">
                  <b>Requested by: {notification.requesterId.username}</b>
                </p>
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
                    <img src="/icons/accept.png" alt="" className="w-[28px]" />
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
                    <img src="/icons/reject.png" alt="" className="w-[30px]" />
                  </button>
                </div>
              </div>
            ))}
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
