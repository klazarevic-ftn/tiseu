import { Suspense } from "react";
import { useRoutes, BrowserRouter, Navigate } from "react-router-dom";
import Home from './components/home';
import About from './components/about';
import LanguageWrapper from "./components/languageWrapper";
import "./i18"

const AppContent = () => {
  let routes = useRoutes([
    {path: "/", element: <Navigate to="/en" replace />},
    {
      path: "/:lang",
      element: <LanguageWrapper />,
      children: [
        { path: "", element: <Home/> },
        { path: "about", element: <About /> },
      ]
    },
    {path:"*", element: <Navigate to="/en" replace/>},
  ])

  return (
    <Suspense falback={<div>Loading Translations...</div>}>
      {routes}
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
          <h1>EUprava - Tuzilastvo</h1>
    <AppContent />
    </BrowserRouter>
  );
}

export default App;
