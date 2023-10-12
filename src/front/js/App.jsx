import React from "react";

import Router from "./routes/Router.jsx";
import { AppContextProvider } from "./contexts/AppContext.jsx";

function App() {
  return (
    <AppContextProvider>
      <Router />
    </AppContextProvider>
  );
}

export default App;
