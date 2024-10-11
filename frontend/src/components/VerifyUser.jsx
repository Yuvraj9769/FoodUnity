import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import PropTypes from "prop-types";

const VerifyUser = ({ children }) => {
  return (
    <>
      {secureLocalStorage.getItem("recipient") ? children : <Navigate to="/" />}
    </>
  );
};

VerifyUser.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VerifyUser;
