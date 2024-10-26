import { useState } from "react";
import MainDashboard from "./components/MainDashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import adminContext from "./store/adminContext";
import Footer from "./components/Footer";

function App() {
  const [darkMode, toggleDarkMode] = useState(true);

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
