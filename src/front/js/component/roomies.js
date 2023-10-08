import React from "react";
import "../../styles/roomies-cards.css"

export const Roomies = () => {
	return (
	  <div className="col">
		<div className="card">
		  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className="card-img" alt="..."/>
		  <div className="card-body">
			<h5 className="card-title">Card title</h5>
			<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
			<button className="btn btn-primary">Ver perfil</button> 
		  </div>
		</div>
	  </div>
	
	);
};
