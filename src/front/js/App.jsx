
import React from "react";
import { AppContextProvider } from "./contexts/AppContext.jsx";
import Router from "./routes/Router.jsx";
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
