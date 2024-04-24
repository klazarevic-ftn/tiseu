import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/header/Header";
import { useAuth } from "../context/AuthContext";
import { useConfigContext } from "../context/ConfigContext";
import { Home } from "./pages/index";

const HomeLayout = () => {
  const { isAuthenticated, authData, checkAuth} = useAuth();
  const { configured, userData} = useConfigContext();


  return (
    <>
      <div className="root-layout h-screen flex flex-col">
        <Header />
        <section className="flex-grow overflow-hidden">
          <Outlet className="flex-grow" />
        </section>
      </div>
    </>
  );
};

export default HomeLayout;
