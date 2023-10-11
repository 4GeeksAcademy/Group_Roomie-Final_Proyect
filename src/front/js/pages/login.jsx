import React, { useContext, useState, ReactDOM } from "react";
import { Context } from "../store/appContext";

import "../../styles/home.css";


export const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = () => {
		actions.login(email, password);
	}

    return (
        <>
        <div className="login d-flex justify-content-center  align-items-center  flex-column gap-2 ">
        <h1>Log in</h1>
        <form className="d-flex  flex-column gap-3">
            <label htmlFor="email" >Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email"/>
            <label  htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
            <button onClick={handleSubmit}> Log in </button>
        </form>
        <button className="link-btn mt-3">Don't have an account? Sign up here.</button>
        </div>
        </>
    )
}