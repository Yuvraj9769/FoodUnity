import axios from "axios";
import { SERVER } from "../utils/server";

const isAdminLoggedIn = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/checkLogin`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const register_Admin = async (data) => {
  try {
    const response = await axios.post(`${SERVER}/admin/register`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const login_Admin = async (data) => {
  try {
    const response = await axios.post(`${SERVER}/admin/login`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const sendForgetPasswordMail = async (data) => {
  try {
    const response = await axios.post(`${SERVER}/admin/reset-password`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const checkTokenExpiry = async (data) => {
  try {
    const response = await axios.post(`${SERVER}/admin/check-token-exp`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const resetAdminPassword = async (data) => {
  try {
    const response = await axios.post(
      `${SERVER}/admin/reset-admin-password`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const logoutAdmin = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/logout-admin`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

export {
  isAdminLoggedIn,
  register_Admin,
  login_Admin,
  sendForgetPasswordMail,
  checkTokenExpiry,
  resetAdminPassword,
  logoutAdmin,
};
