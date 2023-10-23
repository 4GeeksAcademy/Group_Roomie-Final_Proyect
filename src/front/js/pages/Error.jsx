import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <p className="text-5xl font-semibold text-indigo-800">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Página no encontrada
        </h1>
        <p className="mt-6 pr-2 pl-2 text-base leading-7 text-gray-600">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <div className="mt-10">
          <Link to="/">
            <button
              type="button"
              className="rounded-full bg-indigo-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Volver atrás
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
