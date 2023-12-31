//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

//include your index.scss file into the bundle
import "../../output.css";

//import your own components
import App from "./App.jsx";

//render your react application
ReactDOM.render(<App />, document.querySelector("#app"));
