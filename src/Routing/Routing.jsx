import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "../components/layout/Main"; // Navbar + outlet
import Root from "../components/layout/Root"; // Homepage content
import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";
import Profile from "../components/layout/Profile";
import DeleteProfile from "../components/layout/DeleteProfile";
import ProtectedRoute from "./PrivateRouting/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />, // Navbar always visible
    children: [ 
      {
        index: true, // default page at "/"
        element: <Root />,
      },
      {
        path: "root/login",
        element: <Login />,
      },
      {
        path: "root/sign",
        element: <Signup />,
      },
      {
  path: "root/dashboard",
  element: <Profile />,
  children: [
    {
      path: "profile/:id/delete",   // DeleteProfile
      element: (
        <ProtectedRoute>
          <DeleteProfile />
        </ProtectedRoute>
      ),
    },
  ],
}

    ],
  },
]);

const Routing = () => <RouterProvider router={router} />;

export default Routing;
