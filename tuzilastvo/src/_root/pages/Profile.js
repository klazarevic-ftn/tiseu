import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useConfigContext } from '../../context/ConfigContext';

const Profile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); 
  // const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const { checkConfig } = useConfigContext();
  const [error, setError] = useState(null);
  const [trialsData, setTrialsData] = useState([]); 

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  }; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await checkConfig(); 
        // const data = response.userData; 
        setData(response.userData);
        const userData = await fetchUserData(response.userData.UPIN);
        const userTrials = await fetchUserTrials(response.userData.UPIN)
        // console.log("AA", authData)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  // const fetchUserData = async (UPIN) => {
  //           console.log("sadasdassasads", UPIN)

  //   try {
  //     const response = await fetch(`http://localhost:8010/users/user/?pr=${UPIN}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data');
  //     }
  
  //     const responseData = await response.json();
  //     console.log('Data fetched successfully:', responseData);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const fetchUserData = async (UPIN) => {
    try {
        const response = await fetch(`http://localhost:8010/users/user/${UPIN}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setData(data.userInfo);
    } catch (error) {
        setError(error.message);
    }
};

const fetchUserTrials = async (UPIN) => {
  try {
    const response = await fetch(`http://localhost:8010/trials/user/${UPIN}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user trials');
    }
    const trialsData = await response.json();
    setTrialsData(trialsData);

  } catch (error) {
    setError(error.message);
  }
};

const handleTrialClick = async (trialNo) => {
  try {
    const response = await fetch('http://localhost:8010/trials/trial/attend', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UPIN: data.UPIN,
        trialNo: trialNo,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to attend trial');
    }
    alert('Successfully attended trial');

  } catch (error) {
    console.error('Error attending trial:', error);
    setError(error.message);
  }
};

  // const data = {
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   type: 'Doctor',
  //   UPIN: '123456789',
  //   address: {
  //     streetAddress: '123 Main St',
  //     aptNumber: '2',
  //     city: 'New York',
  //     country: 'USA'
  //   },
  //   birthdate: '2024-03-30T23:00:00.000+00:00',
  //   phone: '+1234567890',
  //   licenseNumber: 'ABCDE12345',
  //   specialization: 'Cardiology'
  // };

  // const trialsData = [
  //   { id: 1, name: 'Trial 1', date: '2024-06-15' },
  //   { id: 2, name: 'Trial 2', date: '2024-07-20' },
  //   { id: 3, name: 'Trial 3', date: '2024-08-25' },
  // ];
  return (
    <div className="flex flex-col shadow-inner">
      <div className="title-container w-full border-b">
        <div className="title-container w-full flex justify-center items-center">
          <div className="flex flex-row text-center gap-3">
            <h2 className="form-title text-lg md:text-xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">Profile</h2>
            <h2 className="form-title text-lg md:text-xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">{currentStep}/2</h2>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="form-container-1 w-full  flex flex-col md:flex-col justify-center items-center bg-white px-0 rounded-sm  lg:mx-0 ">
          <div className="w-full md:w-1/2 flex flex-row">
            <div className="content-containter w-full md:w-1/2 flex flex-col px-10 pt-6 md:border-l">
               <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="firstName" className="text-gray-500 text-xs font-medium mb-1">First Name</label>
                <p>{data && data.firstName}</p>
              </div>
            <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="lastName" className="text-gray-500 text-xs font-medium mb-1">Last Name</label>
                <p>{data && data.lastName}</p>
              </div>
 
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="UPIN" className="text-gray-500 text-xs font-medium mb-1">UPIN</label>
                <p>{data && data.UPIN}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="address" className="text-gray-500 text-xs font-medium mb-1">Address</label>
                <p>{`${data && data.address.streetAddress}, Apt ${data && data.address.aptNumber}, ${data && data.address.city}, ${data && data.address.country}`}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="birthdate" className="text-gray-500 text-xs font-medium mb-1">Birthdate</label>
                {/* <p>{new Date(data.birthdate).toLocaleDateString()}</p> */}
                <p>{data && data.birthDate && new Date(data.birthDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="content-containter w-full md:w-1/2 lg:w-1/2 flex flex-col px-10 pt-6 md:border-r">
            

              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="phone" className="text-gray-500 text-xs font-medium mb-1">Phone</label>
                <p>{data && data.phone}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="licenseNumber" className="text-gray-500 text-xs font-medium mb-1">License Number</label>
                <p>{data && data.licenseNumber}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="specialization" className="text-gray-500 text-xs font-medium mb-1">Specialization</label>
                <p>{data && data.specialization}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="type" className="text-gray-500 text-xs font-medium mb-1">Type</label>
                <p>{data && data.type}</p>
              </div> 
            </div>
            </div>
          <div className="buttons-containter-wrap w-full flex  justify-center border-t border-b ">
            <div className="buttons-content w-full md:w-2/3 lg:w-1/2 flex justify-end px-10 pt-6 pb-9 " >
              <button onClick={handleNextStep} className="h-full px-10 py-2 text-sm rounded bg-white text-gray-600 hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

{currentStep === 2 && (
        <div className="form-container-2 w-full flex flex-col px-0 lg:mx-0 justify-center items-center   rounded-sm  border-b ">
          <div className="section-wrap w-full md:2/3 lg:w-2/3 px-10 md:px-16 mb-8 md:mb-16 ">
            <h1 className="text-center py-5">My Trials</h1>
            <div className="w-full flex flex-col gap-4">



            {trialsData.map(trial => (
            <div 
            key={trial.id} 
            className="trial-card h-full flex flex-row justify-between  rounded-sm shadow-md hover:bg-green-100"
            onClick={() => handleTrialClick(trial.trialNo)}
          >
              <div className="left-section p-4 flex-grow">
              <h2 className="text-lg font-bold">Trial No: {String(trial.trialNo).padStart(7, '0')}</h2>
                <p className="txt-wht text-sm ">Date: {new Date(trial.trialDate).toLocaleDateString()}</p>
              </div>
              <div className="right-section flex items-center ">
                <p className="txt-wht  text-sm px-6">Attend</p>
              </div>
            </div>
          ))}

          </div>
          </div>
          <div className="buttons-containter-wrap bg-white w-full h-full flex justify-center border-t">
            <div className="buttons-content w-full md:2/3 lg:w-2/5 h-1/2 flex flex-row px-10 md:px-16 py-5 " >
              <div className="buttons-1 w-1/2">
                <button onClick={handlePreviousStep} className="h-full px-10 py-2 text-sm bg-white text-gray-600 rounded hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                  Previous
                </button>
              </div>
              <div className="buttons-2 w-1/2 h-1/2 flex justify-end">
                <button onClick={handleNextStep} className="h-full px-10 py-2 text-sm bg-white text-gray-600 rounded hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
