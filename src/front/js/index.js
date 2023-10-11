//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

//include your index.scss file into the bundle
import "../styles/index.css";
import "../../../dist/output.css"

//import your own components
import Layout from "./Layout.jsx";

//render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));
