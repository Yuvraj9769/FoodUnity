import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import {
  MdEmail,
  MdFeedback,
  MdLogout,
  MdManageAccounts,
  MdOutlineDarkMode,
  MdOutlineLightMode,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  setDarkMode,
  setSearchedData,
  setSidebarVisible,
  setUserData,
} from "../features/foodUnity";
import { IoMdCamera, IoMdNotifications } from "react-icons/io";
import axios from "axios";
import { SERVER } from "../utils/server";
import { TbLoader3 } from "react-icons/tb";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";
import { RiLockPasswordFill } from "react-icons/ri";
import secureLocalStorage from "react-secure-storage";
import { FaListAlt } from "react-icons/fa";
import { AiOutlineHistory } from "react-icons/ai";
import searchContext from "../store/searchContext";

const Sidebar = ({ logout }) => {
  const siderbarvisible = useSelector((state) => state.siderbarvisible);
  const darkMode = useSelector((state) => state.darkMode);
  const userData = useSelector((state) => state.userData);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const postData = useSelector((state) => state.postData);
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [donor, setDonor] = useState(false);
  const [paging, setPaging] = useState(1);
  const { setSearchData } = useContext(searchContext);
  const profilePicChange = useRef("");

  document.documentElement.className = darkMode ? "dark" : "light";

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

  useEffect(() => {
    if (!donor && postData.length != 0 && userData?.role === "donor") {
      setDonor(secureLocalStorage.getItem("donor"));
    }
  }, [donor, userData, postData]);

  return (
    <div
      className={`siderbar flex flex-col items-center gap-3 lg:hidden bg-slate-50 dark:bg-black  duration-1000 text-2xl fixed top-0 min-h-screen w-screen dark:text-slate-50 text-black ${
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
            onClick={() => {
              dispatch(setSidebarVisible(!siderbarvisible));
              setSearchData({ searchQuery: "" });
            }}
          >
            <ImCancelCircle />
          </p>
        </div>
      </div>
      {paging === 1 ? (
        <nav className="dark:bg-slate-950 w-[95%] lg:hidden bg-slate-50 box-border sticky top-0 border z-50 border-[#b3b2b2] p-6 flex items-center justify-center px-2 rounded-xl">
          <ul className="text-lg flex flex-col w-full gap-4 dark:text-slate-50 justify-between  items-start px-6">
            <li className="inline-flex w-full justify-between items-center">
              <NavLink
                onClick={() => {
                  dispatch(setSidebarVisible(!siderbarvisible));
                }}
                to="/"
                className={(e) => {
                  return e.isActive
                    ? "text-black font-semibold dark:text-red-500"
                    : " ";
                }}
              >
                Home
              </NavLink>

              <span
                className="text-2xl hover:cursor-pointer"
                onClick={() => {
                  dispatch(setSidebarVisible(!siderbarvisible));
                  dispatch(setDarkMode(!darkMode));
                }}
              >
                <NavLink
                  className={(e) => (e.isActive ? "text-red-600" : " ")}
                  onClick={(e) => e.preventDefault()}
                >
                  {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
                </NavLink>
              </span>
            </li>
            <li>
              <NavLink
                to="/services"
                onClick={() => {
                  dispatch(setSidebarVisible(!siderbarvisible));
                }}
                className={(e) => {
                  return e.isActive
                    ? "text-black font-semibold dark:text-red-500"
                    : " ";
                }}
              >
                Services
              </NavLink>
            </li>
            {postData.length == 0 ? (
              <li>
                <NavLink
                  to="/works"
                  onClick={() => {
                    dispatch(setSidebarVisible(!siderbarvisible));
                  }}
                  className={(e) => {
                    return e.isActive
                      ? "text-black font-semibold dark:text-red-500"
                      : " ";
                  }}
                >
                  How it works?
                </NavLink>
              </li>
            ) : donor && isLoggedIn ? (
              <li
                onClick={() => {
                  dispatch(setSearchedData([]));
                  setSearchData({ searchQuery: "" });
                  dispatch(setSidebarVisible(!siderbarvisible));
                }}
              >
                <NavLink
                  to="/posts"
                  className={(e) => {
                    return e.isActive
                      ? "text-black font-semibold dark:text-red-500"
                      : " ";
                  }}
                >
                  Posts
                </NavLink>
              </li>
            ) : (
              isLoggedIn && (
                <li
                  onClick={() => {
                    dispatch(setSearchedData([]));
                    setSearchData({ searchQuery: "" });
                    dispatch(setSidebarVisible(!siderbarvisible));
                  }}
                >
                  <NavLink
                    to="/getposts"
                    className={(e) => {
                      return e.isActive
                        ? "text-black font-semibold dark:text-red-500"
                        : " ";
                    }}
                  >
                    Posts
                  </NavLink>
                </li>
              )
            )}

            {isLoggedIn && secureLocalStorage.getItem("donor") ? (
              <Link
                to="/foods/notifications"
                onClick={() => {
                  dispatch(setSearchedData([]));
                  dispatch(setSidebarVisible(!siderbarvisible));
                  setSearchData({ searchQuery: "" });
                }}
                className="text-lg w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
              >
                <IoMdNotifications />
                Notifications
              </Link>
            ) : (
              isLoggedIn && (
                <Link
                  to="/foods/requestsData"
                  onClick={() => {
                    dispatch(setSearchedData([]));
                    dispatch(setSidebarVisible(!siderbarvisible));
                    setSearchData({ searchQuery: "" });
                  }}
                  className="text-lg w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
                >
                  <FaListAlt />
                  My Requests
                </Link>
              )
            )}
            {isLoggedIn && secureLocalStorage.getItem("donor") ? (
              <Link
                to="/foods/VerifyOTP"
                onClick={() => {
                  dispatch(setSearchedData([]));
                  dispatch(setSidebarVisible(!siderbarvisible));
                  setSearchData({ searchQuery: "" });
                }}
                className="text-lg w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
              >
                <RiLockPasswordFill />
                OTP Verification
              </Link>
            ) : (
              isLoggedIn && (
                <Link
                  to="/postHistory"
                  onClick={() => {
                    dispatch(setSearchedData([]));
                    dispatch(setSidebarVisible(!siderbarvisible));
                    setSearchData({ searchQuery: "" });
                  }}
                  className="text-lg w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
                >
                  <AiOutlineHistory />
                  Request History
                </Link>
              )
            )}
            {isLoggedIn && (
              <>
                <Link
                  to="/feedback"
                  onClick={() => {
                    dispatch(setSidebarVisible(!siderbarvisible));
                    setSearchData({ searchQuery: "" });
                  }}
                  className="text-lg w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
                >
                  <MdFeedback />
                  Share Feedback
                </Link>
                <p
                  onClick={() => {
                    logout();
                    dispatch(setSidebarVisible(!siderbarvisible));
                    dispatch(setUserData([]));
                    setSearchData({ searchQuery: "" });
                  }}
                  className="flex items-center gap-4 text-lg text-center p-2 px-4 cursor-pointer rounded-3xl border border-[#cfcfcf] dark:hover:bg-slate-900 duration-500 hover:bg-slate-200"
                >
                  <MdLogout />
                  Logout
                </p>
              </>
            )}

            {!isLoggedIn && (
              <div className="flex flex-col items-start gap-6">
                <Link
                  to="/login"
                  onClick={() => {
                    dispatch(setSidebarVisible(!siderbarvisible));
                  }}
                >
                  <button className="bg-transparent dark:text-slate-50 text-black font-semibold hover:bg-gray-200 dark:hover:text-black duration-500 py-2 px-4 border rounded mr-2">
                    Log In
                  </button>
                </Link>
                <Link
                  to="/register"
                  onClick={() => {
                    dispatch(setSidebarVisible(!siderbarvisible));
                  }}
                >
                  <button className="dark:bg-gray-800 bg-red-600 hover:bg-transparent duration-500 text-slate-50 font-bold py-2 shadow-md border border-transparent hover:text-black dark:hover:text-slate-50 hover:border-slate-50 ho px-4 rounded">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </ul>
        </nav>
      ) : (
        paging === 2 &&
        isLoggedIn && (
          <div
            className="bg-slate-50 dark:bg-slate-950 font-semibold text-black dark:text-slate-50 p-6 h-auto rounded-xl border border-[#dadada] flex flex-col items-start gap-[14px] w-[95%]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold text-3xl h-[80px] w-[80px] rounded-full inline-flex items-center justify-center relative mb-2">
              {loader ? (
                <span className="text-5xl text-black dark:text-slate-50 py-4 mx-auto animate-spin">
                  <TbLoader3 />
                </span>
              ) : (
                <div className="w-full rounded-full h-[75px] cursor-pointer overflow-hidden inline-flex items-center justify-center">
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
              <p className="text-gray-400 text-lg">{userData?.bio}</p>
            </div>
            <p className="text-lg w-full inline-flex py-1 items-center border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis">
              <MdEmail />
              {userData?.email}
            </p>
            <Link
              to="/updateProfile"
              onClick={() => dispatch(setSidebarVisible(!siderbarvisible))}
              className="text-lg w-full inline-flex py-1 items-center cursor-pointer border-b border-b-transparent hover:border-b-slate-700 duration-500 gap-3 overflow-hidden text-ellipsis"
            >
              <MdManageAccounts />
              Manage your account
            </Link>

            <p
              onClick={() => {
                logout();
                dispatch(setSidebarVisible(!siderbarvisible));
                dispatch(setUserData([]));
                setSearchData({ searchQuery: "" });
              }}
              className="flex items-center gap-4 text-lg text-center p-2 px-4 cursor-pointer rounded-3xl border border-[#cfcfcf] dark:hover:bg-slate-900 duration-500 hover:bg-slate-200"
            >
              <MdLogout />
              Logout
            </p>
          </div>
        )
      )}

      {isLoggedIn && (
        <div className="w-full my-4 inline-flex items-center justify-center gap-4">
          <span
            onClick={() => setPaging(1)}
            className={`w-11 text-xl h-11 rounded-full inline-flex items-center justify-center  ${
              paging === 1 ? "bg-red-600" : "border border-gray-400"
            }`}
          >
            1
          </span>
          <span
            onClick={() => setPaging(2)}
            className={`w-11 text-xl h-11 rounded-full inline-flex items-center justify-center  ${
              paging === 2 ? "bg-red-600" : "border border-gray-400"
            }`}
          >
            2
          </span>
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Sidebar;
