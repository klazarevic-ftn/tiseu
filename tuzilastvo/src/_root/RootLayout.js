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
        <div className="root-layout h-screen flex flex-col">
          <Header />
          <section className="flex-grow overflow-hidden">
            <Outlet className="flex-grow" />
          </section>
        </div>
      ) : (
        <div className="root-layout h-screen flex flex-col">
          <Header />
          <section className="flex-grow overflow-hidden">
            {/* <Navigate to="/account-config" /> */}
            <Outlet className="flex-grow" />
          </section>
        </div>

      )}
    </>
  );
};

export default RootLayout;
