import React, { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

  let value = {
    serverUrl,
  };
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  );
}

export default AuthContext;
