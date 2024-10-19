import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import Profile from "./Profile";
import { toast } from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import { FaBarsStaggered } from "react-icons/fa6";
import Sidebar from "./Sidebar";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { searchDataQuery } from "../api/foodApi";
import {
  setIsLoggedIn,
  setDarkMode,
  setProfile,
  setSidebarVisible,
  setPostData,
  setSearchedData,
} from "../features/foodUnity";
import { logoutUser } from "../api/userApi";

const Navbar = ({ setIsJWTExpired }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.darkMode);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const profile = useSelector((state) => state.profile);
  const userData = useSelector((state) => state.userData);
  const siderbarvisible = useSelector((state) => state.siderbarvisible);
  const postData = useSelector((state) => state.postData);
  const searchedData = useSelector((state) => state.searchedData);

  const location = useLocation();

  const [donor, setDonor] = useState(false);
  const [searchData, setSearchData] = useState({
    searchQuery: "",
  });

  document.documentElement.className = darkMode ? "dark" : "light";

  const logout = async () => {
    if (isLoggedIn) {
      try {
        const res = await logoutUser();
        dispatch(setIsLoggedIn(false));
        setDonor(false);
        dispatch(setPostData([]));
        secureLocalStorage.removeItem("user");
        if (secureLocalStorage.getItem("donor")) {
          secureLocalStorage.removeItem("donor");
        } else if (secureLocalStorage.getItem("recipient")) {
          secureLocalStorage.removeItem("recipient");
        }
        setIsJWTExpired(true);
        navigate("/");
        toast.success(res.message);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getDataAndProfile = async () => {
    dispatch(setProfile(!profile));
  };

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (searchedData.length !== 0 && value.length === 0) {
      setSearchData({ searchQuery: "" });
      dispatch(setSearchedData([]));
    }

    setSearchData((preData) => ({ ...preData, searchQuery: value }));
  };

  const checkKey = async (e) => {
    if (e.key === "Enter" && location.pathname === "/posts") {
      try {
        const res = await searchDataQuery(searchData);
        if (res.statusCode === 200 && res.success) {
          dispatch(setSearchedData(res.data));
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (!donor && postData.length != 0 && userData?.role === "donor") {
      setDonor(secureLocalStorage.getItem("donor"));
    }
  }, [donor, userData, postData]);

  return (
    <nav className="dark:bg-slate-900 w-full bg-slate-50 box-border sticky top-0 border-b z-50 border-b-[#b3b2b2] py-3 pb-4 md:pb-2 flex items-center justify-between px-2">
      <Link to="/">
        <img
          src={darkMode ? "/logo/DarkLogo.jpeg" : "/logo/LightLogo.jpeg"}
          className="h-full w-[60px] cursor-pointer ml-3"
        />
      </Link>
      <ul className="ul text-lg w-[400px] md:w-auto md:gap-7 dark:text-slate-50 justify-between  items-center hidden md:px-6">
        <li>
          <NavLink
            to="/"
            className={(e) => {
              return e.isActive
                ? "text-black font-semibold dark:text-red-500"
                : " ";
            }}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
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
              className={(e) => {
                return e.isActive
                  ? "text-black font-semibold dark:text-red-500"
                  : " ";
              }}
            >
              How it works?
            </NavLink>
          </li>
        ) : donor ? (
          <li>
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
          <li>
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
        )}

        {isLoggedIn ? (
          <li className="lg:flex items-center gap-4 hidden text-lg">
            <div className="flex items-center gap-3 w-full text-black rounded-md pr-2">
              <input
                type="text"
                value={searchData.searchQuery}
                onChange={handleOnChange}
                onKeyDown={checkKey}
                placeholder="Search"
                className="p-2 rounded-md border-none outline-none w-[320px] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
              />
            </div>
            {isLoggedIn && (
              <div
                className="inline-flex items-center justify-center relative h-[50px] w-[60px] rounded-full"
                onClick={getDataAndProfile}
              >
                <div className="h-full w-full inline-flex items-center justify-center rounded-full overflow-hidden">
                  {Object.keys(userData).length !== 0 ? (
                    userData?.profilePic ? (
                      <img
                        src={userData.profilePic}
                        alt="User Profile"
                        className="w-full h-full cursor-pointer object-cover"
                      />
                    ) : (
                      <p className="dark:bg-gray-800 bg-transparent border border-gray-300 dark:border-none w-full h-full inline-flex items-center justify-center cursor-pointer rounded-full dark:text-slate-50 text-black font-semibold">
                        {userData.email.slice(0, 1).toUpperCase()}
                      </p>
                    )
                  ) : (
                    <p className="rounded-full text-3xl text-red-600 cursor-pointer animate-spin">
                      <TbLoader3 />
                    </p>
                  )}
                  {profile && <Profile logout={logout} />}
                </div>
              </div>
            )}
          </li>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <button className="bg-transparent dark:text-slate-50 text-black font-semibold hover:bg-gray-200 dark:hover:text-black duration-500 py-2 px-4 border rounded mr-2">
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button className="dark:bg-gray-800 bg-red-600 hover:bg-transparent duration-500 text-slate-50 font-bold py-2 shadow-md border border-transparent hover:text-black dark:hover:text-slate-50 hover:border-slate-50 ho px-4 rounded">
                Register
              </button>
            </Link>
          </div>
        )}
        <li
          className="text-2xl hover:cursor-pointer"
          onClick={() => {
            dispatch(setDarkMode(!darkMode));
          }}
        >
          <NavLink
            className={(e) => (e.isActive ? "text-red-600" : " ")}
            onClick={(e) => e.preventDefault()}
          >
            {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
          </NavLink>
        </li>
      </ul>

      <Sidebar logout={logout} />
      <button
        onClick={() => dispatch(setSidebarVisible(!siderbarvisible))}
        className="sidebtn text-red-600 text-2xl border border-[#dadada] rounded px-2 py-1"
      >
        <FaBarsStaggered />
      </button>
    </nav>
  );
};

Navbar.propTypes = {
  setIsJWTExpired: propTypes.func.isRequired,
};

export default Navbar;
