import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import injectContext from "./store/appContext";


import { Roomies } from "./components/Roomies.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    // if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div className="bg-slate-100">
          <BrowserRouter basename={basename}>
          
          <Roomies />
           
          </BrowserRouter>
        </div>
      );
    };
    
export default injectContext(Layout);
