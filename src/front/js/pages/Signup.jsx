import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAppContext from "../contexts/AppContext.jsx";

import bgregister from "../../img/bgregister.png";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const {
    actions: { signup },
  } = useAppContext();

  const handleChangeEmail = (e) => {
    const email = e.target.value;
    setFormData({
      ...formData,
      email: email,
    });
  };

  const handleChangePassword = (e) => {
    const password = e.target.value;
    setFormData({
      ...formData,
      password: password,
    });
  };

  const handleChangeFirstName = (e) => {
    const first_name = e.target.value;
    setFormData({
      ...formData,
      first_name: first_name,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, first_name } = formData;
    if (email && password && first_name) {
      signup(email, password, first_name, navigate);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-0 m-0"
      style={{
        backgroundImage: `url(${bgregister})`,
        backgroundSize: "100% 100%",
        height: "100vh",
      }}
    >
      <div className="w-96">
        <div className="bg-slate-100 shadow-md rounded-md p-6">
          <h2 className="text-center text-2xl font-bold mb-2 pt-5 text-gray-700">
            Crea tu cuenta
          </h2>
          <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>
            <div className="flex flex-col pt-4">
              <label htmlFor="text" className="text-lg">
                Nombre
              </label>
              <input
                type="text"
                id="first_name"
                placeholder="Nombre"
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-900 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChangeFirstName}
              />
            </div>
            <div className="flex flex-col pt-4">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-900 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChangeEmail}
              />
            </div>
            <div className="flex flex-col pt-4">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <div className="mb-5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className="px-3 py-3 shadow appearance-none border rounded-md w-full text-gray-900 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChangePassword}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fa-solid text-indigo-900 ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    }`}
                  />
                </button>
              </div>
            </div>
            <button
              type="submit"
              value="signup"
              className="bg-indigo-900 text-white font-bold text-lg hover:bg-indigo-500 p-2 mt-8 rounded-lg"
              onClick={handleSubmit}
            >
              Crear{" "}
            </button>
          </form>
          <div className="text-center my-4">
            <div>
              <span>¿Ya tienes cuenta? </span>
              <Link to="/" className="text-indigo-900 font-semibold rounded-lg">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
