import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  setDarkMode,
  setIsLoggedIn,
  setPostData,
} from "./features/foodUnity";
import PageLoader from "./components/PageLoader";
import secureLocalStorage from "react-secure-storage";
import { getAllPostsForUser, getDonorPostedPosts } from "./api/foodApi";
import toast from "react-hot-toast";
import Footer from "./components/Footer";

function App() {
  const userData = useSelector((state) => state.userData);
  const postData = useSelector((state) => state.postData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isJWTExpired, setIsJWTExpired] = useState(false);

  useEffect(() => {
    function setClassByOSMode() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.className = "dark";
        dispatch(setDarkMode(true));
      } else {
        document.documentElement.className = "light";
        dispatch(setDarkMode(false));
      }
    }

    setClassByOSMode();

    const user = secureLocalStorage.getItem("user");
    const donor = secureLocalStorage.getItem("donor");

    setTimeout(() => {
      if (!isJWTExpired) {
        if (user || donor) {
          dispatch(setIsLoggedIn(true));
          if (userData.length === 0) dispatch(getUserData());
        } else {
          dispatch(setIsLoggedIn(false));
        }
        setLoading(false);
      }
    }, 700);
  }, []);

  useEffect(() => {
    if (isJWTExpired) return;

    const donor = secureLocalStorage.getItem("donor");

    if (donor) {
      getDonorPostedPosts()
        .then((data) => {
          dispatch(setPostData(data));
        })
        .catch((err) => {
          if (err.message === "Please login first") {
            dispatch(setIsLoggedIn(false));
            secureLocalStorage.removeItem("user");
            secureLocalStorage.removeItem("donor");
            secureLocalStorage.removeItem("recipient");
            setIsJWTExpired(true);
          } else {
            toast.error(err.message);
          }
        });
    }

    if (secureLocalStorage.getItem("recipient") && postData.length === 0) {
      getAllPostsForUser()
        .then((data) => {
          dispatch(setPostData(data));
        })
        .catch((err) => {
          if (err.message !== "Please login first") {
            toast.error(err.message);
          }
        });
    }
  }, [userData, isJWTExpired]);

  return (
    <div className="flex flex-col items-center gap-4 dark:bg-slate-950 bg-slate-50 min-h-screen">
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Navbar setIsJWTExpired={setIsJWTExpired} />
          <div className="min-h-screen">
            <Outlet />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
