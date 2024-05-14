import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Notification } from '../../components';

const TrialInfo = () => {
    const [trialInfo, setTrialInfo] = useState(null);
    const [caseInfo, setCaseInfo] = useState(null);
    const [partiesInfo, setPartiesInfo] = useState(null);
    const [caseNumb, setCaseNumb] = useState(null);
    const params = useParams();
    const trialNo = params.trialNo;
    const [verdict, setVerdict] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            await fetchTrialInfo();
            await fetchPartiesInfo();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);

    const fetchTrialInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8010/trials/trial/${trialNo}`);
            if (!response.ok) {
                throw new Error('Failed to fetch trial info');
            }
            const data = await response.json();
            setTrialInfo(data.trialInfo);
            setCaseInfo(data.caseInfo);
            // console.log("Attendance: ", data.trialInfo.attendance);
            // console.log("case no: ", data.trialInfo.caseNo);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchPartiesInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8010/cases/case/parties/${trialInfo.caseNo}`);
            if (!response.ok) {
                throw new Error('Failed to fetch parties info');
            }
            const data = await response.json();
            setPartiesInfo(data);
        } catch (error) {
            setError(error.message);
        }
    };
    const [currentStep, setCurrentStep] = useState(1); 
    const [error, setError] = useState(null);
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };
    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    }; 
    
    const [selectedDocRow, setSelectedDocRow] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleRowClick = (document, index) => {
        // console.log(document)
        setSelectedDocRow(index);
        setSelectedDocument(document);
    };

    const handleClose = () => {
        setSelectedDocRow(null);
        setSelectedDocument(null);
      };

    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState(null);
    const handleFinalizeDecision = async () => {
        if (!verdict || verdict < 1 || verdict > 3) {
            setMessage('Verdict is not set.');
            setShowNotification(true);
            console.error('Verdict is not set or invalid');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8010/trials/trial/verdict`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    trialNo, 
                    verdict, 
                    caseNo: trialInfo.caseNo 
                }), 
            });
            if (!response.ok) {
                throw new Error('Failed to finalize decision');
            }
            const data = await response.json();
            setMessage(data.message);
            setShowNotification(true);
            console.log("Trial Info: ", data.trial);
            setTimeout(() => {
                navigate("/");
            }, 10000);


        } catch (error) {
            console.error('Error finalizing decision:', error);
        }
    };

    return (
        <div className="flex flex-col shadow-inner">
          <div className="title-container w-full border-b">
              <div className="title-container w-full flex justify-center items-center">
                    <div className="flex flex-row text-center gap-3">
                <h2 className="form-title text-lg md:text-xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">Trial Overview</h2>
                <h2 className="form-title text-lg md:text-xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">{currentStep}/3</h2>
              </div>
            </div>
          </div>

          {currentStep === 1 && (
      
            <div className="form-container-1 w-full  flex flex-col justify-center items-center bg-white px-0 rounded-sm  lg:mx-0 ">
                <div className="content-containter w-full md:w-2/3 lg:w-1/2 flex flex-col px-10 pt-6">
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="trialNo" className=" text-gray-500 text-xs font-medium	mb-1">Trial No</label>
                        <p>{trialInfo && trialInfo.trialNo.toString().padStart(7, '0')}
                        </p>
                    </div>
                     <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseNo" className=" text-gray-500 text-xs font-medium	mb-1">Case No</label>
                        <p>{trialInfo && trialInfo.caseNo.toString().padStart(7, '0')}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="location" className=" text-gray-500 text-xs font-medium	mb-1">Case Title</label>
                        {trialInfo && (
                        <p>
                        {trialInfo.location.address}, {trialInfo.location.city}, {trialInfo.location.state}, Floor: {trialInfo.location.floor}, Room: {trialInfo.location.room}
                        </p>
                        )}
                    </div>
                 {  /* <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseType" className=" text-gray-500 text-xs font-medium	mb-1">Case Type</label>
                        <p>{caseInfo && caseInfo.caseType}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseDescription" className=" text-gray-500 text-xs font-medium	mb-1">Case Description</label>
                        <p>{caseInfo && caseInfo.caseDescription}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseAssignee" className=" text-gray-500 text-xs font-medium	mb-1">Case Assignee</label>
                        <p>{caseInfo && caseInfo.caseAssignee}</p>
                    </div>*/}
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="createdOn" className=" text-gray-500 text-xs font-medium	mb-1">Date and Time of Creation</label>
                        {/* <p>{formattedDate} {formattedTime}</p> */}
                        <p>{trialInfo && trialInfo.createdOn} </p>
                    </div> 
                </div>
            <div className="buttons-containter-wrap w-full flex my-3 lg:mt-3 justify-center border-t border-b ">
              <div className="buttons-content w-full md:w-2/3 lg:w-1/2 flex justify-end px-10 pt-6 pb-9 " >
        
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
                    <h1 className="text-center py-5">Attendance</h1>


                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium mb-1">Case Plaintiff</label>
                        <div className="flex flex-row gap-1">
                            {partiesInfo && partiesInfo.plaintiff ? (
                            <p>{partiesInfo.plaintiff.firstName} {partiesInfo.plaintiff.lastName}, {partiesInfo.plaintiff.UPIN}</p>
                            ) : (
                            <p>{caseInfo && caseInfo.plaintiffUPIN}</p>
                            )}                        
                        </div>
                        <div className="flex flex-row gap-1">
                            {trialInfo && trialInfo.attendance && (
                                <p>
                                    Plaintiff Attendance: {trialInfo.attendance.plaintiffAttendance ? "Confirmed" : "Not confirmed"}
                                </p>
                            )}                        
                        </div>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium mb-1">Case Defendant</label>
                        <div className="flex flex-row gap-1">
                            {partiesInfo && partiesInfo.defendant ? (
                            <p>{partiesInfo.defendant.firstName} {partiesInfo.defendant.lastName}, {partiesInfo.defendant.UPIN}</p>
                            ) : (
                            <p>{caseInfo && caseInfo.defendantUPIN}</p>
                            )}                        
                        </div>
                        <div className="flex flex-row gap-1">
                            {trialInfo && trialInfo.attendance && (
                                <p>
                                    Defendant Attendance: {trialInfo.attendance.defendantAttendance ? "Confirmed" : "Not confirmed"}
                                </p>
                            )}                        
                        </div>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium mb-1">Case Witness</label>
                        <div className="flex flex-row gap-1">
                            {partiesInfo && partiesInfo.witness ? (
                            <p>{partiesInfo.witness.firstName} {partiesInfo.witness.lastName}, {partiesInfo.witness.UPIN}</p>
                            ) : (
                            <p>{caseInfo && caseInfo.witnessUPIN}</p>
                            )}                        
                        </div>
                        <div className="flex flex-row gap-1">
                            {trialInfo && trialInfo.attendance && (
                                <p>
                                    Witness Attendance: {trialInfo.attendance.witnessAttendance ? "Confirmed" : "Not confirmed"}
                                </p>
                            )}                        
                        </div>
                    </div>
                </div>
                <div className="buttons-containter-wrap w-full h-full flex justify-center border-t">
                    <div className="buttons-content w-full md:2/3 lg:w-2/5 h-1/2 flex flex-row px-10 md:px-16 py-5 " >
                        <div className="buttons-1 w-1/2">
                            <button onClick={handlePreviousStep} 
                                className=" h-full px-10 py-2 text-sm bg-white text-gray-600 rounded 
                                hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                                Previous
                            </button>
                        </div>
                        <div className="buttons-2 w-1/2 h-1/2 flex justify-end">
                            <button onClick={handleNextStep} 
                                className=" h-full px-10 py-2 text-sm bg-white text-gray-600 rounded 
                                hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
      
      )}

{currentStep === 3 && (
    <div className="form-container-2 w-full flex flex-col px-0 lg:mx-0 justify-center items-center bg-white rounded-sm border-b">
        <div className="section-wrap w-full md:2/3 lg:w-2/5 px-10 md:px-16 mb-5">
            <h1 className="text-center py-5">Verdict Section</h1>
            <div className="field-wrap flex flex-col w-full text-sm mb-4">
            <label className="text-gray-500 text-xs font-medium mb-1">Verdict</label>
            <div className="flex w-full flex-row gap-2">
                <div className={`w-1/3 text-center py-3 rounded-sm border text-sm  text-gray-600 ${verdict === 1 ? 'bg-red-100' : 'hover:bg-gray-50 active:bg-red-100 border-gray-200'}`} onClick={() => setVerdict(1)}>
                    Guilty
                </div>
                <div className={`w-1/3 text-center py-3 rounded-sm border text-sm  text-gray-600 ${verdict === 2 ? 'bg-red-100' : 'hover:bg-gray-50 active:bg-red-100 border-gray-200'}`} onClick={() => setVerdict(2)}>
                    Not Guilty
                </div>
                <div className={`w-1/3 text-center py-3 rounded-sm border text-sm  text-gray-600 ${verdict === 3 ? 'bg-red-100' : 'hover:bg-gray-50 active:bg-red-100 border-gray-200'}`} onClick={() => setVerdict(3)}>
                    Mistrial
                </div>
            </div>
        </div>
            <div className="w-full flex justify-center items-center pt-32">
                <div onClick={handleFinalizeDecision} className="text-center text-sm md:text-base px-7 py-4 rounded-sm border border-gray-200 text-gray-600  hover:bg-green-100">
                Finalize Decision
                </div>
            </div>
        </div>
        <div className="buttons-containter-wrap w-full h-full flex justify-center border-t">
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

{showNotification && <Notification message={message} onClose={() => setShowNotification(false)} />}


    </div>

    )
}

export default TrialInfo