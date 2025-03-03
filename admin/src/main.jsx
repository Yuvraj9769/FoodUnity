import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import MainDashboard from "./components/MainDashboard.jsx";
import VerifyAdminStatus from "./components/VerifyAdminStatus.jsx";
import AdminNotVerified from "./components/AdminNotVerified.jsx";
import SendMailForgetPassword from "./components/SendMailForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import DashboardUser from "./components/DashboardUser.jsx";
import UpdateUserForm from "./components/UpdateUserForm.jsx";
import PostsForAdmin from "./components/PostsForAdmin.jsx";
import Analytics from "./components/Analytics.jsx";
import DeletedDonorPosts from "./components/DeletedDonorPosts.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <VerifyAdminStatus>
        <App />
      </VerifyAdminStatus>
    ),
    children: [
      {
        path: "/",
        element: <MainDashboard />,
      },
      {
        path: "/users-admin",
        element: <DashboardUser />,
      },
      {
        path: "/user-update-data/:index",
        element: <UpdateUserForm />,
      },
      {
        path: "/users-posts-admin",
        element: <PostsForAdmin />,
      },
      {
        path: "/donors-deleted-posts-admin",
        element: <DeletedDonorPosts />,
      },
      {
        path: "/admin-analytics",
        element: <Analytics />,
      },
    ],
  },
  {
    path: "/admin-login",
    element: (
      <AdminNotVerified>
        <LoginForm />
      </AdminNotVerified>
    ),
  },
  {
    path: "/admin-register",
    element: (
      <AdminNotVerified>
        <RegistrationForm />
      </AdminNotVerified>
    ),
  },
  {
    path: "/admin-forget-password",
    element: (
      <AdminNotVerified>
        <SendMailForgetPassword />
      </AdminNotVerified>
    ),
  },
  {
    path: "/admin-reset-password/:token",
    element: (
      <AdminNotVerified>
        <ResetPassword />
      </AdminNotVerified>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </StrictMode>
);
