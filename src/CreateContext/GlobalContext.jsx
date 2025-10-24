import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const GlobalContext = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [current_user, setCurrentUser] = useState(null);
  const token = localStorage.getItem("authtoken");
const user = JSON.parse(localStorage.getItem("current_user"));

  useEffect(() => {
    

    if (token) {
      setLoginStatus(true);
      setCurrentUser(user)
      
    } else {
      setLoginStatus(false);
      setCurrentUser(null)
      
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ loginStatus, setLoginStatus, current_user, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default GlobalContext;
