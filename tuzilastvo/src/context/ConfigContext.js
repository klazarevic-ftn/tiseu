 import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConfigContext = createContext();

export const useConfigContext = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
  const [configured, setConfigured] = useState(false);
  const [userData, setUserData] = useState(null);

  // const navigate = useNavigate();
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch("http://localhost:8010/users/account-config", {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.configured) {
            // console.log("configured: " + data.configured);
            // console.log("userData: " + data.user);
            // console.log("userData: " + data.user.email);
            setConfigured(true);
            setUserData(data.user);
            // console.log(configured)
            // console.log(data.configured)
            // console.log(data.user.email);

            // navigate("/profile");
            // console.log("configured: " + configured);
            // console.log("userData: " + userData);
            // const userData = data.user;
            // console.log("DATA:");
            // for (const key in userData) {
            //   console.log(`${key}: ${userData[key]}`);
            // }


          } else {
            setConfigured(false);
            setUserData(data.user);

            // console.log(configured)
            // console.log(data)

            // console.log(data.configured)
            // console.log(data.user.email);

            // navigate("/account-config");
          }
        } else {
          setConfigured(false);
          // console.log(configured)

          // navigate("/account-config");
        }
      } catch (error) {
        console.error("Error while checking account:", error);
        setConfigured(false);
      }
    };
    checkConfig();
  }, []);
  
  const checkConfig = async () => {
    try {
      const response = await fetch("http://localhost:8010/users/account-config", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.configured) {
          // console.log("configured4444: " + data.configured);
          // console.log("userData4444: " + data.user);
          // console.log("userData: " + data.user.email);
          setConfigured(true);
          setUserData(data.user);
          // console.log(configured)
          // console.log(data.configured)
          // console.log(data.user.email);

          // navigate("/profile");
          // console.log("configured: " + configured);
          // console.log("userData: " + userData);
          // const userData = data.user;
          // console.log("DATA:");
          // for (const key in userData) {
          //   console.log(`${key}: ${userData[key]}`);
          // }

          // return true;
          return { configured: true, userData: data.user };

        } else {
          setConfigured(false);
          setUserData(data.user);

          // console.log(configured)
          // console.log(data)

          // console.log(data.configured)
          // console.log(data.user.email);

          // navigate("/account-config");
          // return false;
          return { configured: false, userData: data.user };

        }
      } else {
        setConfigured(false);
        // console.log(configured)

        // navigate("/account-config");
        // return false;
        return { configured: false, userData: null };

      }
    } catch (error) {
      console.error("Error while checking account:", error);
      setConfigured(false);
      // return false;
      return { configured: false, userData: null };

    }
  };

  return (
    <ConfigContext.Provider value={{ configured, userData, checkConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
