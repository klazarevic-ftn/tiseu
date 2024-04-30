import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';

import { Notification } from '../../components';
const CaseForm = () => {
  const [caseNumber, setCaseNumber] = useState('');
  const navigate = useNavigate();

  const [assignees, setAssignees] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
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
    const successMessage = "Case created successfully."
    if (errorMessage === "") {
      try {
        const response = await fetch('http://localhost:8010/cases/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        if (response.ok) {
          // alert('Case submitted successfully!');
          setValidationErrorMessage(successMessage);
          setShowPopup(true);

          setFormData({
            caseTitle: '',
            caseDescription: '',
            caseType: '',
            plaintiffUPIN: '',
            defendantUPIN: '',
            witnessUPIN: ''
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
    caseTitle: '',
    caseDescription: '',
    caseType: '',
    plaintiffUPIN: '',
    defendantUPIN: '',
    witnessUPIN: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    
    const validateForm = () => {
      const { caseTitle, caseDescription, caseType, plaintiffUPIN, defendantUPIN, witnessUPIN } = formData;
      console.log('Case Title:', caseTitle);
      console.log('Case Description:', caseDescription);
      console.log('Case Type:', caseType);
      console.log('Plaintiff UPIN:', plaintiffUPIN);
      console.log('Defendant UPIN:', defendantUPIN);
      console.log('Witness UPIN:', witnessUPIN);
    
      const upinRegex = /^\d{13}$/;
    
      if (!caseTitle.trim() || !caseDescription.trim() || !caseType.trim() || !plaintiffUPIN.trim() || !defendantUPIN.trim() || !witnessUPIN.trim()) {
        return "All necessary fields should be filled.";
      }
    
      if (!upinRegex.test(plaintiffUPIN) || !upinRegex.test(defendantUPIN) || !upinRegex.test(witnessUPIN)) {
        return "UPIN fields must contain exactly 13 digits.";
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

  const dummyAssignees = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Alice Smith' },
  ];



  return (
  <div className="flex flex-col shadow-inner">
    <div className="title-container w-full border-b text-center">
      <div className="title-container w-full text-center">
        <h2 className="form-title text-xl md:text-2xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">Case Submission</h2>
      </div>
    </div>
    {/* <div className="form-wrap flex flex-col md:flex-row"> */}
    {currentStep === 1 && (

      <div className="form-container-1 w-full  flex flex-col justify-center items-center bg-white px-0 rounded-sm  lg:mx-0 ">
      <div className="content-containter w-full md:w-2/3 lg:w-1/2 flex flex-col px-10 pt-6 pb-9 ">
        {/* <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="caseNumber" className=" text-gray-500 text-xs font-medium	mb-1">Case Number</label>
            <input type="text" id="caseNumber" name="caseNumber" placeholder="Enter Case Number"
            className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
            focus:border-gray-300 cursor-not-allowed" value={caseNumber} readOnly disabled></input>
        </div> */}
        <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium	mb-1">Case Title</label>
            <input type="text" id="caseTitle" name="caseTitle" placeholder="Enter Case Title"
            className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
            focus:border-gray-300 "
            value={formData.caseTitle}
            onChange={handleInputChange}></input>
        </div>
        <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="caseDescription" className=" text-gray-500 text-xs font-medium	mb-1">Case Description</label>
            <textarea
              id="caseDescription"
              name="caseDescription"
              placeholder="Enter Case Description"
              className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300 h-20" 
              value={formData.caseDescription}
              onChange={handleInputChange}>
            </textarea>
        </div>
        <div className="field-wrap flex flex-col w-full text-sm mb-4">
          <label htmlFor="caseType" className="text-gray-500 text-xs font-medium mb-1">Case Type</label>
          <select
              id="caseType"
              name="caseType"
              className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
              value={formData.caseType}
              onChange={handleInputChange}
          >
              <option className="text-gray-500 " value="criminal">Criminal case</option>
              <option className="text-gray-500 " value="civil">Civil case</option>
              <option className="text-gray-500 " value="family">Family case</option>
          </select>
      </div>
      <div className="field-wrap flex flex-col w-full text-sm mb-4">
        <label htmlFor="caseAssignee" className="text-gray-500 text-xs font-medium mb-1">
          Case Assignee
        </label>
        <select
          id="caseAssignee"
          name="caseAssignee"
          value={caseAssignee}
          onChange={handleCaseAssigneeChange}
          className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300 cursor-not-allowed"
          disabled
        >
          <option value="">Select Assignee</option>
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              {assignee.name}
            </option>
          ))}
        </select>
      </div>

      

      </div>

      <div className="buttons-containter-wrap w-full flex my-3 lg:mt-3 justify-center border-t border-b ">
        <div className="buttons-content w-full md:w-2/3 lg:w-1/2 flex justify-start px-10 pt-6 pb-9 " >
            {/* <button 
            className="px-4 py-2 w-1/5 lg:h-1/4 bg-white text-gray-600 rounded hover:bg-gray-50  focus:outline-none border hover:border-green-200"
            onClick={(e) => handleSubmit(e, false)} 
            >Ok
            </button>
            <button 
            className="px-4 py-2 w-1/4 lg:w-3/12 bg-white text-gray-600 rounded hover:bg-gray-50  focus:outline-none border hover:border-red-200"
            onClick={handleClose} 
            >Cancel
            </button> */}
            <button onClick={handleNextStep} className=" h-full px-10 py-2 text-sm rounded bg-white text-gray-600  hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                  Next
                </button>
        </div>
      </div>



      </div>

)}
    {currentStep === 2 && (

      <div className="form-container-2 w-full flex flex-col px-0 lg:mx-0 justify-center items-center bg-white  rounded-sm  border-b ">
        
      <div className="section-wrap w-full md:2/3 lg:w-2/5 px-10 md:px-16 ">

        <div className=" py-2 mt-3">
        <h3 className="mb-1">Plaintiff</h3>
          <div className="field-wrap flex flex-col w-full text-sm ">
              <label htmlFor="plaintiffUPIN" className=" text-gray-500 text-xs font-medium	mb-1">UPIN</label>
              <input type="text" id="plaintiffUPIN" name="plaintiffUPIN" placeholder="Plaintiff's UPIN"
              className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
              focus:border-gray-300"
              value={formData.plaintiffUPIN}
              onChange={handleInputChange}></input>
          </div>
        </div>

        <div className="  py-2 mt-1">
          <h3 className="mb-1">Defendant</h3>
          <div className="field-wrap flex flex-col w-full text-sm ">
              <label htmlFor="defendantUPIN" className=" text-gray-500 text-xs font-medium	mb-1">UPIN</label>
              <input type="text" id="defendantUPIN" name="defendantUPIN" placeholder="Defendant's UPIN"
              className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
              focus:border-gray-300"
              value={formData.defendantUPIN}

              onChange={handleInputChange}></input>
          </div>
        </div>
        
        <div className=" py-2 mt-1 mb-5">
          <h3 className="mb-1">Witness</h3>
          <div className="field-wrap flex flex-col w-full text-sm mb-4">
              <label htmlFor="witnessUPIN" className=" text-gray-500 text-xs font-medium	mb-1">UPIN</label>
              <input type="text" id="witnessUPIN" name="witnessUPIN" placeholder="Witness's UPIN"
              className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
              focus:border-gray-300"
              value={formData.witnessUPIN}

              onChange={handleInputChange}></input>
          </div>
        </div>
      </div>


        {/* <button onClick={handlePreviousStep} className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 focus:outline-none border">
                  Previous
                </button> */}
                
      <div className="buttons-containter-wrap w-full h-full flex justify-center border-t">

        <div className="buttons-content w-full md:2/3 lg:w-2/5 h-1/2 flex flex-col px-10 md:px-16 py-5 " >
          <div className="buttons-1 w-full">
              <button onClick={handlePreviousStep} 
                className=" h-full px-10 py-2 text-sm bg-white text-gray-600 rounded 
                hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                Previous
              </button>
          </div>
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
{showPopup && <Notification message={validationErrorMessage} onClose={() => setShowPopup(false)} />}

    {/* </div> */}
  </div>

  )
}

export default CaseForm;
