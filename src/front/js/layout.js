import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import injectContext from "./store/appContext";


import { Navbar } from "./component/navbar";
import { Roomies } from "./component/roomies";
import { Logout } from "./component/logout";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
          <BrowserRouter basename={basename}>
            <ScrollToTop>
              <Routes>
                <Route element={<h1>Not found!</h1>} />
              </Routes>
              <div style={{ display: "flex", background: '#F1F2F6'}}>
                <div style={{ flex: 1 }}>
                  <Navbar />
                </div>

                <div style={{ flex: 3 }}>
                  <Roomies />
                </div>

                <div style={{ flex: 1, textAlign: "right" }}>
                  <Logout />
                </div>

              </div>
            </ScrollToTop>
          </BrowserRouter>
        </div>
      );
    };
    
export default injectContext(Layout);
