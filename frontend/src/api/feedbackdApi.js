import axios from "axios";
import { SERVER } from "../utils/server";

const getUserFeedback = async (data) => {
  try {
    const res = await axios.post(`${SERVER}/feedback/userfeedback`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Feedback submission failed.";
    throw new Error(errorMessage);
  }
};

export { getUserFeedback };
