import React from "react";
import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const VerifyDonor = ({ children }) => {
  return (
    <>{secureLocalStorage.getItem("donor") ? children : <Navigate to="/" />}</>
  );
};

export default VerifyDonor;
