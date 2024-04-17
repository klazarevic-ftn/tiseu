import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8010/users/check-auth", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
          const data = await response.json();
          setUserData(data.user);
          navigate("/"); 

        } else {
          setIsAuthenticated(false);
          // navigate("/login"); 
          // window.location.href = "http://localhost:8000"; 
          navigate("/"); 

        }
      } catch (error) {
        console.error("Error while checking authentication:", error);
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
