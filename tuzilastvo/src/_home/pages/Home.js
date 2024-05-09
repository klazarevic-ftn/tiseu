import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Update the path according to your file structure

const Home = () => {
  const { isAuthenticated, authData } = useAuth();
  
  const [legislationUpdates, setLegislationUpdates] = useState([
    {
      title: 'Amendment Act 2024',
      date: '2024-05-01',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod magna id velit ultrices, ac dignissim eros tristique.'
    },
    {
      title: 'Regulation Revision 2024',
      date: '2024-05-05',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod magna id velit ultrices, ac dignissim eros tristique.'
    },
    {
      title: 'Redsfsdssdfsion 2024',
      date: '2024-05-05',
      description: 'Lorem ipsdfsdfsdfsddid velit ultrices, ac dignissim eros tristique.'
    },
    {
      title: 'Redsfsdssdfsion 2024',
      date: '2024-05-05',
      description: 'Lore tristique.'
    },
  ]);

  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUpdateIndex(prevIndex => (prevIndex + 1) % legislationUpdates.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [legislationUpdates]);


  const nextTrial = {
    caseNo: '8663',
    date: '2024-05-10',
    time: '10:00 AM'
  };

  const paddedCaseNo = nextTrial.caseNo.padStart(7, '0');
  const notificationContent = {
    caseNo: `Next Trial for Case No: ${paddedCaseNo}`,
    date: `Date: ${nextTrial.date}, Time: ${nextTrial.time}`,
  };



  return (
    <div className="home-wrap w-full h-screen relative">
      <div className="home-container h-2/3 relative">
        <img className="w-full h-full object-cover" src="/court_photo7.jpg" alt="" />

        {/* <div className="absolute inset-0 flex justify-start items-end ">
          <div className="updates-div hidden lg:flex w-36 md:w-72 h-26 md:h-28 mb-2 ml-10 md:ml-32 bg-white rounded-sm shadow-blue-300">

            <div className="updates-container flex flex-col p-4 rounded-sm bg-gray-50 text-center text-sm shadow-lg">
                <h2 className="notification-title text-base text-gray-900 mb-2">Notifications</h2>
                <div className="notification-content flex flex-col text-gray-800">
                  <div>{notificationContent.caseNo}</div>
                  <div>{notificationContent.date}</div>
                </div>
              </div>
          </div>
        </div> */}
          <div  className="updates-wrapper absolute inset-0 flex justify-start items-end ">
            <div className="updates-container hidden lg:flex 
            max-w-72 min-w-72
            px-8 md:px-10  
            md:py-6 md:pb-8 mb-2 md:mb-2 ml-14 md:ml-44 flex-col justify-center items-center
            bg-white rounded-sm shadow-black shadow-2xl md:shadow-md text-center ">
              <h2 className="updates-title text-base text-gray-900 mb-2">Legislation Updates</h2>
              <div   className="updates-content flex flex-col text-sm text-gray-800">
              <div>{legislationUpdates[currentUpdateIndex].title}</div>
              <div>{legislationUpdates[currentUpdateIndex].date}</div>
              <div>{legislationUpdates[currentUpdateIndex].description}</div>
              </div>
            </div>
          </div>
          
        
      
        <div className="notification-wrapper absolute inset-0 flex justify-end items-end ">
          <div className="notification-container 
          px-6 py-4 pb-5 md:px-8 md:py-5 md:pb-6
          mb-5 md:mb-5 mr-7 md:mr-32 
          flex flex-col justify-center items-center bg-white rounded-sm  shadow-black shadow-2xl md:shadow-md 
           text-center  ">



              <h2 className="notification-title text-base text-gray-900 mb-2">Notifications</h2>
              <div className="notification-content flex flex-col text-sm text-gray-800">
                <div>{notificationContent.caseNo}</div>
                <div>{notificationContent.date}</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
