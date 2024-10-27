import { useState } from "react";
import MainDashboard from "./components/MainDashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import adminContext from "./store/adminContext";
import Footer from "./components/Footer";
import toast from "react-hot-toast";
import { isAdminLoggedIn } from "./api/admin.api";
import { useDispatch } from "react-redux";
import { setLogin } from "./features/adminFeatures";

function App() {
  const [darkMode, toggleDarkMode] = useState(true);

  const dispatch = useDispatch();

  const checkLoginStatus = async () => {
    try {
      const res = await isAdminLoggedIn();
      return res.data;
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
        console.log("Useeffect data = ", data);
        dispatch(setLogin(true));
      })
      .catch((error) => {
        toast.error(error.message);
        console.log("useEffect error = ", error);
      });
  }, []);

  return (
    <adminContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="flex h-screen dark:bg-gray-900 bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <MainDashboard />
          <Footer />
        </div>
      </div>
    </adminContext.Provider>
  );
}

export default App;
