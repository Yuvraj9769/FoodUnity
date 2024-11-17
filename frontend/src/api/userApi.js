import axios from "axios";
import { SERVER } from "../utils/server";

const loginUser = async (data) => {
  try {
    const response = await axios.post(`${SERVER}/users/loginUser`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

const logoutUser = async () => {
  try {
    const response = await axios.get(`${SERVER}/users/logout`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.data.message || "Error occured while logout";
    throw new Error(errorMessage);
  }
};

const registerUser = async (data) => {
  try {
    const res = await axios.post(`${SERVER}/users/registerUser`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    const errorMessage = error.response.data.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

const sendResetPasswordMail = async (data) => {
  try {
    const response = await axios.post(`${SERVER}/users/sendMail`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error occurred while sending email";
    throw new Error(errorMessage);
  }
};

const checkLocation = async (lat, long) => {
  try {
    const res = await axios.post(
      `${SERVER}/users/location`,
      {
        lat,
        long,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    return "Error occured";
  }
};

const checkTokenExipry = async (token) => {
  try {
    const res = await axios.post(
      `${SERVER}/users/ispassword-reset-token-valid`,
      token,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error in verifying token";
    throw new Error(errorMessage);
  }
};

const updatePassword = async (data) => {
  try {
    const res = await axios.post(`${SERVER}/users/resetPassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      "Error ocuured while updating the password";
    throw new Error(errorMessage);
  }
};

const updateProfileData = async (data) => {
  try {
    const res = await axios.patch(`${SERVER}/users/updateProfile`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      "Data updation failed please try later!";
    throw new Error(errorMessage);
  }
};

const changePassword = async (data) => {
  try {
    const res = await axios.patch(`${SERVER}/users/changePassword`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Password updation failed";
    throw new Error(errorMessage);
  }
};

const getuserLocationWhileRegister = async (data) => {
  try {
    const res = await axios.post(`${SERVER}/users/getLocation`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

export {
  logoutUser,
  registerUser,
  loginUser,
  sendResetPasswordMail,
  checkLocation,
  checkTokenExipry,
  updatePassword,
  updateProfileData,
  changePassword,
  getuserLocationWhileRegister,
};
