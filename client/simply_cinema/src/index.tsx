import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Showing from "./pages/Showing";
import ComingSoon from "./pages/ComingSoon";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Showtiming from "./pages/Showtiming";
import SeatMap from "./pages/SeatMap";

import Admin from "./pages/Admin";
import OrderSummary from "./pages/OrderSummary";
import OrderConfirmation from "./pages/OrderConfirmation";
import EditProfile from "./pages/Editprofile";
import Checkout from "./pages/Checkout";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import { UserProvider } from "./pages/UserContext";
import OrderHistory from "./pages/OrderHistory";
import MovieScheduler from "./pages/MovieScheduler";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/showing",
    element: <Showing />,
  },
  {
    path: "/coming-soon",
    element: <ComingSoon />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/order-summary",
    element: <OrderSummary />,
  },
  {
    path: "/order-confirmation",
    element: <OrderConfirmation />,
  },
  {
    path: "/forgot-password",
    element: <ForgetPassword />,
  },
  {
    path: "/Editprofile",
    element: <EditProfile />,
  },
  {
    path: "/showtiming/:movieId/:date",
    element: <Showtiming />,
  },
  {
    path: "/SeatMap/:movieId/:formattedDate/:selectedTime/:selectedTheater",
    element: <SeatMap />,
  },
  {
    path: "/OrderHistory",
    element: <OrderHistory />,
  },
  {
    path: ".MovieScheduler",
    element: <MovieScheduler />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
