import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import { MdEmail, MdLogout, MdManageAccounts } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode, setSidebarVisible } from "../features/foodUnity";
import { IoMdCamera } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";
import axios from "axios";
import { SERVER } from "../utils/server";
import { TbLoader3 } from "react-icons/tb";

const Sidebar = ({ logout }) => {
  const siderbarvisible = useSelector((state) => state.siderbarvisible);
  const darkMode = useSelector((state) => state.darkMode);
  const userData = useSelector((state) => state.userData);

  const [loader, setLoader] = useState(false);
  const profilePicChange = useRef("");

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
        // dispatch(getUserData());
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

  const dispatch = useDispatch();

  return (
    <div
      className={`siderbar flex flex-col items-center gap-3 lg:hidden bg-slate-50 dark:bg-black  duration-1000 text-2xl fixed top-0 h-screen w-screen dark:text-slate-50 text-black ${
        siderbarvisible ? "left-[0%] z-50 fixed" : "left-[-110%]"
      }`}
    >
      <div className="px-4 py-3 flex w-full justify-center items-center">
        <div className="flex justify-between items-center w-full border-b border-[#dadada] pb-6">
          <Link to="/">
            <img
              src={darkMode ? "./logo/DarkLogo.jpeg" : "./logo/LightLogo.jpeg"}
              className="h-full w-[60px] cursor-pointer ml-3"
            />
          </Link>
          <p
            className="text-4xl text-red-600"
            onClick={() => dispatch(setSidebarVisible())}
          >
            <ImCancelCircle />
          </p>
        </div>
      </div>
      <div
        className="bg-slate-50 dark:bg-slate-950 font-semibold text-black dark:text-slate-50 p-6 h-auto rounded-xl border border-[#dadada] flex flex-col items-start gap-6 w-[95%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-semibold text-3xl h-[80px] w-[80px] rounded-full inline-flex items-center justify-center relative mb-2">
          {loader ? (
            <span className="text-5xl text-black dark:text-slate-50 py-4 mx-auto animate-spin">
              <TbLoader3 />
            </span>
          ) : (
            <div className="w-full rounded-full h-[75px] bg-red-600 cursor-pointer overflow-hidden inline-flex items-center justify-center">
              <img
                src={userData?.profilePic}
                onClick={changeProfilePic}
                className="w-full h-full"
                alt="Profile"
              />
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
        </div>
        <div className="inline-flex flex-col items-start gap-2">
          <p className="text-lg">{userData?.username}</p>
          <p className="text-gray-400 text-base">{userData?.bio}</p>
        </div>
        <p className="text-base w-full inline-flex py-1 items-center border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis">
          <MdEmail />
          {userData?.email}
        </p>
        <Link
          to="/updateProfile"
          onClick={() => dispatch(setSidebarVisible(!siderbarvisible))}
          className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
        >
          <MdManageAccounts />
          Manage your account
        </Link>
        <Link
          to="/setting"
          onClick={() => dispatch(setSidebarVisible(!siderbarvisible))}
          className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
        >
          <IoSettings />
          Settings
        </Link>
        <Link
          to="/activity"
          onClick={() => dispatch(setSidebarVisible(!siderbarvisible))}
          className="text-base w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
        >
          <RiFileEditFill />
          Post & Activity
        </Link>
        <p
          onClick={logout}
          className="flex items-center gap-4 text-lg text-center p-2 px-4 cursor-pointer rounded-3xl border border-[#cfcfcf] dark:hover:bg-slate-900 duration-500 hover:bg-slate-200"
        >
          <MdLogout />
          Logout
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
