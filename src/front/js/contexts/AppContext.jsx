import React, { createContext, useContext, useState, useEffect } from "react";

import authProfile from "../services/authProfile";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (token && token !== "" && token !== undefined) {
      setAuthenticated(true);
    }
  }, [token]);

  const login = async (email, password, navigate) => {
    try {
      const response = await authProfile.login(email, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("roomieId", response.roomie_id);
      localStorage.setItem("isAdmin", response.is_admin);
      setAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("roomieId");
      localStorage.removeItem("isAdmin");
      setAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const signup = async (email, password, first_name, navigate) => {
    if (!email || !password || !first_name) {
      console.error("Algún campo no es correcto");
      return;
    }
    try {
      const response = await authProfile.signup(email, password, first_name);
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const store = {
    token,
    userId,
  };
  const actions = {
    login,
    signup,
    logout,
  };

  return (
    <AppContext.Provider value={{ store, actions }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
