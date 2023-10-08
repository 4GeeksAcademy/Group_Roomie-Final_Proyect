import React from "react";
import "../../styles/roomies-cards.css";

export const Roomies = () => {
  const roomiesData = [
    { name: "Laura", role: "Admin", imageUrl: "..." },
	{ name: "Betty", role: "Usuario", imageUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" },
    { name: "Betty", role: "Usuario", imageUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" },
  ];

  return (
    <div className="col">
      <div className="card-container">
        {roomiesData.map((roomie, index) => (
          <div className="card" key={index}>
            <img src={roomie.imageUrl} className="card-img" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{roomie.name}</h5>
              <p className="card-text">{roomie.role}</p>
              <button className="btn btn-primary">Modificar perfil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



// import React, { useState } from "react";
// import "../../styles/roomies-cards.css";

// export const Roomies = ({ usuario }) => {
//   const [roomies, setRoomies] = useState([]);

//   const agregarRoomie = (nuevoRoomie) => {
//     setRoomies([...roomies, nuevoRoomie]);
//   };

//   return (
//     <div className="col">
//       <div className="card">
//         <img
//           src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
//           className="card-img"
//           alt="..."
//         />
//         <div className="card-body">
//           <h5 className="card-title">
//             {usuario.isAdmin
//               ? "Administrador: " + usuario.nombre
//               : "Usuario: " + usuario.nombre}
//           </h5>
//           <button className="btn btn-primary">Ver perfil</button>
//         </div>
//       </div>

//       {roomies.map((roomie, index) => (
//         <div key={index} className="card">
//           <img
//             src={roomie.foto}
//             className="card-img"
//             alt={roomie.nombre}
//           />
//           <div className="card-body">
//             <h5 className="card-title">{roomie.nombre}</h5>
//             <button className="btn btn-primary">Ver perfil</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
