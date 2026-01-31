import React, { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
<<<<<<< HEAD
  const serverUrl = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";
=======
  const serverUrl = "https://linkedin-backend-excd.onrender.com";
>>>>>>> 7a708d523dd5c9bf5d15b142028543d119a65d9e

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
