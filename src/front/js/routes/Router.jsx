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

import { Navbar } from "../component/navbar.js";

const Router = () => {
  return (
    <div>
      <BrowserRouter basename="">
        <Navbar />
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<SignUp />} path="/Signup" />
          <Route element={<Login />} path="/Login" />
          <Route element={<Roomies />} path="/Roomies" />
          <Route element={<Calendar />} path="/Calendar" />
          <Route element={<Tasks />} path="/Tasks" />
          <Route element={<ShoppList />} path="/ShoppList" />
          <Route element={<Debts />} path="/Debts" />
          <Route element={<Expenses />} path="/Expenses" />
          <Route element={<Blog />} path="/Blog" />
          <Route element={<Files />} path="/Files" />
          <Route element={<ErrorPage />} path="*" />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
