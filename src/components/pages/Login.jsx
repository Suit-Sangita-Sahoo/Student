import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateToken } from "../../auth/auth";
import { toast } from "react-toastify";
import { AuthContext } from "../../CreateContext/GlobalContext";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [serverUsers, setServerUsers] = useState([]);
  const [errorState, setErrorState] = useState(false);

  const navigate = useNavigate();
  const { setLoginStatus, setCurrentUser } = useContext(AuthContext);

  // Fetch server users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3004/teachers");
      setServerUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Could not fetch server users:", err.message);
      setServerUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Normalize email for consistent comparison
  const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : "");

  // Load all users from localStorage
  const loadLocalUsers = () => {
    let arr = [];

    try {
      const local = JSON.parse(localStorage.getItem("localUsers"));
      if (Array.isArray(local)) arr.push(...local);
    } catch (e) {}

    try {
      const current = JSON.parse(localStorage.getItem("current_user"));
      if (current && current.email) arr.push(current);
    } catch (e) {}

    return arr;
  };

  // Merge server + local users
  const buildMergedUsers = () => {
    const mergedMap = new Map();

    // Add server users
    for (const u of serverUsers) {
      if (!u || !u.email) continue;
      mergedMap.set(normalizeEmail(u.email), u);
    }

    // Override with local users
    const localUsers = loadLocalUsers();
    for (const u of localUsers) {
      if (!u || !u.email) continue;
      mergedMap.set(normalizeEmail(u.email), u);
    }

    return Array.from(mergedMap.values());
  };

  const handleForm = (e) => {
    e.preventDefault();

    const email = normalizeEmail(formData.email);
    const password = String(formData.password || "");

    if (!email || !password) {
      toast.warning("Please enter both email and password");
      return;
    }

    const allUsers = buildMergedUsers();

    const found = allUsers.find((u) => normalizeEmail(u.email) === email);

    if (!found) {
      toast.warning("User not registered");
      setErrorState(true);
      return;
    }

    const storedPassword = String(found.password || "");
    if (storedPassword === password) {
      // Ensure id exists
      if (!found.id) found.id = found.teacherid || Date.now();

      const token = generateToken(found);

      localStorage.setItem("authtoken", token);
      localStorage.setItem("current_user", JSON.stringify(found));

      setLoginStatus(true);
      setCurrentUser(found);

      toast.success("Login Successful");
      navigate("/root/dashboard");
    } else {
      setLoginStatus(false);
      setErrorState(true);
      toast.error("Incorrect password");
    }
  };

  return (
    <form onSubmit={handleForm}>
      <div className="w-[400px] h-[420px] bg-blue-400 mx-auto mt-[150px] text-white rounded-xl p-6">
        <h1 className="text-[22px] text-center font-bold mb-6">Welcome Back ⭐</h1>

        <label className="block mb-4">
          <p className="pl-[5px] mb-1">Email Address</p>
          <input
            type="text"
            name="email"
            placeholder="Enter Your Email"
            className="rounded-md w-full h-[40px] text-black px-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block mb-6">
          <p className="pl-[5px] mb-1">Password</p>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            className="rounded-md w-full h-[40px] text-black px-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="w-full h-[40px] bg-blue-800 rounded-md">
          Login
        </button>

        {errorState && <p className="text-center text-red-200 mt-2">Invalid credentials</p>}

        <div className="flex justify-center mt-[25px]">
          <p>Don't have an account?</p>
          <Link to="/root/sign" className="text-white font-bold ml-2">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
