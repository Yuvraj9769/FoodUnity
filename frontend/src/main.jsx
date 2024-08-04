import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoggedNotComponent from "./components/LoggedNotComponent.jsx";
import LoginUsingEmail from "./components/LoginUsingEmail.jsx";
import RegisterUser from "./components/RegisterUser.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import LoginOrSignupForm from "./components/LoginOrSignupForm.jsx";
import Home from "./components/Home.jsx";
import Services from "./components/Services.jsx";
import HowItWOrks from "./components/HowItWOrks.jsx";
import EmailSender from "./components/EmailSender.jsx";
import CreateFoodPost from "./components/CreateFoodPost.jsx";
import FoodCards from "./components/FoodCards.jsx";
import NotFound from "./components/NotFound.jsx";
import VerifyDonor from "./components/VerifyDonor.jsx";
import VerifyUser from "./components/VerifyUser.jsx";
import DonorRecievedRequests from "./components/DonorRecievedRequests.jsx";
import FoodCardsUsers from "./components/FoodCardsUsers.jsx";
import DonorsAllNotifications from "./components/DonorsAllNotifications.jsx";
import VerifyFoodPostOTP from "./components/VerifyFoodPostOTP.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/works",
        element: <HowItWOrks />,
      },
      {
        path: "/doPost",
        element: (
          <VerifyDonor>
            <CreateFoodPost />
          </VerifyDonor>
        ),
      },
      {
        path: "/posts",
        element: (
          <VerifyDonor>
            <FoodCards />
          </VerifyDonor>
        ),
      },
      {
        path: "/getposts",
        element: (
          <VerifyUser>
            <FoodCardsUsers />
          </VerifyUser>
        ),
      },
      {
        path: "/foods/notifications/:uid/:fid",
        element: (
          <VerifyDonor>
            <DonorRecievedRequests />
          </VerifyDonor>
        ),
      },
      {
        path: "/foods/notifications",
        element: (
          <VerifyDonor>
            <DonorsAllNotifications />
          </VerifyDonor>
        ),
      },
      {
        path: "/foods/VerifyOTP",
        element: (
          <VerifyDonor>
            <VerifyFoodPostOTP />
          </VerifyDonor>
        ),
      },
      {
        path: "/login",
        element: (
          <LoggedNotComponent>
            <LoginOrSignupForm />
          </LoggedNotComponent>
        ),
      },
      {
        path: "/loginemail",
        element: (
          <LoggedNotComponent>
            <LoginUsingEmail />
          </LoggedNotComponent>
        ),
      },
      {
        path: "/register",
        element: (
          <LoggedNotComponent>
            <RegisterUser />
          </LoggedNotComponent>
        ),
      },
      {
        path: "/emailSender",
        element: <EmailSender />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
