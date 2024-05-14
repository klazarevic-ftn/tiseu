import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Notification } from '../../components';

const CaseInfo = () => {
    const [caseInfo, setCaseInfo] = useState(null);

    const [caseNumb, setCaseNumb] = useState(null);
    const params = useParams();
    const caseNo = params.caseNo;
    // console.log("Case number:", caseNo);
 
    useEffect(() => {
        const fetchData = async () => {
          try {
            // console.log("Fetching case info...");
            await fetchCaseInfo();
            await fetchDocuments();
            // console.log("cased", documents);

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);

    const fetchCaseInfo = async () => {
        try {

            // console.log("Fetching case info from API...");
            const response = await fetch(`http://localhost:8010/cases/case/${caseNo}`);
            if (!response.ok) {
                throw new Error('Failed to fetch case info');
            }
            const data = await response.json();
            setCaseInfo(data.caseInfo);
            // console.log("BBB", data.caseInfo);
            // console.log("AAA", data.caseInfo.caseTitle);

            const createdOn = new Date(data.caseInfo.createdOn);
            const formattedDate = createdOn.toDateString();
            const formattedTime = createdOn.toLocaleTimeString(); 
            setFormattedDate(formattedDate);
            setFormattedTime(formattedTime);
            // console.log("docssss",data.caseInfo.documents);

            setCaseDocuments(data.caseInfo.documents);
            // console.log("docsss", caseDocuments);
            // console.log("sdaasd", data.caseInfo.documents);
            // console.log("CASE DOCUMENTS: ", data.caseInfo.documents);

        } catch (error) {
            setError(error.message);
        }
    };

    
    const fetchDocuments = async () => {
        try {
          const response = await fetch("http://localhost:8010/docs/", {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch cases');
          }
          
          const data = await response.json();
          setDocuments(data.documents);
          console.log("ALL DOCUMENTS: ", data.documents); 
          // console.log(data.cases.caseAssignee); 
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };

      const [caseDocuments, setCaseDocuments] = useState([]); 
      const [documents, setDocuments] = useState([]); 
      // const [documents, setDocuments] = useState([
      //     {
      //         docNo: 1,
      //         docTitle: "Document 1",
      //         docDescription: "Description of Document 1",
      //         docType: "Type A",
      //     },
      //     {
      //         docNo: 2,
      //         docTitle: "Document 2",
      //         docDescription: "Description of Document 2",
      //         docType: "Type B",
      //     },
      //     {
      //         docNo: 3,
      //         docTitle: "Document 3",
      //         docDescription: "Description of Document 3",
      //         docType: "Type C",
      //     }
      // ]);
    
      

    const [currentStep, setCurrentStep] = useState(1); 
    // const [caseInfo, setCaseInfo] = useState({
    //     caseNo: "54321",
    //     caseTitle: "Sample Case Title 2",
    //     caseDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elrem ipsum dolor sit amet, consectetur adipiscing elit.",
    //     caseType: "Criminal",
    //     plaintiff: "Alice Smith",
    //     plaintiffUPIN: "UPIN123",
    //     defendant: "Bob Johnson",
    //     defendantUPIN: "UPIN456",
    //     witness: "Aa BBBbb",
    //     witnessUPIN: "UPIN456",
    //     createdAt: new Date().toISOString(), // Format: 2024-04-27T14:01:56.708+00:00
    //     caseAssignee: "Bob Bobovich",
    //     documents: []
    // });

    const [formattedDate, setFormattedDate] = useState(null);
    const [formattedTime, setFormattedTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    



    const [showAssignDocument, setShowAssignDocument] = useState(null);


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
        setShowAssignDocument(false);
        setSelectedDocRow(null);
        setSelectedDocument(null);
      };


    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState(null);

    const handleConfirm = async () => {
        if (selectedDocRow !== null && selectedDocument !== null) {
            try {
                const assignmentResult = await assignDocumentToCase(caseNo, selectedDocument.docNo);
                if (assignmentResult && assignmentResult.case) {


                    setMessage('Document added to case successfully');
                    setShowNotification(true);
                    setShowAssignDocument(false);
                    setSelectedDocRow(null);
                    setSelectedDocument(null);

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    console.error('Failed to assign document to case:', assignmentResult.error);
                }
    
            } catch (error) {
                console.error('Error handling confirm:', error);
            }
        }
    };

    const assignDocumentToCase = async (caseNo, documentNo) => {
        // console.log("aaa", caseNo); 
        // console.log("bcvfdg", documentNo); 
        try {
            const response = await fetch(`http://localhost:8010/cases/case/assign-doc`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    caseNo: caseNo,
                    documentNo: documentNo,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to assign document to case');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error assigning document to case:', error);
            throw error;
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

          {currentStep === 1 && (
      
            <div className="form-container-1 w-full  flex flex-col justify-center items-center bg-white px-0 rounded-sm  lg:mx-0 ">
                <div className="content-containter w-full md:w-2/3 lg:w-1/2 flex flex-col px-10 pt-6">
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseNo" className=" text-gray-500 text-xs font-medium	mb-1">Case No</label>
                        <p>{caseInfo && caseInfo.caseNo}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="caseTitle" className=" text-gray-500 text-xs font-medium	mb-1">Case Title</label>
                        <p>{caseInfo && caseInfo.caseTitle}</p>
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
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
                    </div>
                    <div className="field-wrap flex flex-col w-full text-sm mb-4">
                        <label htmlFor="createdOn" className=" text-gray-500 text-xs font-medium	mb-1">Date and Time of Creation</label>

                        <p>{formattedDate} {formattedTime}</p>
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
                        onClick={() => setShowAssignDocument(caseNo)}
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
                            {caseDocuments.map((docNo, index) => {
    // Find the document object that matches the docNo from caseDocuments
    const document = documents.find(doc => doc.docNo === parseInt(docNo));
    if (!document) return null; // Skip if document not found
    return (
        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{document.docNo}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.docTitle}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.docDescription}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.docType}</td>
        </tr>
    );
})}
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
                
                    </div>
                </div>
            </div>

        )}
            
            {showAssignDocument && ( 
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
                            {documents
    .filter(document => !caseDocuments.includes(document.docNo.toString()))
    .map((document, index) => (
                                    <tr 
                                        key={index} 
                                        onClick={() => handleRowClick(document, index)}
                                        className={`document-item ${
                                            index % 2 === 0 ? 'bg-gray-50 hover:bg-red-100' : 'bg-white hover:bg-red-100'
                                        } ${
                                            index === selectedDocRow ? 'selected-row bg-red-300 text-white' : ''
                                        }`}
                                    >
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