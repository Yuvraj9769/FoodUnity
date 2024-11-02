import axios from "axios";
import { SERVER } from "../utils/server";

const getAllFoodPostsForAdmin = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/getAllPosts`, {
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

const searchPost = async (data) => {
  try {
    const response = await axios.post(`${SERVER}/admin/getSearchedPost`, data, {
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

const deletePostAsAdminPrevilage = async (data) => {
  try {
    const response = await axios.delete(
      `${SERVER}/admin/deletePostAdmin/${data}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Sorry something went wrong";
    throw new Error(errorMessage);
  }
};

const getAllFoodPostsMonthWise = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/monthWisePosts`, {
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

const getDeliveredPosts = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/deliveredPosts`, {
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

const requestPendingPosts = async () => {
  try {
    const response = await axios.get(`${SERVER}/admin/reqPendingPosts`, {
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

export {
  getAllFoodPostsForAdmin,
  searchPost,
  deletePostAsAdminPrevilage,
  getAllFoodPostsMonthWise,
  getDeliveredPosts,
  requestPendingPosts,
};
