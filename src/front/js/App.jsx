import React from "react";

import Router from "./routes/Router.jsx";
import { AppContextProvider } from "./contexts/AppContext.jsx";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AppContextProvider>
      <Toaster position="top-center" />
      <Router />
    </AppContextProvider>
  );
}

export default App;
