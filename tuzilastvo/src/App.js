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
  CaseInfo,
  LawForm,
  Trials,
  TrialInfo,
  Laws,
} from "./_root/pages/index";
import axios from 'axios'; 
import "./i18";
import "./style/globals.css";
import "./style/style.css";
import AuthLayout from "./_auth/AuthLayout";
import RequireAuth from "./context/RequireAuth";
import RequireConfig from "./context/RequireConfig";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);


  return (
    <main >
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
          <Route path="/cases/all" element={<Cases />} />
          <Route path="/cases/new-case" element={<CaseForm />} />
          <Route path="/cases/case/:caseNo" element={<CaseInfo />} />
          <Route path="/docs/new-document" element={<DocForm />} />
          <Route path="/trials/new-trial" element={<TrialForm />} />
          <Route path="/trials/all" element={<Trials />} />
          <Route path="/trials/trial/:trialNo" element={<TrialInfo />} />
          <Route path="/laws/new-law" element={<LawForm />} />
          <Route path="/laws/all" element={<Laws />} />
       </Route>
      </Routes>
    </main>
  );
};


export default App;
