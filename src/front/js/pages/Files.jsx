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
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-h-70vh w-full sm:w-3/4 md:w-3/5 lg:w-3/7 xl:w-3/7 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default Files;
