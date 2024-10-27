import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginOrSignupForm from "../../frontend/src/components/LoginOrSignupForm.jsx";
import LoginUsingEmail from "../../frontend/src/components/LoginUsingEmail.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "/admin-login-username",
    element: <LoginOrSignupForm />,
  },
  {
    path: "/admin-login-email",
    element: <LoginUsingEmail />,
  },
  {
    path: "/admin-register",
    element: <RegistrationForm />,
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
