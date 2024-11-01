import axios from "axios";
import { SERVER } from "../utils/server";

const getAllUsersData = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/getAllUserForAdmin`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const deleteUserAsAdminPrevilage = async (id) => {
  try {
    const response = await axios.delete(`${SERVER}/admin/deleteUser/${id}`, {
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

const updateUserDataAsAdminPrivilage = async (data) => {
  try {
    const response = await axios.patch(`${SERVER}/admin/updateUser`, data, {
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

const searchUserForAdmin = async (data) => {
  try {
    const response = await axios.post(
      `${SERVER}/admin/searchuserForAdmin`,
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

const getAllDonorAndRecipients = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/usersWithCategory`, {
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
  getAllUsersData,
  deleteUserAsAdminPrevilage,
  updateUserDataAsAdminPrivilage,
  searchUserForAdmin,
  getAllDonorAndRecipients,
};
