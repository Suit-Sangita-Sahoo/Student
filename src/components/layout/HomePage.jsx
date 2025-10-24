import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../CreateContext/GlobalContext";

const HomePage = () => {
  const { loginStatus, current_user, setCurrentUser, setLoginStatus } = useContext(AuthContext);

  
  const firstLetter = current_user?.teachername?.[0]?.toUpperCase() || "";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    setCurrentUser(null);
    setLoginStatus(false);
    navigate("/root/login");
  };

  return (
    <div>
      <nav className="w-full h-[60px] bg-gray-50 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="w-[70px] h-[40px] bg-zinc-900 text-white rounded- "
          >
            Logout
          </button>
          {current_user?.teachername && (
            <p className="font-bold text-blue-700 text-xl capitalize">
              {current_user.teachername}
            </p>
          )}
        </div>

        <ul className="flex gap-6 font-bold text-blue-950 pl-[800px]">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/root/dashboard">Dashboard</Link></li>
        </ul>

        <div>
          {loginStatus ? (
            <span className="bg-red-500 px-5 py-3 font-bold text-blue-900 rounded-full shadow-lg capitalize">
              {firstLetter}
            </span>
          ) : (
            <Link
              to="/root/login"
              className="px-4 py-2 rounded-lg bg-blue-950 text-white font-bold"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default HomePage;
