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

export { isAdminLoggedIn };
