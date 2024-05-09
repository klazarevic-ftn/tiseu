import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../components';
import DatePicker from 'react-datepicker';

const TrialForm = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  
  const cases = [
    { caseNo: '12345', caseTitle: 'Case Title 1' },
    { caseNo: '54321', caseTitle: 'Case Title 2' },
    { caseNo: '98765', caseTitle: 'Case Title 3' },
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedCase(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedCase === '') {
      setValidationErrorMessage('Please select a case');
      setShowPopup(true);
    } else {
      // Your submit logic here
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [selectedDate, setSelectedDate] = useState(new Date()); // Initial date value

  const locations = [
    {
      city: 'New York',
      state: 'NY',
      address: '123 Main St',
      floor: '10',
      room: 'Courtroom A'
    },
    {
      city: 'Chicago',
      state: 'IL',
      address: '789 Oak St',
      floor: '20',
      room: 'Courtroom C'
    },
  
  ];

  const [selectedLocation, setSelectedLocation] = useState('');
  const handleLocationChange = (event) => {
    const { value } = event.target;
    setSelectedLocation(value);
  };

  return (
    <div className="flex flex-col shadow-inner border-t">
      <div className="title-container w-full border-b text-center">
        <div className="title-container w-full text-center">
          <h2 className="form-title text-xl md:text-2xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">Trial Scheduling Form</h2>
        </div>
      </div>

      <div className="form-container-1 w-full flex flex-col justify-center items-center bg-white px-0  lg:mx-0">
        <div className="content-containter w-full md:w-2/3 lg:w-1/2 flex flex-col px-10 pt-6 pb-9 ">
          <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="caseSelect" className="text-gray-500 text-xs font-medium mb-1">Select Case</label>
            <select
              id="caseSelect"
              name="selectedCase"
              className="w-full border  px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
              value={selectedCase}
              onChange={handleInputChange}
            >
              <option value="">Select a case</option>
              {cases.map((c) => (
                <option key={c.caseNo} value={c.caseNo}>{c.caseTitle}</option>
              ))}
            </select>
          </div>

          <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="trialDate" className="text-gray-500 text-xs font-medium mb-1">
              Select Trial Date
            </label>
            <DatePicker
              id="trialDate"
              selected={selectedDate}
              onChange={handleDateChange}
              className="w-full border px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
            />
          </div>

          <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label htmlFor="caseSelect" className="text-gray-500 text-xs font-medium mb-1">Select Case</label>
            <select
            id="locationSelect"
            name="selectedLocation"
            className="w-full border px-4 py-2 bg-gray-50 focus:outline-none focus:border-gray-300"
            value={selectedLocation}
            onChange={handleLocationChange}
            >
            <option value="">Select a location</option>
            {locations.map((location, index) => (
              <option key={index} value={index}>
                {`${location.city}, ${location.state} - ${location.address}; Floor: ${location.floor}, ${location.room}`}
              </option>
            ))}
            </select>
          </div>

        </div>
      </div>

      <div className="buttons-containter-wrap w-full flex my-3 lg:mt-3 justify-center border-t border-b ">
        <div className="buttons-content w-full md:w-2/3 lg:w-1/2 flex justify-end px-10 pt-6 pb-6 gap-2" >
          <button 
            className="h-full px-10 py-2 text-sm rounded bg-white text-gray-600 hover:bg-gray-50 focus:outline-none border hover:border-green-200"
            onClick={handleSubmit}
          >
            Ok
          </button>
          <button 
            className="h-full px-10 py-2 text-sm bg-white text-gray-600 rounded hover:bg-gray-50 focus:outline-none border hover:border-red-200"
            onClick={handleClose} 
          >
            Cancel
          </button>
        </div>
      </div>

      {showPopup && <Notification message={validationErrorMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default TrialForm;
