import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/Home.jsx";
import SignUp from "../pages/Signup.jsx";
import Roomies from "../pages/Roomies.jsx";
import Calendar from "../pages/Calendar.jsx";
import Tasks from "../pages/Tasks.jsx";
import Expenses from "../pages/Expenses.jsx";
import Files from "../pages/Files.jsx";
import ErrorPage from "../pages/Error.jsx";
import Login from "../pages/Login.jsx";
import Debts from "../pages/Debts.jsx";
import Blog from "../pages/Blog.jsx";
import ShoppList from "../pages/ShoppList.jsx";

import Sidebar from "../component/Sidebar.jsx";
import LogoutButton from "../component/LogoutButton.jsx";

const Router = () => {
  return (
    <div>
      <BrowserRouter basename="">
        <Routes>
          <Route element={<SignUp />} path="/signup" />
          <Route element={<Login />} path="/" />
          <Route
            path="/*"
            element={
              <>
                <Sidebar />
                <LogoutButton />
                <Routes>
                  <Route element={<Home />} path="/home" />
                  <Route element={<Roomies />} path="/roomies" />
                  <Route element={<Calendar />} path="/calendar" />
                  <Route element={<Tasks />} path="/tasks" />
                  <Route element={<ShoppList />} path="/shoppList" />
                  <Route element={<Debts />} path="/debts" />
                  <Route element={<Expenses />} path="/expenses" />
                  <Route element={<Blog />} path="/blog" />
                  <Route element={<Files />} path="/files" />
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
