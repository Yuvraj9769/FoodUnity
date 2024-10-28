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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </StrictMode>
);
