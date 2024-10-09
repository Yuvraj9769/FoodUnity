import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import secureLocalStorage from "react-secure-storage";

const VerifyDonor = ({ children }) => {
  return (
    <>{secureLocalStorage.getItem("donor") ? children : <Navigate to="/" />}</>
  );
};

VerifyDonor.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VerifyDonor;
