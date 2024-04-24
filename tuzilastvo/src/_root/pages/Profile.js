import React, { useState, useEffect } from 'react';
import { useConfigContext } from "../../context/ConfigContext"; 
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { configured } = useConfigContext();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (configured) {
  //     console.log(configured)
  //     navigate('/profile');
  //   }
  //   else {
  //     navigate('/account-config');
  //   }
  // }, [configured, navigate]);

  return (
    <div className="w-full text-center text-2xl">
      Profil Page
    </div>
  )
}

export default Profile
