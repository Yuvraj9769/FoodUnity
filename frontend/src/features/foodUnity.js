import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER } from "../utils/server";
import secureLocalStorage from "react-secure-storage";

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await axios.get(`${SERVER}/users/getData`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        error: error.message,
        message: error.message,
        status: error.response ? error.response.status : null,
        success: false,
      });
    }
  }
);

const initialState = {
  userData: [],
  error: null,
  darkMode: false,
  loading: false,
  isLoggedIn: false,
  profile: false,
  siderbarvisible: false,
  location: null,
  postData: [],
};

const foodUnity = createSlice({
  initialState,
  name: "healthIntel",
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setSidebarVisible: (state, action) => {
      state.siderbarvisible = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setPostData: (state, action) => {
      state.postData = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.error = action.payload;
        state.userData = [];
        state.isLoggedIn = false;
        secureLocalStorage.removeItem("user");
        secureLocalStorage.removeItem("donor");
        secureLocalStorage.removeItem("recipient");
        console.clear();
      });
  },
});

export const {
  setDarkMode,
  setLoading,
  setIsLoggedIn,
  setProfile,
  setSidebarVisible,
  setLocation,
  setPostData,
} = foodUnity.actions;

export default foodUnity.reducer;
