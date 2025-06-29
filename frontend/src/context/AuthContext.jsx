import React, { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = "https://linked-in-clone-backend-sigma.vercel.app";

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
