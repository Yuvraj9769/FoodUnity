import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  setDarkMode,
  setIsLoggedIn,
  setPostData,
  setSearchedData,
} from "./features/foodUnity";
import PageLoader from "./components/PageLoader";
import secureLocalStorage from "react-secure-storage";
import {
  getAllPostsForUser,
  getDonorPostedPosts,
  searchDataQuery,
  searchNotification,
  searchUserHistory,
  searchUserRequestData,
  serchPostForUser,
} from "./api/foodApi";
import toast from "react-hot-toast";
import Footer from "./components/Footer";
import searchContext from "./store/searchContext.js";

function App() {
  const userData = useSelector((state) => state.userData);
  const postData = useSelector((state) => state.postData);
  const searchedData = useSelector((state) => state.searchedData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isJWTExpired, setIsJWTExpired] = useState(false);

  const location = useLocation();

  const [searchData, setSearchData] = useState({
    searchQuery: "",
  });

  const [isFilterOn, checkandSetFilter] = useState(false);

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (searchedData.length !== 0 && value.length === 0) {
      setSearchData({ searchQuery: "" });
      dispatch(setSearchedData([]));
    }

    setSearchData((preData) => ({ ...preData, searchQuery: value }));
  };

  const checkKey = async (e) => {
    if (!isFilterOn) {
      if (
        e.key === "Enter" &&
        location.pathname === "/posts" &&
        Object.keys(searchData.searchQuery).length !== 0
      ) {
        try {
          const res = await searchDataQuery(searchData);
          if (res.statusCode === 200 && res.success) {
            dispatch(setSearchedData(res.data));
          }
        } catch (error) {
          toast.error(error.message);
        }
      } else if (
        e.key === "Enter" &&
        location.pathname === "/foods/notifications" &&
        Object.keys(searchData.searchQuery).length !== 0
      ) {
        try {
          const res = await searchNotification(searchData);
          if (res.statusCode === 200 && res.success) {
            dispatch(setSearchedData(res.data));
          }
        } catch (error) {
          toast.error(error.message);
        }
      } else if (
        e.key === "Enter" &&
        location.pathname === "/getposts" &&
        Object.keys(searchData.searchQuery).length !== 0
      ) {
        try {
          const res = await serchPostForUser(searchData);
          if (res.statusCode === 200 && res.success) {
            dispatch(setSearchedData(res.data));
          }
        } catch (error) {
          toast.error(error.message);
        }
      } else if (
        e.key === "Enter" &&
        location.pathname === "/foods/requestsData" &&
        Object.keys(searchData.searchQuery).length !== 0
      ) {
        try {
          const res = await searchUserRequestData(searchData);
          if (res.statusCode === 200 && res.success) {
            dispatch(setSearchedData(res.data));
          }
        } catch (error) {
          toast.error(error.message);
        }
      } else if (
        e.key === "Enter" &&
        location.pathname === "/postHistory" &&
        Object.keys(searchData.searchQuery).length !== 0
      ) {
        try {
          const res = await searchUserHistory(searchData);
          if (res.statusCode === 200 && res.success) {
            dispatch(setSearchedData(res.data));
          }
        } catch (error) {
          toast.error(error.message);
        }
      } else if (
        e.key === "Enter" &&
        location.pathname.startsWith("/foods/notifications/") &&
        location.pathname.split("/foods/notifications/ ").length === 1 &&
        Object.keys(searchData.searchQuery).length !== 0
      ) {
        toast.error("Search is unavailable, there's only one post.");
      }
    } else {
      if (e.key === "Enter") {
        toast.error("Please clear the filter before proceeding");
      }
    }
  };

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
    <div className="flex flex-col items-center gap-4 dark:bg-slate-950 bg-slate-50 h-full">
      {loading ? (
        <PageLoader />
      ) : (
        <searchContext.Provider
          value={{
            searchData,
            setSearchData,
            handleOnChange,
            checkKey,
            isFilterOn,
            checkandSetFilter,
          }}
        >
          <Navbar setIsJWTExpired={setIsJWTExpired} />
          <div className="min-h-screen my-2">
            <Outlet />
          </div>
          <Footer />
        </searchContext.Provider>
      )}
    </div>
  );
}

export default App;
