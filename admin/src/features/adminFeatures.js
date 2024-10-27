import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  loading: false,
  postsData: [],
  usersData: [],
  adminData: [],
  donorsData: [],
  recipientsData: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPostsData: (state, action) => {
      state.postsData = action.payload;
    },
    setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
    setAdminData: (state, action) => {
      state.adminData = action.payload;
    },
    setDonorsData: (state, action) => {
      state.donorsData = action.payload;
    },
    setRecipientsData: (state, action) => {
      state.recipientsData = action.payload;
    },
  },
});

export const {
  setLogin,
  setLoading,
  setPostsData,
  setUsersData,
  setAdminData,
  setDonorsData,
  setRecipientsData,
} = adminSlice.actions;

export default adminSlice.reducer;
