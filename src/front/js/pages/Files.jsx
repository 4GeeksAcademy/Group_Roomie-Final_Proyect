import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";

const Files = () => {
  const { actions } = useAppContext();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const home_id = localStorage.getItem("home_id");
      const data = await actions.getFiles(home_id);
      setFiles(data);
    };
    fetchData();
  }, [actions]);

  return (
    <div className="h-2/5 w-6/7 flex items-center justify-center min-h-screen">
      {files.length === 0 ? (
        <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
          Aún no se han subido archivos
        </h1>
      ) : (
        <div className="bg-white rounded-[50px] p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Lista de archivos
          </h2>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center mb-3 pb-2"
              style={{ borderBottom: "1px solid #D1D5DB" }}
            >
              <i className="fa-regular fa-file fa-lg text-gray-600 mr-3"></i>
              <p className="text-gray-800">{file.name}</p>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-indigo-300 hover:bg-indigo-500 flex items-center justify-center ml-4"
              >
                <span className="text-white text-2xl font-bold pb-1">+</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Files;
