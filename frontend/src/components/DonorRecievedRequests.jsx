import { useEffect, useState } from "react";
import { getDonorsRequests, rejectOrAcceptRequest } from "../api/foodApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";
import { MdDeliveryDining, MdLocationOn } from "react-icons/md";

const DonorRecievedRequests = () => {
  const [requests, setRequests] = useState([]);
  const { uid, fid } = useParams();
  let [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getDonorsRequests(uid, fid);
        setRequests([response]);
      } catch (error) {
        toast.error(error.message);
      }
    };

    (async () => {
      await fetchRequests();
    })();

    setLoading(false);
  }, []);

  const acceptOrRejectRequest = async (status, cardInd, foodId) => {
    try {
      const email = requests[cardInd].email;
      const data = {
        recipientEmail: email,
        reqStatus: status,
        foodId,
      };
      const response = await rejectOrAcceptRequest(data);
      toast.success(response.message);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : requests.length != 0 ? (
        <div className="container mx-auto mt-8 pt-2 pb-4">
          <h1 className="text-3xl text-center sm:text-start font-bold mb-6 text-black dark:text-slate-50">
            Requests for Your Food Posts
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-4">
            {requests.map((request, ind) => (
              <div
                key={ind}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-[90%] max-w-[370px] sm:max-w-[313px] flex flex-col items-start gap-2 sm:w-[313px]"
              >
                <div className="flex flex-col gap-2 w-full mb-1">
                  <h2 className="text-xl font-semibold text-black dark:text-slate-50 text-nowrap overflow-hidden text-ellipsis w-full">
                    {request.foodTitle}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(request.requestCreateAt).toLocaleString()}
                  </p>
                </div>
                <img
                  src={request.foodImage}
                  alt="Food Image"
                  className="w-full h-48 object-cover object-center mb-2 rounded-md"
                />
                <p className="text-gray-600 mb-2 overflow-y-scroll max-h-[92px] scroller-display-none dark:text-slate-50">
                  {request.foodDescription}
                </p>
                <p className="text-gray-700 mb-1 dark:text-slate-50 w-full overflow-hidden text-nowrap text-ellipsis">
                  <b>Requested by: {request.uname}</b>
                </p>

                <div className="mt-2 inline-flex items-center gap-2 w-full">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Location:
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 inline-flex items-center gap-2 max-w-[80%]">
                    <p className="max-w-[80%] text-nowrap overflow-hidden text-ellipsis">
                      {request.pickupLocation}
                    </p>
                    <MdLocationOn className="text-[22px] text-red-600" />
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Delivery Options:
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize ml-1 inline-flex items-center gap-2 ">
                    {request.pickupOptions}
                    <MdDeliveryDining className="text-[22px] text-blue-700" />
                  </span>
                </div>

                <div className="flex justify-around items-center w-full">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 duration-500 text-white inline-flex items-center gap-2 font-bold py-2 px-4 rounded-full"
                    onClick={() =>
                      acceptOrRejectRequest("Accept", ind, request._id)
                    }
                  >
                    Accept
                    <img src="/icons/accept.png" alt="" className="w-[28px]" />
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 duration-500 text-white font-bold inline-flex items-center gap-2 py-2 px-4 rounded-full"
                    onClick={() =>
                      acceptOrRejectRequest("Reject", ind, request._id)
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
        <div className="flex flex-col gap-5 items-center h-screen dark:text-slate-50 text-black">
          <p className="text-2xl md:text-4xl text-center">
            Sorry, there are no requests available at the moment.
          </p>
        </div>
      )}
    </>
  );
};

export default DonorRecievedRequests;
