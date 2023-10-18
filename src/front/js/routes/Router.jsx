import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAppContext from "../contexts/AppContext.jsx";

import Home from "../pages/Home.jsx";
import SignUp from "../pages/Signup.jsx";
import Roomies from "../pages/Roomies.jsx";
import Profile from "../pages/Profile.jsx";
import Calendar from "../pages/Calendar.jsx";
import Tasks from "../pages/Tasks.jsx";
import Expenses from "../pages/Expenses.jsx";
import Files from "../pages/Files.jsx";
import ErrorPage from "../pages/Error.jsx";
import Login from "../pages/Login.jsx";
import Debts from "../pages/Debts.jsx";
import Blog from "../pages/Blog.jsx";
import ShopList from "../pages/ShopList.jsx";

import Sidebar from "../component/Sidebar.jsx";

const Router = () => {
  const { store } = useAppContext();

  return (
    <div>
      <BrowserRouter basename="">
        <Routes>
          {!store.token && <Route element={<SignUp />} path="/signup" />}
          {!store.token && <Route element={<Login />} path="/" />}
          <Route
            path="/*"
            element={
              <>
                {store.token && <Sidebar />}
                <Routes>
                  {store.token ? (
                    <>
                      <Route element={<Home />} path="/home" />
                      <Route element={<Profile />} path="/profile" />
                      <Route element={<Roomies />} path="/roomies" />
                      <Route element={<Calendar />} path="/calendar" />
                      <Route element={<Tasks />} path="/tasks" />
                      <Route element={<ShopList />} path="/shoplist" />
                      <Route element={<Debts />} path="/debts" />
                      <Route element={<Expenses />} path="/expenses" />
                      <Route element={<Blog />} path="/blog" />
                      <Route element={<Files />} path="/files" />
                    </>
                  ) : (
                    <Navigate to="/" />
                  )}
                  <Route element={<ErrorPage />} path="*" />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
