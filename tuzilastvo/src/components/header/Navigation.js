import React, { useState } from 'react';
import { useConfigContext } from "../../context/ConfigContext";
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const {configured, userData} = useConfigContext();

  
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const routes = [
    { path: '/orders', label: 'Orders', accessible: configured && userData.type === 'PROSECUTOR' },
    { path: '/cases', label: 'Cases', accessible: configured && userData.type === 'PROSECUTOR' },
    { path: '/new-case', label: 'New Case', accessible: configured && userData.type === 'PROSECUTOR' },
    { path: '/new-document', label: 'New Document', accessible: configured && userData.type === 'PROSECUTOR' },
    { path: '/new-trial', label: 'New Trial', accessible: configured && userData.type === 'PROSECUTOR' },
    // { path: '/case-overview', label: 'Case Overview', accessible: true },
    // { path: '/trial-overview', label: 'Trial Overview', accessible: true },
    // { path: '/documents', label: 'Documents', accessible: true },
    // { path: '/orders', label: 'Orders', accessible: true },
    // { path: '/statutory-repository', label: 'Statutory Repository', accessible: true },
  ];
  const handleRouteClick = (path) => {
    navigate(path);
    setIsOpen(false); 
  };

  return (
    <div className="navbar-wrap text-sm z-40" >
      <div className="navbar_container lg:w-8/12 md:w-10/12 w-full mx-auto">
        <nav className=" bg-white">
          <div className="max-w-screen-xl ml-2 lg:ml-0 flex flex-wrap  items-center">
            <button onClick={toggleMenu} type="button" 
              className="inline-flex items-center justify-center p-2 w-8 h-8  text-gray-700  dark:text-gray-400 " 
              aria-controls="navbar-hamburger" 
              aria-expanded={isOpen}>
              <span className="sr-only">Open main menu</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="black"  strokeWidth="1" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>
            <div className="nav-fixed hidden  lg:hidden xl:hidden 2xl:flex  space-x-14 tracking-wide ml-3 ">
              {/* {configured && userData.type === 'PROSECUTOR' && (
                  <>
                    <a  className="flex items-center space-x-3">
                      <span className="self-center  whitespace-normal">Orders/Warrants/Docs</span>
                    </a>
                  </>
                )} */}

              {routes.filter(route => route.accessible).map((route, index) => (
                <a key={index} onClick={() => handleRouteClick(route.path)} className="flex items-center space-x-3 cursor-pointer">
                  <span className="self-center whitespace-normal">{route.label}</span>
                </a>
              ))}
              {/* 
              <a className="flex items-center space-x-3">
              <span className="self-center whitespace-nowrap">Trial Overview </span>
              </a>
              <a  className="flex items-center space-x-3">
              <span className="self-center  whitespace-nowrap">Trials</span>
              </a>
              <a  className="flex items-center space-x-3">
              <span className="self-center  whitespace-nowrap">Cases</span>
              </a>
              <a  className="flex items-center space-x-3">
              <span className="self-center  whitespace-nowrap">Documents</span>
              </a>
              <a  className="flex items-center space-x-3">
              <span className="self-center  whitespace-nowrap">Orders</span>
              </a>
              <a  className="flex items-center space-x-3">
              <span className="self-center whitespace-nowrap">Statutory Repository</span>
            </a> */}

            
            </div>

            <div className="hamb-wrap w-full max-w-full " >
              <div className={`w-full  ${isOpen ? 'md:w-5/6 lg:w-2/3 absolute shadow ' : 'hidden'}`} id="navbar-hamburger">
                <ul className="flex flex-col  bg-white  font-light tracking-wide border " style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {routes.filter(route => route.accessible).map((route, index) => (
                    <li key={index}>
                      <a onClick={() => handleRouteClick(route.path)} className="block py-3 pl-4 px-3 bg-white text-black hover:bg-gray-50 hover:text-black cursor-pointer">{route.label}</a>
                    </li>
                  ))}



                  {/* {configured && userData.type === 'PROSECUTOR' && (
                        <li>
                          <a className="block py-3 pl-4 px-3 bg-white  text-black hover:bg-gray-50 hover:text-black" >Orders/Warrants/Docs</a>
                        </li>
                    )} */}
                    
                  {/* <li>
                    <a  className="block py-3 pl-4 px-3 bg-white  text-black hover:bg-gray-50 hover:text-black" >Case Overview</a>
                  </li>
                  <li>
                    <a  className="block py-3 pl-4 px-3 bg-white  text-black hover:bg-gray-50 hover:text-black" >Trial Overview</a>
                  </li>
                  <li>
                    <a  className="block py-3 pl-4 px-3 bg-white  text-black hover:bg-gray-50 hover:text-black" >Cases</a>
                  </li>
                  <li>
                    <a  className="block py-3 pl-4 px-3 bg-white  text-black hover:bg-gray-50 hover:text-black" >Documents</a>
                  </li>
                  <li>
                    <a  className="block py-3 pl-4 px-3 bg-white  text-black hover:bg-gray-50 hover:text-black" >Orders</a>
                  </li>
                  <li>
                    <a  className="block py-3 pl-4 px-3 bg-white  text-black hover:bg-gray-50 hover:text-black" >Statutory Repository</a>
                  </li> */}
        
                  
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
