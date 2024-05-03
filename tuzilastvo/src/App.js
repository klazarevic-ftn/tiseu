import { useEffect, useState } from "react";
import { Routes, Route, useRoutes, BrowserRouter, Navigate } from "react-router-dom";
import HomeLayout from "./_home/HomeLayout";
import { 
  Home,
  Auth,
 } from "./_home/pages/index";
 import RootLayout from "./_root/RootLayout";
import { 
  Account,
  Profile,
  Orders,
  Cases,
  CaseForm,
  DocForm,
  TrialForm,
} from "./_root/pages/index";

import axios from 'axios'; 
import "./i18";
import "./style/globals.css";
import "./style/style.css";
import AuthLayout from "./_auth/AuthLayout";
import RequireAuth from "./context/RequireAuth";
import RequireConfig from "./context/RequireConfig";

// const AppContent = () => {
//   let routes = useRoutes([
//     { path: "/", element: <Navigate to="/en" replace /> },
//     {
//       path: "/:lang",
//       element: <LanguageWrapper />,
//       children: [
//         { path: "", element: <Home /> },
//         { path: "about", element: <About /> },
//       ]
//     },
//     { path: "*", element: <Navigate to="/en" replace /> },
//   ]);

//   return routes;
// }

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8010/check-auth', {
  //         method: 'GET',
  //         credentials: 'include' 
  //       });

  //       if (response.ok) {
  //         setIsAuthenticated(true);
  //         const data = await response.json();
  //         console.log('User Data:', data); 
  //         console.log('User Decoded Token:', data.user); 

  //         setUserData(data.user); 
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       console.error('Error while checking authentication:', error);
  //     }
  //   };

  //   checkAuth();
  // }, []);

//   return (

//       <h1>EUprava - Tuzilastvo</h1>
//       <AppContent />

//    
//   );
// }

  return (
    <main >
      {/* <Routes> */}
        {/* public routes */}
        {/* <Route element={<HomeLayout />}> */}
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/account-config" element={<Account />} /> */}
        {/* </Route>

        <Route element={<RootLayout />}>
          <Route path="/account-config" element={<Account />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

      </Routes> */}
      <Routes>
 
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route  element={<RequireAuth />}>
          <Route path="/account-config" element={<Account />} />
        </Route>

        <Route element={<RequireConfig />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/new-case" element={<CaseForm />} />
          <Route path="/new-document" element={<DocForm />} />
          <Route path="/new-trial" element={<TrialForm />} />
       </Route>




      </Routes>
    </main>
  );
};


export default App;
