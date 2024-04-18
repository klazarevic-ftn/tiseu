import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const iconXmark = <FontAwesomeIcon icon={faXmark} size="2x" />; 
const angleRight = <FontAwesomeIcon icon={faAngleRight} />; 
const userIcon = <FontAwesomeIcon icon={faUser} />; 

const Toolbar = () => {
  const [showOverflow, setShowOverflow] = useState(false);

  const handleButtonClick = () => {
    setShowOverflow(!showOverflow);
  };
  const handleCloseClick = () => {
    setShowOverflow(false);
  };
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };
  return (
    <div className="toolbar-wrap bg-white text-black py-1 font-roboto 
    text-sm border-b border-gray-300 flex justify-center tracking-tight " >
      <div className="toolbar__container w-full lg:w-8/12 md:w-10/12 h-full mx-auto ">

  <div className="toolbar__row flex justify-between lg:px-1 px-4">

        <div className="toolbar__left">

          <button className="toolbar__button flex items-center cursor-pointer" onClick={handleButtonClick}>
            <span className="toolbar__span ">
              Websites of government bodies
            </span>
            <span className="toolbar__span ml-2  ">
              <div className="transform rotate-90 mt-1">&#62;</div>
            </span>
          </button>
       
            <div className="toolbar__dropdown__menu">
              {/* <a className="dropdown-item">
                <span className="toolbar__text"></span>
              </a> */}
            </div>

        </div>

        {/*desna sekcija */}
        <div className="toolbar__right mr-1">
            <div className="toolbar__user flex items-center ">
              <button className="toolbar__profile mr-3" onClick={handleProfileClick}>{userIcon}</button>
              
              <div className="toolbar__lr hidden lg:flex md:flex">
                <button className="toolbar__login">Login/</button>
                 {/* <span> / </span> */}
                <button className="toolbar__registration">Registration</button>
              </div>
            </div>
        </div>

     

        </div>
      </div>


      {showOverflow && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-85 z-50 " >
          <div className="overflow__fill bg-gray-200 absolute top-0 left-0 right-0 bottom-0 flex  z-100 max-w-screen-lg lg:w-5/6 md:w-4/5 w-full h-full mx-auto ">
            <div className="overflow__content w-full ">
              <div className="catalog mt-4 pt-5 flex flex-col text-lg">
                  <span className='flex-grow w-full bg-gray-200 hover:bg-white flex items-center justify-between p-5 '>
                    <p className="ml-4">Supreme Court</p>
                    <p className="text-xl mr-4">&gt;</p>
                  </span>
                  <span className='flex-grow w-full bg-gray-200 hover:bg-white flex items-center justify-between p-5 '>
                    <p className="ml-4">Ministry of Internal Affairs</p>
                    <p className="text-xl mr-4">&gt;</p>
                  </span>
                  <span className='flex-grow w-full bg-gray-200 hover:bg-white flex items-center justify-between p-5 '>
                  <p className="ml-4">Border Police</p>
                    <p className="text-xl mr-4">&gt;</p>
                  </span>
                </div>
              </div>
            <div className="overflow__content2 w-full bg-white relative">
              <div className="overflow__content__pos_absolute top-0 right-0 mt-4 mr-4">
                <span className="absolute top-0 right-0 mr-4 mt-3 cursor-pointer" onClick={handleCloseClick}><p className="text-3xl mr-4 ">x</p></span>
              </div>
            </div>
            <div className="overflow__bg"></div>
          </div>
        </div>
          )}
    </div>
  );
};

export default Toolbar;
