import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import Loader from "../component/Loader.jsx";

const Files = () => {
  const { actions, store } = useAppContext();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await actions.getFiles(store.home_id);
        setFiles(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los archivos:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [actions]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : store.home_id !== "null" ? (
        files.length > 0 ? (
          <div className="flex items-center justify-center h-70vh overflow-y-auto z-0 mx-2 mt-5 sm:mt-10 md:mt-10 lg:mt-20">
            <div className="w-full sm:w-3/4 md:w-3/5 lg:w-3/7 xl:w-3/7">
              <div className="bg-white rounded-[50px] p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Lista de archivos
                </h2>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center mb-3 pb-2 border-b border-gray-300"
                  >
                    <i className="fa-regular fa-file fa-lg text-gray-600 mr-3"></i>
                    <p className="text-gray-800">{file.name}</p>
                    <div className="flex-grow"></div>
                    <a href={file.url} target="_blank" rel="noreferrer">
                      <i className="fa-regular fa-cloud-arrow-down text-indigo-300 text-2xl font-bold"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
            Aún no se han añadido archivos
          </h1>
        )
      ) : (
        <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
          No estás vinculado a ninguna vivienda.
          <br />
          Crea una o pide a un administrador que te añada
        </h1>
      )}
    </>
  );
};

export default Files;
