import React from "react";
import secureLocalStorage from "react-secure-storage";
import LoginOrSignupForm from "./LoginOrSignupForm";

const ConditionalWrapper = ({ children }) => {
  const user = secureLocalStorage.getItem("user");

  return <>{user ? children : <LoginOrSignupForm />}</>;
};

export default ConditionalWrapper;
