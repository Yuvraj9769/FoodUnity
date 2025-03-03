import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const LoggedNotComponent = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex justify-center items-center font-semibold w-screen lg:w-auto">
      {!isLoggedIn && children}
    </div>
  );
};

LoggedNotComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoggedNotComponent;
