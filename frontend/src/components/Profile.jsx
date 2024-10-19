import { useRef, useState } from "react";
import { IoMdCamera } from "react-icons/io";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  setProfile,
  setSearchedData,
} from "../features/foodUnity";
import { MdEmail } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import axios from "axios";
import { SERVER } from "../utils/server";
import { toast } from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import secureLocalStorage from "react-secure-storage";
import { FaListAlt } from "react-icons/fa";
import { AiOutlineHistory } from "react-icons/ai";
import PropTypes from "prop-types";
import { MdFeedback } from "react-icons/md";

const Profile = ({ logout, setSearchData }) => {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const profilePicChange = useRef("");

  const [loader, setLoader] = useState(false);

  const changeProfilePic = () => {
    profilePicChange.current.click();
  };

  const handleFileChange = async (event) => {
    setLoader(true);
    try {
      const response = await axios.patch(
        `${SERVER}/users/updateProfilePic`,
        {
          profilePic: event.target.files[0],
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        dispatch(getUserData());
        toast.success(response.data.message);
      }

      setLoader(false);
    } catch (error) {
      setLoader(false);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="bg-slate-50 dark:bg-slate-950 font-semibold text-black dark:text-slate-50 p-6 h-auto absolute left-[-255px] rounded-xl border border-[#dadada] top-[75px] flex flex-col items-center gap-4 max-w-[255px] w-[250px] z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="font-semibold text-3xl h-[80px] w-[80px] rounded-full inline-flex items-center justify-center relative mb-2">
        {loader ? (
          <span className="text-5xl text-black dark:text-slate-50 py-4 mx-auto animate-spin">
            <TbLoader3 />
          </span>
        ) : (
          <div className="w-full rounded-full h-[75px] cursor-pointer overflow-hidden inline-flex items-center justify-center">
            {userData?.profilePic ? (
              <img
                src={userData.profilePic}
                onClick={changeProfilePic}
                alt="User Profile"
                className="w-full h-full cursor-pointer object-cover"
              />
            ) : (
              <p className="dark:bg-gray-800 bg-transparent border border-gray-300 dark:border-none w-full h-full inline-flex items-center justify-center cursor-pointer rounded-full dark:text-slate-50 text-black font-semibold">
                {userData.email.slice(0, 1).toUpperCase()}
              </p>
            )}
          </div>
        )}
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          ref={profilePicChange}
          accept="image/*"
          className="hidden"
        />
        <p
          className="absolute bottom-[-10px] right-0 text-xl p-[6px] shadow-md shadow-gray-400 bg-slate-50 text-red-600 rounded-full z-20"
          onClick={changeProfilePic}
        >
          <IoMdCamera />
        </p>
        <p
          onClick={() => dispatch(setProfile(!profile))}
          className="absolute top-[-15px] right-[-80px] text-xl p-[6px] rounded-full cursor-pointer"
        >
          <RxCross2 />
        </p>
      </div>
      <div className="text-center">
        <p className="text-lg">{userData?.username}</p>
        <p className="text-gray-400 text-base">{userData?.bio}</p>
      </div>
      <p className="text-base w-full inline-flex py-1 items-center justify-start border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis">
        <span>
          <MdEmail />
        </span>
        {userData?.email}
      </p>
      <Link
        to="/updateProfile"
        onClick={() => dispatch(setProfile(!profile))}
        className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
      >
        <MdManageAccounts />
        Manage your account
      </Link>
      {secureLocalStorage.getItem("donor") ? (
        <Link
          to="/foods/notifications"
          onClick={() => dispatch(setProfile(!profile))}
          className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
        >
          <IoMdNotifications />
          Notifications
        </Link>
      ) : (
        <Link
          to="/foods/requestsData"
          onClick={() => {
            dispatch(setProfile(!profile));
            dispatch(setSearchedData([]));
            setSearchData({ searchQuery: "" });
          }}
          className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
        >
          <FaListAlt />
          My Requests
        </Link>
      )}
      {secureLocalStorage.getItem("donor") ? (
        <Link
          to="/foods/VerifyOTP"
          onClick={() => {
            dispatch(setProfile(!profile));
            dispatch(setSearchedData([]));
            setSearchData({ searchQuery: "" });
          }}
          className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
        >
          <RiLockPasswordFill />
          OTP Verification
        </Link>
      ) : (
        <Link
          to="/postHistory"
          onClick={() => {
            dispatch(setProfile(!profile));
            dispatch(setSearchedData([]));
            setSearchData({ searchQuery: "" });
          }}
          className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
        >
          <AiOutlineHistory />
          Request History
        </Link>
      )}

      <Link
        to="/feedback"
        onClick={() => dispatch(setProfile(!profile))}
        className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
      >
        <MdFeedback />
        Share Feedback
      </Link>
      <p
        onClick={logout}
        className="flex items-center gap-4 text-lg text-center p-2 px-4 cursor-pointer rounded-3xl border border-[#cfcfcf] dark:hover:bg-slate-900 duration-500 hover:bg-slate-200"
      >
        <MdLogout />
        Logout
      </p>
    </div>
  );
};

Profile.propTypes = {
  logout: PropTypes.func.isRequired,
  setSearchData: PropTypes.func.isRequired,
};

export default Profile;
