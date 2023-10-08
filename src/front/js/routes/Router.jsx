import { BrowserRouter, Route, Routes } from "react-router-dom";


import Home  from "../pages/Home.jsx";
import SignUp from "../pages/Signup.jsx";
import SignIn from "../pages/Login.jsx";
import Roomies from "../pages/Roomies.jsx";
import Calendar from "../pages/Calendar.jsx";
import Tasks from "../pages/Tasks.jsx"
import Purchase from "../pages/Debts.jsx";
import Expenses from "../pages/Expenses.jsx";
import Updates from "../pages/Blog.jsx";
import Files from "../pages/Files.jsx";
import ErrorPage from "../pages/Error.jsx";


const Router = () => {
    return (
        <div>
            <BrowserRouter basename="">
                    <Navbar/>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<SignUp />} path="/Signup.jsx" />
                        <Route element={<SignIn />} path="/Signin" />
                        <Route element={<Roomies />} path="/roomies" />
                        <Route element={<Calendar />} path="/calendar" />
                        <Route element={<Tasks />} path="/tasks" />
                        <Route element={<Purchase />} path="/purchase" />
                        <Route element={<Expenses />} path="/expenses" />
                        <Route element={<Updates />} path="/updates" />
                        <Route element={<Files />} path="/files" />
                        <Route element={<Profile />} path="/roomies/:theid" />
                        <Route element={ <ErrorPage/>} />
                    </Routes>
            </BrowserRouter>
        </div>
    );
};

export default Router;
