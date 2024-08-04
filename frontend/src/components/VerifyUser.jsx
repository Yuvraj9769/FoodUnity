import React from "react";
import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const VerifyUser = ({ children }) => {
  console.log(secureLocalStorage.getItem("recipient"));

  return (
    <>
      {secureLocalStorage.getItem("recipient") ? children : <Navigate to="/" />}
    </>
  );
};

export default VerifyUser;
