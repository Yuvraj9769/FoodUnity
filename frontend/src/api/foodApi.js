import axios from "axios";
import { SERVER } from "../utils/server";

const createFoodPost = async (data) => {
  try {
    const res = await axios.post(`${SERVER}/foods/post`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

const getDonorPostedPosts = async () => {
  try {
    const res = await axios.get(`${SERVER}/foods/getcreatedposts`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

const getAllPostsForUser = async () => {
  try {
    const res = await axios.get(`${SERVER}/foods/getfoodPosts`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

const sendOrderReuest = async (id) => {
  try {
    const res = await axios.post(
      `${SERVER}/request/sendrequest`,
      { id },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

const getDonorsRequests = async (uid, fid) => {
  try {
    const res = await axios.get(
      `${SERVER}/request/notifications/${uid}/${fid}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error occurred please try later";
    throw new Error(errorMessage);
  }
};

const getDonorsAllNotifications = async () => {
  try {
    const res = await axios.get(`${SERVER}/request/getdonorsallnotifications`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error occurred please try later";
    throw new Error(errorMessage);
  }
};

const rejectOrAcceptRequest = async (data) => {
  try {
    const res = await axios.post(`${SERVER}/request/donor-req-activity`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error occurred please try later";
    throw new Error(errorMessage);
  }
};

const verifyUserOTP = async (otp, donorUsername) => {
  try {
    const res = await axios.post(
      `${SERVER}/foods/verify-otp`,
      { otp, donorUsername },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error occurred please try later";
    throw new Error(errorMessage);
  }
};

const isLoggedIn = async () => {
  try {
    const res = await axios.get(`${SERVER}/users/checkislogin`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Not Logged in";
    throw new Error(errorMessage);
  }
};

const deleteFoodPost = async (delId) => {
  try {
    const res = await axios.patch(
      `${SERVER}/foods/deletePost`,
      { delId },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Food post deletion failed";
    return errorMessage;
  }
};

export {
  createFoodPost,
  getDonorPostedPosts,
  getAllPostsForUser,
  sendOrderReuest,
  getDonorsRequests,
  getDonorsAllNotifications,
  rejectOrAcceptRequest,
  verifyUserOTP,
  isLoggedIn,
  deleteFoodPost,
};
