import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';

import { Notification } from '../../components';
const DocForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); 
  const [validationError, setValidationError] = useState(false);
  const [caseAssignee, setCaseAssignee] = useState('');
  const [validationErrorMessage, setValidationErrorMessage] = useState('');

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    const successMessage = "Document created successfully."
    if (errorMessage === "") {
      try {
        const response = await fetch('http://localhost:8010/docs/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        if (response.ok) {
        //   alert('Case submitted successfully!');
          setValidationErrorMessage(successMessage);
          setShowPopup(true);

          setFormData({
            docTitle: '',
            docDescription: '',
            docType: '',
          });
          
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        console.error('Error submitting case:', error);
        alert('Failed to submit case: ' + error.message);
      }
    } else {
      setValidationErrorMessage(errorMessage);
      setShowPopup(true);
    }
  };
  
  const [formData, setFormData] = useState({
    docTitle: '',
    docDescription: '',
    docType: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    
    const validateForm = () => {
      const { docTitle, docDescription, docType } = formData;
      // console.log('d Title:', docTitle);
      // console.log('d Description:', docDescription);
      // console.log('d Type:', docType);
    
      const upinRegex = /^\d{13}$/;
    
      if (!docTitle.trim() || !docDescription.trim() || !docType.trim()) {
        return "All fields should be filled.";
      }
      return ""; 
    };
  const handleNextStep = () => {
      setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCaseAssigneeChange = (e) => {
    setCaseAssignee(e.target.value);
  };


  return (
  <div className="flex flex-col shadow-inner border-t">
    <div className="title-container w-full border-b text-center">
      <div className="title-container w-full text-center">
        <h2 className="form-title text-xl md:text-2xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">Create Legal Record</h2>
      </div>
    </div>
    {/* <div className="form-wrap flex flex-col md:flex-row"> */}
    {currentStep === 1 && (

      <div className="form-container-1 w-full  flex flex-col justify-center items-center bg-white px-0 rounded-sm  lg:mx-0">
        <div className="content-containter w-full md:w-2/3 lg:w-1/2 flex flex-col px-10 pt-6 pb-9 ">

            <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="doctTitle" className=" text-gray-500 text-xs font-medium	mb-1">Document Title</label>
                <input type="text" id="docTitle" name="docTitle" placeholder="Enter Document Title"
                className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                focus:border-gray-300 "
                value={formData.docTitle}
                onChange={handleInputChange}></input>
            </div>
            <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="docDescription" className=" text-gray-500 text-xs font-medium	mb-1">Document Description</label>
                <textarea
                id="docDescription"
                name="docDescription"
                placeholder="Enter Document Description"
                className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300 h-20" 
                value={formData.docDescription}
                onChange={handleInputChange}>
                </textarea>
            </div>
            <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="docType" className="text-gray-500 text-xs font-medium mb-1">Document Type</label>
            <select
                id="docType"
                name="docType"
                className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
                value={formData.docType}
                onChange={handleInputChange}
            >
                <option className="text-gray-500 " value="">Select type</option>
                <option className="text-gray-500 " value="pleadings">Legal Pleadings</option>
                <option className="text-gray-500 " value="statements">Witness Statements</option>
                <option className="text-gray-500 " value="evidences">Evidence Documentation</option>
            </select>
        </div>

        

        </div>
        
        {/* <div className="buttons-containter-wrap w-full md:w-2/3 lg:w-1/2 flex my-3 lg:mt-3 justify-center border-t border-b ">
        <div className="buttons-content w-full h-1/2 flex flex-col px-10  py-5 " >
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
        </div> */}

<div className="buttons-containter-wrap w-full flex my-3 lg:mt-3 justify-center border-t border-b ">
        <div className="buttons-content w-full md:w-2/3 lg:w-1/2 flex justify-end px-10 pt-6 pb-6 gap-2" >
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

)}
  
{showPopup && <Notification message={validationErrorMessage} onClose={() => setShowPopup(false)} />}

    {/* </div> */}
  </div>

  )
}

export default DocForm;
