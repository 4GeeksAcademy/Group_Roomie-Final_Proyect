import React, { useContext, useState, ReactDOM } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import "../../styles/home.css";

export const Signup = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");



	const token = sessionStorage.getItem("token");

	const handleSubmit = () => {
		actions.signup(email, password, firstName, lastName);
	}



	return (
		<>
			<div className="signup">
				<form className="text-center ">
					<h1>Sign up</h1>
					<div className="d-flex justify-content-center  align-items-center  flex-column gap-2">
						<label htmlFor="firstname" >First Name</label>
						<input type="text" placeholder="first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
						<label htmlFor="lastname" >Last Name</label>
						<input type="text" placeholder="last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
						<label htmlFor="email" >Email</label>
						<input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="password">Password</label>
						<input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<button onClick={handleSubmit}> Sign up </button>
					</div>
					<button className="link-btn mt-3">Already have an account? Log in here.</button>
				</form>
			</div>
		</>

	);
};
