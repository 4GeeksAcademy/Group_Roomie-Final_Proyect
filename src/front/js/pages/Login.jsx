import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAppContext from "../contexts/AppContext.jsx";

import logo from "../../img/logo.png";
import mockup from "../../img/mockup.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    actions: { login },
  } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password, navigate);
    }
  };

  return (
    <div className="w-full flex flex-wrap bg-slate-100 h-screen">
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex justify-center pt-12 md:-mb-24">
          <img className="w-60 h-15" src={logo} alt="logo" />
        </div>

        <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
          <p className="text-center text-2xl font-bold text-gray-700">
            ¡Hola de nuevo!
          </p>
          <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>
            <div className="flex flex-col pt-4">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-900 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
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
              type="button"
              value="login"
              className="bg-indigo-900 text-white font-bold text-lg hover:bg-indigo-500 p-2 mt-8 rounded-lg"
              onClick={handleSubmit}
            >
              Entrar{" "}
            </button>
          </form>
          <div className="text-center pt-12 pb-12">
            <p>
              ¿Aún no tienes cuenta?{" "}
              <Link to="/signup" className="underline font-semibold">
                Regístrate aquí.
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 shadow-2xl">
        <img
          className="object-cover w-full h-screen hidden md:block"
          src={mockup}
        />
      </div>
    </div>
  );
};

export default Login;
