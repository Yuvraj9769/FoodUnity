import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  loading: false,
  postsData: [],
  usersData: [],
  adminData: [],
  searchedData: [],
  graphData: [{}, {}],
  lineChartGraphData: [],
  barChartGraphData: [],
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
    setSearchedData: (state, action) => {
      state.searchedData = action.payload;
    },
    setGraphData: (state, action) => {
      state.graphData = action.payload;
    },
    setLineChartGraphData: (state, action) => {
      state.lineChartGraphData = action.payload;
    },
    setBarChartGraphData: (state, action) => {
      state.barChartGraphData = action.payload;
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
  setSearchedData,
  setGraphData,
  setLineChartGraphData,
  setBarChartGraphData,
} = adminSlice.actions;

export default adminSlice.reducer;
