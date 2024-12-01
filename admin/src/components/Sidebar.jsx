import { NavLink, useNavigate } from "react-router-dom";
import { setLogin, setSearchedData } from "../features/adminFeatures";
import { useDispatch, useSelector } from "react-redux";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { logoutAdmin } from "../api/admin.api";
import { useContext } from "react";
import adminContext from "../store/adminContext";
import { Icon } from "@iconify/react/dist/iconify.js";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode, isSidebarVisible, setSidebarVisible } =
    useContext(adminContext);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const logout = async () => {
    if (isLoggedIn) {
      try {
        const res = await logoutAdmin();
        toast.success(res.message);
      } catch (error) {
        toast.error(error.message);
      } finally {
        navigate("/");
        dispatch(setLogin(false));
      }
    }
  };

  const setThemeMode = () => {
    toggleDarkMode(!darkMode);
    localStorage.setItem("food_theme_pref", !darkMode ? "dark" : "light");
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <aside
      className={`bg-gray-200 absolute md:relative md:left-0 md:top-0 overflow-hidden dark:bg-gray-900 w-64 md:max-w-64 2xl:w-[25%] 2xl:max-w-[600px] min-h-screen p-4 border-r transition-all duration-700 md:transition-none border-r-gray-500 ${
        isSidebarVisible ? "left-0 top-0 w-full z-20" : "-left-full"
      }`}
    >
      <ul className="space-y-2">
        <li
          onClick={() => setSidebarVisible(!isSidebarVisible)}
          className="md:hidden text-red-600 inline-flex items-center justify-between w-full"
        >
          <img
            src="/logo/DarkLogo.jpeg"
            alt="logoImage"
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M21 15.61L19.59 17l-5.01-5l5.01-5L21 8.39L17.44 12zM3 6h13v2H3zm0 7v-2h10v2zm0 5v-2h13v2z"
              ></path>
            </svg>
          </span>
        </li>
        <li
          onClick={() => {
            dispatch(setSearchedData([]));
            isSidebarVisible && setSidebarVisible(!isSidebarVisible);
          }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:dark:from-cyan-700 hover:dark:to-blue-800 ${
                isActive &&
                "bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-700 dark:to-blue-800"
              } `
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li
          onClick={() => {
            dispatch(setSearchedData([]));
            isSidebarVisible && setSidebarVisible(!isSidebarVisible);
          }}
        >
          <NavLink
            to="/users-admin"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-lime-500 to-green-600 hover:dark:from-lime-600 hover:dark:to-green-800 ${
                isActive &&
                "bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-600 dark:to-green-800"
              } `
            }
          >
            Users
          </NavLink>
        </li>
        <li
          onClick={() => {
            dispatch(setSearchedData([]));
            isSidebarVisible && setSidebarVisible(!isSidebarVisible);
          }}
        >
          <NavLink
            to="/users-posts-admin"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-orange-500 to-pink-600 hover:dark:from-orange-600 hover:dark:to-pink-800 ${
                isActive &&
                "bg-gradient-to-r from-orange-500 to-pink-600 dark:from-orange-600 dark:to-pink-800"
              } `
            }
          >
            Posts
          </NavLink>
        </li>

        <li
          onClick={() => {
            dispatch(setSearchedData([]));
            isSidebarVisible && setSidebarVisible(!isSidebarVisible);
          }}
        >
          <NavLink
            to="/donors-deleted-posts-admin"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-pink-500 to-purple-600 hover:dark:from-pink-600 hover:dark:to-purple-800 ${
                isActive &&
                "bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-800"
              }`
            }
          >
            Donor&apos;s deleted Posts
          </NavLink>
        </li>

        <li
          onClick={() => {
            dispatch(setSearchedData([]));
            isSidebarVisible && setSidebarVisible(!isSidebarVisible);
          }}
        >
          <NavLink
            to="/admin-analytics"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-purple-500 to-indigo-600 hover:dark:from-purple-700 hover:dark:to-indigo-800 ${
                isActive &&
                "bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800"
              } `
            }
          >
            Analytics
          </NavLink>
        </li>
        <li
          className="flex items-center gap-4 bg-slate-900  text-center py-2 px-4 rounded-3xl border border-[#cfcfcf] cursor-pointer text-slate-50 text-lg hover:bg-slate-800 duration-500 max-w-[50%] md:w-auto md:max-w-full"
          onClick={setThemeMode}
        >
          {darkMode ? (
            <p className="inline-flex items-center gap-3 ">
              <Icon
                icon="ic:round-light-mode"
                className="text-2xl text-red-600"
              />
              Light
            </p>
          ) : (
            <p className="inline-flex items-center gap-3 ">
              <Icon
                icon="tdesign:mode-dark"
                className="text-2xl text-red-600"
              />
              Dark
            </p>
          )}
        </li>
        <li
          onClick={logout}
          className="flex items-center text-slate-50 gap-4 bg-slate-900 text-lg text-center py-2 px-4 cursor-pointer rounded-3xl border border-[#cfcfcf] hover:bg-slate-800 duration-500 max-w-[50%] md:w-auto md:max-w-full"
        >
          <MdLogout />
          Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
