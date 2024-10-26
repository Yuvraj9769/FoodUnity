import { useContext } from "react";
import adminContext from "../store/adminContext";
import { useEffect } from "react";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(adminContext);

  useEffect(() => {
    document.documentElement.className = darkMode ? "dark" : "light";
  });

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-2 rounded-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard
        </div>
        <div className="flex items-center">
          <label
            htmlFor="toggle-mode"
            onClick={() => toggleDarkMode(!darkMode)}
            className="cursor-pointer text-red-600 text-lg"
          >
            {darkMode ? (
              <Icon icon="ic:round-light-mode" className="text-2xl" />
            ) : (
              <Icon icon="tdesign:mode-dark" className="text-2xl" />
            )}
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
