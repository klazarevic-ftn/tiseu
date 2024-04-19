import React from "react";
import { useAuth } from "../../context/AuthContext"; // Update the path according to your file structure


const Home = () => {
  const { isAuthenticated, authData } = useAuth();

  
  return (
    <div className="home-wrap w-full h-screen">
      {/* <div className="home-container h-3/4"> */}
      <div className="home-container h-3/5" >
        <img className="w-full h-full object-cover " src="/court_photo7.jpg" alt="" />
      </div>

    </div>
    
  );
};

export default Home;
