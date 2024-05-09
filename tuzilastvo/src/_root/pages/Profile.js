import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';

const Profile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); 

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  }; 

  const data = {
    firstName: 'John',
    lastName: 'Doe',
    type: 'Doctor',
    UPIN: '123456789',
    address: {
      streetAddress: '123 Main St',
      aptNumber: '2',
      city: 'New York',
      country: 'USA'
    },
    birthdate: '2024-03-30T23:00:00.000+00:00',
    phone: '+1234567890',
    licenseNumber: 'ABCDE12345',
    specialization: 'Cardiology'
  };

  const trialsData = [
    { id: 1, name: 'Trial 1', date: '2024-06-15' },
    { id: 2, name: 'Trial 2', date: '2024-07-20' },
    { id: 3, name: 'Trial 3', date: '2024-08-25' },
  ];
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
                <p>{data.firstName}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="lastName" className="text-gray-500 text-xs font-medium mb-1">Last Name</label>
                <p>{data.lastName}</p>
              </div>
 
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="UPIN" className="text-gray-500 text-xs font-medium mb-1">UPIN</label>
                <p>{data.UPIN}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="address" className="text-gray-500 text-xs font-medium mb-1">Address</label>
                <p>{`${data.address.streetAddress}, Apt ${data.address.aptNumber}, ${data.address.city}, ${data.address.country}`}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="birthdate" className="text-gray-500 text-xs font-medium mb-1">Birthdate</label>
                <p>{new Date(data.birthdate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="content-containter w-full md:w-1/2 lg:w-1/2 flex flex-col px-10 pt-6 md:border-r">
            

              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="phone" className="text-gray-500 text-xs font-medium mb-1">Phone</label>
                <p>{data.phone}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="licenseNumber" className="text-gray-500 text-xs font-medium mb-1">License Number</label>
                <p>{data.licenseNumber}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="specialization" className="text-gray-500 text-xs font-medium mb-1">Specialization</label>
                <p>{data.specialization}</p>
              </div>
              <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="type" className="text-gray-500 text-xs font-medium mb-1">Type</label>
                <p>{data.type}</p>
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
              <div key={trial.id} className="bg-gray-50 rounded border p-4 shadow-md hover:bg-gray-200 cursor-not-allowed" >
                <h2 className="text-lg font-bold">{trial.name}</h2>
                <p className="text-sm text-gray-600">Date: {new Date(trial.date).toLocaleDateString()}</p>
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
