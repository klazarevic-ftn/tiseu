import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LawForm = () => {
  const [formData, setFormData] = useState({
    lawTitle: '',
    fullLawText: '',
    lawType: '',
    authority: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); 
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
  
    if (validationError !== '') {
      setMessage(validationError);
      setShowPopup(true);
    } else {
      try {
        const response = await fetch("http://localhost:8010/laws/law/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create trial');
        }
        setMessage('Law submitted successfully');
        setShowPopup(true);

        // navigate("/");
      } catch (error) {
        // setFormData({
        //   lawTitle: '',
        //   fullLawText: '',
        //   lawType: '',
        //   authority: '',
        // });
        console.error('Error creating trial:', error);
        setMessage('Failed to create trial');
        setShowPopup(true);
      }
    }
  };

  const validateForm = () => {
    const { lawTitle, fullLawText, lawType, authority } = formData;
    let errorMessage = '';
  
    if (lawTitle.trim() === '') {
      errorMessage = 'Please enter Law Title.';
    } else if (fullLawText.trim() === '') {
      errorMessage = 'Please enter Law Content.';
    } else if (lawType.trim() === '') {
      errorMessage = 'Please select a Law Type.';
    } else if (authority.trim() === '') {
      errorMessage = 'Please select an Authority.';
    }
  
    return errorMessage.trim();
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
};

const handlePreviousStep = () => {
  setCurrentStep(currentStep - 1);
};


  return (
  <div className="flex flex-col shadow-inner">
    <div className="title-container w-full border-b text-center">
      <div className="title-container w-full text-center">
        <h2 className="form-title text-xl md:text-2xl text-gray-600 py-1 md:py-3 mt-2 md:mt-4 mb-2 md:mb-4 ">Law Creation Hub</h2>
      </div>
    </div>
    {/* <div className="form-wrap flex flex-col md:flex-row"> */}
    {currentStep === 1 && (

      <div className="form-container-1 w-full  flex flex-col justify-center items-center bg-white px-0 rounded-sm  lg:mx-0 ">
      <div className="content-containter w-full md:w-2/3 lg:w-1/2 flex flex-col px-10 pt-6 pb-9 ">
     
        <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="lawTitle" className=" text-gray-500 text-xs font-medium	mb-1">Law Title</label>
            <input type="text" id="lawTitle" name="lawTitle" placeholder="Enter Law Title"
            className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
            focus:border-gray-300 "
            value={formData.lawTitle}
            onChange={handleInputChange}></input>
        </div>
        <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="fullLawText" className=" text-gray-500 text-xs font-medium	mb-1">Law Content</label>
            <textarea
              id="fullLawText"
              name="fullLawText"
              placeholder="Enter Law Content"
              className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300 h-20" 
              value={formData.fullLawText}
              onChange={handleInputChange}>
            </textarea>
        </div>
        <div className="field-wrap flex flex-col w-full text-sm mb-4">
          <label htmlFor="lawType" className="text-gray-500 text-xs font-medium mb-1">Law Type</label>
          <select
              id="lawType"
              name="lawType"
              className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
              value={formData.lawType}
              onChange={handleInputChange}
          >
              <option className="text-gray-500 " value="">Select Law Type</option>
              <option className="text-gray-500 " value="criminal">Criminal Law</option>
              <option className="text-gray-500 " value="civil">Civil Law</option>
              <option className="text-gray-500 " value="family">Tax Law</option>
          </select>
      </div>
      {/* <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="trialDate" className="text-gray-500 text-xs font-medium mb-1">
              Select Trial Date
            </label>
            <DatePicker
              id="trialDate"
              selected={selectedDate}
              onChange={handleDateChange}
              className="w-full border px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
            />
        </div> */}
        <div className="field-wrap flex flex-col w-full text-sm mb-4">
          <label htmlFor="authority" className="text-gray-500 text-xs font-medium mb-1">Authority</label>
          <select
              id="authority"
              name="authority"
              className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
              value={formData.authority}
              onChange={handleInputChange}
          >
              <option className="text-gray-500 " value="">Select Authority</option>
              <option className="text-gray-500 " value="parliament">Parliament</option>
              <option className="text-gray-500 " value="congress">Congress</option>
              <option className="text-gray-500 " value="council">Local Council</option>
          </select>
      </div>
      

      </div>

      <div className="buttons-containter-wrap w-full flex my-3 lg:mt-3 justify-center border-t border-b ">

      <div className="buttons-content w-full md:2/3 lg:w-2/5 h-1/2 flex flex-col px-10 md:px-16 py-5 " >
          {/* <div className="buttons-1 w-full">
              <button onClick={handlePreviousStep} 
                className=" h-full px-10 py-2 text-sm bg-white text-gray-600 rounded 
                hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                Previous
              </button>
          </div> */}
          <div className="buttons-2 w-full h-1/2 flex justify-end gap-2">
            <button 
              className="h-full px-10 py-2 text-sm rounded bg-white text-gray-600 hover:bg-gray-50  focus:outline-none border hover:border-green-200"
              onClick={(e) => handleSubmit(e)} 
              >Ok
            </button>
            <button 
              className="h-full px-10 py-2 text-sm bg-white text-gray-600 rounded hover:bg-gray-50  focus:outline-none border hover:border-red-200"
              onClick={handleClose} 
              >Cancel
            </button>
          </div>
        </div>
      </div>



      </div>

)}

{showPopup && <Notification message={message} onClose={() => setShowPopup(false)} />}

    {/* </div> */}
  </div>

  )
}

export default LawForm;
