import { useContext } from "react";
import adminContext from "../store/adminContext";
import { useEffect } from "react";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const { darkMode, toggleDarkMode, isSidebarVisible, setSidebarVisible } =
    useContext(adminContext);

  const changeTheme = () => {
    toggleDarkMode(!darkMode);
    localStorage.setItem("food_theme_pref", !darkMode ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-2 rounded-md">
      <div className="max-w-7xl 2xl:max-w-full mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard
        </div>
        <div className="md:flex items-center hidden">
          <label
            htmlFor="toggle-mode"
            onClick={changeTheme}
            className="cursor-pointer text-red-600 text-lg"
          >
            {darkMode ? (
              <Icon icon="ic:round-light-mode" className="text-2xl" />
            ) : (
              <Icon icon="tdesign:mode-dark" className="text-2xl" />
            )}
          </label>
        </div>
        <div className="flex items-center md:hidden">
          <label
            htmlFor="toggle-mode"
            onClick={() => setSidebarVisible(!isSidebarVisible)}
            className="cursor-pointer text-red-600"
          >
            <span className="text-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3 6h10v2H3zm0 10h10v2H3zm0-5h12v2H3zm13-4l-1.42 1.39L18.14 12l-3.56 3.61L16 17l5-5z"
                ></path>
              </svg>
            </span>
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
