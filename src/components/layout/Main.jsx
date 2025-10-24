import React from "react";
import { Outlet } from "react-router-dom";
import Root from "./Root"; // ✅ import your React layout component (not from postcss)
import HomePage from "./HomePage";

const Main = () => {
  return (
    <div>
        <HomePage/>
        <Outlet/>
     
    </div>
  );
};

export default Main;
