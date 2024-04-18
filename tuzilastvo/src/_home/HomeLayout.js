import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

const HomeLayout = () => {
  return (
    <div className="home-layout  h-screen overflow-hidden">
      <Header className="" />

      <section className="h-full"> 
        <Outlet className=""/>
      </section>
    </div>
  );
};

export default HomeLayout;
