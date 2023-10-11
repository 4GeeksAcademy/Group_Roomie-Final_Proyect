import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import mockup from "../../img/mockup.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    actions.login(email, password);
  };

  return (
    <>
      <body className="bg-slate-100 h-screen">
        <div className="w-full flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
              <img className="w-70 h-15 pb-10" src={logo} alt="logo" />
            </div>

            <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
              <p className="text-center text-3xl font-bold text-gray-700">
                ¡Bienvenido!
              </p>
              <form
                className="flex flex-col pt-3 md:pt-8"
                onSubmit="event.preventDefault();"
              >
                <div className="flex flex-col pt-4">
                  <label htmlFor="email" className="text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col pt-4">
                  <label htmlFor="password" className="text-lg">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  value="Login"
                  className="bg-indigo-800 text-white font-bold text-lg hover:bg-indigo-300 p-2 mt-8 rounded-lg"
                  onClick={handleSubmit}
                >
                  Entrar{" "}
                </button>
              </form>
              <div className="text-center pt-12 pb-12">
                <p>
                  ¿Aún no tienes cuenta?{" "}
                  <Link to="/" className="underline font-semibold">
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
      </body>
    </>
  );
};

export default Login;
