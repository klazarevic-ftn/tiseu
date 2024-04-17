import React from "react";
import { useConfigContext } from "../context/ConfigContext"; 
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/header/Header";
import { Account } from "./pages";

const RootLayout = () => {
  const { configured } = useConfigContext();

  return (
    <>
      {configured ? (
        <div className="root-layout h-screen overflow-y-auto">
          <Header />
          <section className=""> 
            <Outlet />
          </section>
        </div>
      ) : (
        
        <div className="root-layout h-screen overflow-y-auto">
        <Header />
        <section className=""> 
          <Outlet />
        </section>
      </div>
      )}
    </>
  );
};

export default RootLayout;
