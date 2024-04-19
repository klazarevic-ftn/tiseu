import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import { useAuth } from "../context/AuthContext";
import { useConfigContext } from "../context/ConfigContext";

const HomeLayout = () => {
  const { isAuthenticated, authData, checkAuth} = useAuth();
  const { configured, userData} = useConfigContext();

  useEffect(() => {
    // Call login function when Home component is mounted
    checkAuth();

  }, []);

  return (
    <div className="home-layout  h-screen overflow-hidden">
      <Header className="" />

      <section className="h-full"> 
        <Outlet className=""/>
      </section>
      {/* {isAuthenticated && authData && (  */}
        <div className="popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg">
          <div className="flex flex-row gap-4">
            <div className="section-1 flex flex-col my-2 ml-3 ">
              <h2>CONFIGURED: </h2>
              <h2>AUTHENTICATED: </h2>
              <h2>ACC TYPE: </h2>
            </div>
            <div className="section-2 flex flex-col my-2 mr-3">
              <h2>{configured ? "true" : "false"}</h2>
              <h2>{isAuthenticated ? "true" : "false"}</h2>
              <h2>{userData ? userData.type : "N/A"}</h2> {/* Add conditional check for userData */}
            </div>
          </div>
          
          {/* <h2>CONFIGURED: {configured ? "true" : "false"}</h2>
          <h2>AUTHENTICATED: {isAuthenticated ? "true" : "false"}</h2> */}
        </div>
      {/* )} */}
    </div>
  );
};

export default HomeLayout;
