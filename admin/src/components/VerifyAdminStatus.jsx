import { useDispatch, useSelector } from "react-redux";
import { isAdminLoggedIn } from "../api/admin.api";
import { setLogin } from "../features/adminFeatures";
import { useContext, useEffect, useState } from "react";
import adminContext from "../store/adminContext";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import PageLoader from "./PageLoader";

const VerifyAdminStatus = ({ children }) => {
  const { toggleDarkMode } = useContext(adminContext);

  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const [statusLoader, setStatusLoader] = useState(true);

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

    console.log("Called use effect");

    checkLoginStatus()
      .then((data) => {
        if (data.statusCode === 200 && data.success === true) {
          dispatch(setLogin(true));
          setTimeout(() => {
            setStatusLoader(false);
          }, 700);
        }
      })
      .catch(() => {
        console.log("Calling catch");
        dispatch(setLogin(false));
        setTimeout(() => {
          setStatusLoader(false);
        }, 700);
      });
  }, []);

  return (
    <>
      {statusLoader ? (
        <PageLoader />
      ) : isLoggedIn ? (
        children
      ) : (
        <Navigate to="/admin-login" />
      )}
    </>
  );
};

VerifyAdminStatus.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VerifyAdminStatus;
