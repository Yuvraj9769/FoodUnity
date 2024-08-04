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
    // console.log(res.data.data.results[0].annotations.OSM.url);
    console.log(res.data);
    return res.data;
  } catch (error) {
    return "Error occured";
  }
};

export {
  logoutUser,
  registerUser,
  loginUser,
  sendResetPasswordMail,
  checkLocation,
};
