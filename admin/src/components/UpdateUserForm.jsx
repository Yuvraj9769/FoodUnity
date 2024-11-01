import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAllUsersData,
  updateUserDataAsAdminPrivilage,
} from "../api/user.api";
import { setUsersData } from "../features/adminFeatures";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";
import { Icon } from "@iconify/react/dist/iconify.js";

const UpdateUserForm = () => {
  const [userUpdateData, setUserUpdateData] = useState({
    email: "",
    fullName: "",
    mobileNumber: "",
    role: "",
    username: "",
  });

  const { index } = useParams();

  const usersData = useSelector((state) => state.usersData);
  const searchedData = useSelector((state) => state.searchedData);

  const [dataProcessing, setDataProcessing] = useState(false);
  const [loaderForGettingData, setLoaderForGettingData] = useState(true);

  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserUpdateData((preData) => ({ ...preData, [name]: value }));
  };

  const updateUserData = async (e) => {
    e.preventDefault();

    setDataProcessing(true);

    try {
      const res = await updateUserDataAsAdminPrivilage(userUpdateData);
      const allUsersData = await getAllUsersData();
      dispatch(setUsersData(allUsersData));
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDataProcessing(false);
    }
  };

  useEffect(() => {
    if (searchedData.length !== 0) {
      setUserUpdateData(searchedData[index]);
      setLoaderForGettingData(false);
    } else if (usersData.length !== 0) {
      setUserUpdateData(usersData[index]);
      setLoaderForGettingData(false);
    } else if (usersData.length === 0 || !usersData) {
      getAllUsersData()
        .then((data) => {
          dispatch(setUsersData(data));
          setUserUpdateData(data[index]);
        })
        .catch((error) => toast.error(error.message))
        .finally(() => {
          setLoaderForGettingData(false);
        });
    }
  }, [index]);

  return (
    <div className="flex justify-center bg-gray-100 backdrop-blur-lg bg-opacity-50 dark:bg-gray-900 p-0 sm:p-8 overflow-y-scroll scroll-smooth scroll-bar-custom">
      {loaderForGettingData ? (
        <PageLoader />
      ) : (
        <form
          className="p-8 rounded-lg shadow-lg border h-fit border-gray-200 dark:border dark:border-gray-400 w-full max-w-md flex flex-col items-start gap-4"
          onSubmit={updateUserData}
        >
          <h2 className="text-2xl font-semibold inline-flex justify-between items-center text-gray-800 dark:text-gray-200 mb-6 w-full text-center">
            Update User
            <img
              src="/logo/DarkLogo.jpeg"
              alt="logoImage"
              className="h-12 w-12 object-contain"
            />
          </h2>

          <div className="inline-flex flex-col items-start gap-1 w-full">
            <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
              Full Name :
            </label>
            <input
              type="text"
              name="fullName"
              value={userUpdateData.fullName}
              onChange={handleOnChange}
              placeholder="Full Name (e.g. John Doe)"
              className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
              required
            />
          </div>
          <div className="inline-flex flex-col items-start gap-1 w-full">
            <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
              Username :
            </label>
            <input
              name="username"
              type="text"
              value={userUpdateData.username}
              onChange={handleOnChange}
              placeholder="Username"
              className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
              required
            />
          </div>
          <div className="inline-flex flex-col items-start gap-1 w-full">
            <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
              Mobile Number :
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={userUpdateData.mobileNumber}
              onChange={handleOnChange}
              placeholder="Mobile Number"
              className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
              required
            />
          </div>
          <div className="inline-flex flex-col items-start gap-1 w-full">
            <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
              Role :
            </label>
            <select
              name="role"
              value={userUpdateData.role}
              onChange={handleOnChange}
              required
              className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
            >
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
            </select>
          </div>
          <div className="inline-flex flex-col items-start gap-1 w-full">
            <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
              Email :
            </label>
            <input
              type="email"
              name="email"
              value={userUpdateData.email}
              onChange={handleOnChange}
              placeholder="Email (e.g. example@domain.com)"
              className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="text-slate-50 self-center px-5 py-2 rounded-md bg-teal-500 my-2 font-semibold hover:bg-teal-600 transition-colors duration-500 inline-flex items-center gap-2"
          >
            {dataProcessing ? (
              <>
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="text-2xl font-semibold"
                />
                Processing
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateUserForm;
