import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import adminContext from "./store/adminContext";
import Footer from "./components/Footer";
import { isAdminLoggedIn } from "./api/admin.api";
import { useDispatch } from "react-redux";
import { setLogin } from "./features/adminFeatures";
import { Outlet } from "react-router-dom";

function App() {
  const [darkMode, toggleDarkMode] = useState(true);

  const dispatch = useDispatch();

  const checkLoginStatus = async () => {
    try {
      const res = await isAdminLoggedIn();
      return res;
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    function setClassByOSMode() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.className = "dark";
        toggleDarkMode(true);
      } else {
        document.documentElement.className = "light";
        toggleDarkMode(false);
      }
    }

    setClassByOSMode();

    checkLoginStatus()
      .then((data) => {
        if (data.statusCode === 200 && data.success === true) {
          dispatch(setLogin(true));
        }
      })
      .catch(() => {
        dispatch(setLogin(false));
      });
  }, []);

  return (
    <adminContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="flex h-screen dark:bg-gray-900 bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <Outlet />
          <Footer />
        </div>
      </div>
    </adminContext.Provider>
  );
}

export default App;
