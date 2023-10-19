import React, { useEffect, useState, useRef } from "react";

const CloudinaryUpload = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [filesInfo, setFilesInfo] = useState([]);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dewjikwun",
        uploadPreset: "roomie_connect",
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          console.log("Listo! Estos son los datos del archivo: ", result.info);
          const file = {
            name: result.info.public_id,
            url: result.info.url,
          };
          setFilesInfo(...filesInfo, file);
        }
      }
    );
  }, []);

  return (
    <button
      className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
      onClick={() => widgetRef.current.open()}
    >
      Adjuntar imagen
    </button>
  );
};

export default CloudinaryUpload;
