import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8010/users/check-auth", {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
          const data = await response.json();
          setAuthData(data.user);
          // console.log("isAuthenticatedAAA: " + true);
          // console.log("authData: " + data.user);
          // console.log("isAuthenticatedAAA: " + isAuthenticated);
          // console.log("authData: " + authData);

          // navigate("/"); 

        } else {
          setIsAuthenticated(false);
          // navigate("/login"); 
          // window.location.href = "http://localhost:8000"; 
          // navigate("/"); 
          // console.log("isAuthenticatedBBB: " + false);
          // console.log("authData: " + authData);


        }
      } catch (error) {
        console.error("Error while checking authentication:", error);
        setIsAuthenticated(false);
        setAuthData(null);
      // } finally {
      //   setTimeout(() => {
      //     setIsLoading(false); 
      //   }, 3000);
      }
    };

    checkAuth();
  }, [navigate]);

  // if (isLoading) {
  //   return (
  //     <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 flex justify-center items-center">
  //       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-4 rounded">
  //         Loading...
  //       </div>
  //     </div>
  //   );
  // }

  // const checkAuth = async () => {
  //   try {
  //     // Fetch authentication data
  //     const response = await fetch("http://localhost:8010/users/check-auth", {
  //       method: "GET",
  //       credentials: "include",
  //     });
      
  //     if (response.ok) {
  //       setIsAuthenticated(true);
  //       const data = await response.json();
  //       setAuthData(data.user);
  //       console.log("isAuthenticatedAAA: " + isAuthenticated);
  //       console.log("authData: " + authData);
  //     } else {
  //       setIsAuthenticated(false);
  //       setAuthData(null);
  //       console.log("isAuthenticatedAAA: " + isAuthenticated);
  //       console.log("authData: " + authData);
  //     }
  //   } catch (error) {
  //     console.error("Error while checking authentication:", error);
  //     setIsAuthenticated(false);
  //     setAuthData(null);
  //   }
  // };

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8010/users/check-auth", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        const data = await response.json();
        setAuthData(data.user);
        // console.log("tt: " + true);

        // console.log("isAuthenticatedAAA: " + isAuthenticated);
        // console.log("authData: " + authData);

        // navigate("/"); 
        // navigate("/account-config"); 
        return true; // Return true if authentication is successful
        
      } else {
        setIsAuthenticated(false);
        // navigate("/login"); 
        // window.location.href = "http://localhost:8000"; 
        // console.log("cc: " + isAuthenticated);
        // console.log("authData: " + authData);
        // navigate("/"); 
        return false; // Return false if authentication fails
        
      }
    } catch (error) {
      console.error("Error while checking authentication:", error);
      setIsAuthenticated(false);
      setAuthData(null);
      // } finally {
    //   setTimeout(() => {
    //     setIsLoading(false); 
    //   }, 3000);
    return false; // Return false if there's an error

    }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, authData, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
