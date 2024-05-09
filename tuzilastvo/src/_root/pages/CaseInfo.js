import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Notification } from '../../components';

const CaseInfo = () => {
    const { caseNo } = useParams();
    const [currentStep, setCurrentStep] = useState(1); 
    const [caseInfo, setCaseInfo] = useState({
        caseNo: "54321",
        caseTitle: "Sample Case Title 2",
        caseDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elit.",
        caseType: "Criminal",
        plaintiff: "Alice Smith",
        plaintiffUPIN: "UPIN123",
        defendant: "Bob Johnson",
        defendantUPIN: "UPIN456",
        witness: "Aa BBBbb",
        witnessUPIN: "UPIN456",
        createdAt: new Date().toISOString(), // Format: 2024-04-27T14:01:56.708+00:00
        caseAssignee: "Bob Bobovich",
        documents: []
    });

    const createdAt = new Date(caseInfo.createdAt);
    const formattedDate = createdAt.toDateString(); // Format: Thu Apr 27 2024
    const formattedTime = createdAt.toLocaleTimeString(); // Format: 2:01:56 PM
    const [showAssignCase, setShowAssignCase] = useState(null);

    const [documents, setDocuments] = useState([
        {
            docNo: 1,
            docTitle: "Document 1",
            docDescription: "Description of Document 1",
            docType: "Type A",
        },
        {
            docNo: 2,
            docTitle: "Document 2",
            docDescription: "Description of Document 2",
            docType: "Type B",
        },
        {
            docNo: 3,
            docTitle: "Document 3",
            docDescription: "Description of Document 3",
            docType: "Type C",
        }
    ]);

    
    
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };
    
    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    }; 
    
    const [selectedDocRow, setSelectedDocRow] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleRowClick = (document, index) => {
        console.log(document)
        setSelectedDocRow(index);
        setSelectedDocument(document);
    };

    const handleClose = () => {
        setShowAssignCase(false);
        setSelectedDocRow(null);
        setSelectedDocument(null);
      };

    // const handleConfirm = async () => {
    // console.log(selectedDocRow);
    // console.log(selectedDocument);

    // // if (selectedDocRow && selectedDocument) {
    // //     try {
    // //         const response = await fetch(`http://localhost:8010/cases/case/caseNo/add-doc`, {
    // //             method: 'PATCH',
    // //             headers: {
    // //                 'Content-Type': 'application/json',
    // //             },
    // //             body: JSON.stringify({
    // //                 caseNumber: caseNo,
    // //                 document: selectedDocument.docNo,
    // //             }),
    // //         });

    // //         if (!response.ok) {
    // //             throw new Error('Failed to assign case');
    // //         }
    // //         console.log('Case assigned successfully'); // Log to confirm reaching this point

    // //         setMessage('Case assigned successfully');
    // //         setShowNotification(true);
    // //         setShowAssignCase(false);
    // //         selectedDocRow(null);
    // //         selectedDocument(null); 

    // //         } catch (error) {
    // //         console.error('Error assigning case:', error);

    // //         }
    // // }
    // };

    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState(null);

    const handleConfirm = () => {
        if (selectedDocRow !== null && selectedDocument !== null) {
            const updatedCaseInfo = { ...caseInfo };
            updatedCaseInfo.documents.push(selectedDocument);
            setCaseInfo(updatedCaseInfo);
    
            setMessage('Document added to case successfully');
            setShowNotification(true);
            setShowAssignCase(false);
            setSelectedDocRow(null);
            setSelectedDocument(null);
        }
    };
    
    return (
        <div className="flex flex-col shadow-inner">
          <div className="title-container w-full border-b">
              {/* <h2 className="form-title text-lg md:text-xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">Case Overview</h2> */}
     
              <div className="title-container w-full flex justify-center items-center">
                    <div className="flex flex-row text-center gap-3">
                <h2 className="form-title text-lg md:text-xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">Case Overview</h2>
                <h2 className="form-title text-lg md:text-xl text-gray-600 mt-2 md:mt-4 mb-2 md:mb-4 ">{currentStep}/3</h2>
              </div>
            </div>
          </div>
          {/* <div className="form-wrap flex flex-col md:flex-row"> */}
          {currentStep === 1 && (
      
            <div className="form-container-1 w-full  flex flex-col justify-center items-center bg-white px-0 rounded-sm  lg:mx-0 ">
                <div className="content-containter w-full md:w-2/3 lg:w-1/2 flex flex-col px-10 pt-6">
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseNo" className=" text-gray-500 text-xs font-medium	mb-1">Case No</label>
                        <p>{caseInfo.caseNo}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium	mb-1">Case Title</label>
                        <p>{caseInfo.caseTitle}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseType" className=" text-gray-500 text-xs font-medium	mb-1">Case Type</label>
                        <p>{caseInfo.caseType}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseDescription" className=" text-gray-500 text-xs font-medium	mb-1">Case Description</label>
                        <p>{caseInfo.caseDescription}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseAssignee" className=" text-gray-500 text-xs font-medium	mb-1">Case Assignee</label>
                        <p>{caseInfo.caseAssignee}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="createdAt" className=" text-gray-500 text-xs font-medium	mb-1">Date and Time of Creation</label>
                        <p>{formattedDate} {formattedTime}</p>
                    </div>
                </div>
            <div className="buttons-containter-wrap w-full flex my-3 lg:mt-3 justify-center border-t border-b ">
              <div className="buttons-content w-full md:w-2/3 lg:w-1/2 flex justify-end px-10 pt-6 pb-9 " >
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
                    <h1 className="text-center py-5">Parties Involved</h1>


                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium mb-1">Case Plaintiff</label>
                        <div className="flex flex-row gap-1">
                            <p>{caseInfo.plaintiff}</p>
                            <p>{caseInfo.plaintiffUPIN}</p>
                        </div>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium mb-1">Case Defendant</label>
                        <div className="flex flex-row gap-1">
                            <p>{caseInfo.defendant}</p>
                            <p>{caseInfo.defendantUPIN}</p>
                        </div>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium mb-1">Case Witness</label>
                        <div className="flex flex-row gap-1">
                            <p>{caseInfo.witness}</p>
                            <p>{caseInfo.witnessUPIN}</p>
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
            
            <div className="form-container-2 w-full flex flex-col px-0 lg:mx-0 justify-center items-center bg-white  rounded-sm  border-b ">
                <div className="section-wrap w-full md:2/3 lg:w-2/5 px-10 md:px-16 mb-5">
                    <h1 className="text-center py-5">Documents</h1>
                    <button
                        className="text-blue-600 hover:text-blue-900 mt-3 mb-5 border py-1 px-2 rounded text-sm"
                        onClick={() => setShowAssignCase(caseNo)}
                        >
                        Attach Documents
                    </button>
                    <div className="table-wrap w-full border">
                        <table className="table-assign w-full divide-y divide-gray-200 rounded-sm ">
                            <thead className="bg-gray-100 sticky border-r top-0 ">
                                <tr className="">
                                    <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Type</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 border-r">
                                {caseInfo.documents.map((document, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{document.docNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.docTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.docDescription}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.docType}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                        {/* <div className="buttons-2 w-1/2 h-1/2 flex justify-end">
                            <button onClick={handleNextStep} 
                                className=" h-full px-10 py-2 text-sm bg-white text-gray-600 rounded 
                                hover:bg-gray-50 border focus:outline-none hover:border-gray-300 hover:text-w">
                                Next
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>

        )}
            
            {showAssignCase && ( 
                <div className="confirmation-wrap fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center text-black">
                    <div className="confirmation-container w-11/12 md:w-1/2 flex flex-col justify-center items-center bg-white rounded-sm text-gray-600">
                        <h2 className="confirmation-title w-full px-8 md:px-16 py-8 text-center text-xl md:text-2xl border-b text-gray-600">
                            Add Documents
                        </h2>                
                        <p className="confirmation-content w-full text-sm md:text-base  py-5 px-8 md:px-16 text-gray-600 text-justify">
                                Append documents to case
                        </p>
                        <div className="w-full px-8 md:px-16 mb-5"> 
                            <div className="table-wrap w-full border">
                                <table className="table-assign w-full divide-y divide-gray-200 rounded-sm ">
                                    <thead className="bg-gray-50 sticky border-r top-0 ">
                                        <tr className="">
                                            <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">No</th>
                                            <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 border-r">
                                    {documents.map((document, index) => (
                                                <tr 
                                                    key={index} 
                                                    onClick={() => handleRowClick(document, index)}
                                                    className={`document-item ${
                                                        index % 2 === 0 ? 'bg-gray-50 hover:bg-red-100' : 'bg-white hover:bg-red-100'
                                                    } ${
                                                        index === selectedDocRow ? 'selected-row bg-red-300 text-white' : ''
                                                    }`}>
                                                    <td className={`px-6 text-xs md:text-sm xl:text-base text-gray-500 ${ index === selectedDocRow ? ' bg-red-100' : '' }`}>{document.docNo}</td>                         
                                                    <td className={`px-6 text-xs md:text-sm xl:text-base text-gray-500 ${ index === selectedDocRow ? ' bg-red-100' : '' }`}>{document.docTitle}</td>                         
                                                    <td className={`px-6 text-xs md:text-sm xl:text-base text-gray-500 ${ index === selectedDocRow ? ' bg-red-100' : '' }`}>{document.docDescription}</td>                         
                                                    <td className={`px-6 text-xs md:text-sm xl:text-base text-gray-500 ${ index === selectedDocRow ? ' bg-red-100' : '' }`}>{document.docType}</td>                         
                                                </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>









                        
                        <div className="buttons-containter-wrap w-full lg:mt-3 pr-8 border-t">
                            <div className="flex justify-end gap-6 py-3 md:py-6">
                                {/* <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 hover:text-gray-800 focus:outline-none border" onClick={handleConfirm}>{button1}
                                </button>
                                <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 hover:text-gray-800  focus:outline-none border" onClick={handleClose}>{button2}
                                </button> */}
                                <button 
                                className="px-4 py-2 text-xs md:text-base bg-white text-gray-500 rounded hover:bg-gray-50  hover:border-green-100 focus:outline-none border"
                                onClick={handleConfirm}
                                >Confirm
                                </button>
                                <button 
                                className="px-4 py-2 text-xs md:text-base bg-white text-gray-500  rounded hover:bg-gray-50  hover:border-red-100  focus:outline-none border" 
                                onClick={handleClose}
                                >Cancel
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

export default CaseInfo