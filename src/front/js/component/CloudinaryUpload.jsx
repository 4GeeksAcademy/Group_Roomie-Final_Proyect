import React, { useEffect, useRef } from "react";

const CloudinaryUpload = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dewjikwun",
        uploadPreset: "roomie_connect",
      },
      function (error, result) {
        console.log(result);
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
