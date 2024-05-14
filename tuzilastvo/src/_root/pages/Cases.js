import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useConfigContext } from "../../context/ConfigContext";
import React from "react";
import './style.css';
import { Notification } from '../../components';
const Cases = () => {
    const { isAuthenticated } = useAuth();
    const { configured } = useConfigContext();
    const navigate = useNavigate();
    const [showAssignCase, setShowAssignCase] = useState(null);
    const [cases, setCases] = useState([]); 
    // const [selectedCase, setSelectedCase] = useState(null);
    const [selectedProsecutor, setSelectedProsecutor] = useState(null);
    const [selectedAssigneeRow, setSelectedAssigneeRow] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState(null);

    const [prosecutors, setProsecutors] = useState([]);
  //   const [prosecutors, setProsecutors] = useState([
  //     { firstName: 'John', lastName: 'Doe', specialization: 'Criminal Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Alice', lastName: 'Johnson', specialization: 'Family Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Alice', lastName: 'Johnson', specialization: 'Family Law' },
  //     { firstName: 'John', lastName: 'Doe', specialization: 'Criminal Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Alice', lastName: 'Johnson', specialization: 'Family Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Alice', lastName: 'Johnson', specialization: 'Family Law' },
  //     { firstName: 'John', lastName: 'Doe', specialization: 'Criminal Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Alice', lastName: 'Johnson', specialization: 'Family Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Alice', lastName: 'Johnson', specialization: 'Family Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Jane', lastName: 'Smith', specialization: 'Corporate Law' },
  //     { firstName: 'Alice', lastName: 'Johnson', specialization: 'Family Law' }
  // ]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            await fetchProsecutorsInfo();
            await fetchCases();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);

      const fetchCases = async () => {
        try {
          const response = await fetch("http://localhost:8010/cases/", {
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
          setCases(data.cases);
          console.log(data); 
          // console.log(data.cases.caseAssignee); 

        } catch (error) {
          console.error('Error fetching cases:', error);
        }
      };

      const fetchProsecutorsInfo = async () => {
        try {
          const response = await fetch("http://localhost:8010/users/prosecutors", {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch prosecutors info');
          }
      
          const data = await response.json();
          setProsecutors(data);
            console.log(data);
        } catch (error) {
          console.error('Error fetching prosecutors info:', error);
        }
      };


    // useEffect(() => {
    //   const fetchCases = async () => {
    //     try {
    //       const response = await fetch("http://localhost:8010/cases/", {
    //         method: "GET",
    //         credentials: "include",
    //         headers: {
    //           "Cache-Control": "no-cache",
    //         },
    //       });
  
    //       if (response.ok) {
    //         const data = await response.json();
    //         setCases(data.cases); 
    //         console.log(data.cases);
    //       } else {
    //         throw new Error('Failed to fetch cases');
    //       }
    //     } catch (error) {
    //       console.error('Error fetching cases:', error);
    //     }
    //   };
  
    //   fetchCases();
  
    // }, []);

    const routes = [
        { path: '/cases/new-case', label: 'Case', },
    ];

    const handleRouteClick = (path) => {
        navigate(path);
      };

    const sections = [
        { icon: require('../../icons/case1.svg').default, text: "Create Case" },
        { icon: require('../../icons/case3.svg').default, text: "General" },

        { icon: require('../../icons/case7.svg').default, text: "In progress" },
        { icon: require('../../icons/case2.svg').default, text: "Archived" },
        { icon: require('../../icons/case4.svg').default, text: "Assigned" },
        { icon: require('../../icons/case5.svg').default, text: "Unassigned" }
      ];
      
      const headerTitles = ['#', 'Case NO', 'Case Title', 'Type', 'Creation Date', 'Last Update', 'Assignee', 'Action'];


      // const cases = [
        // { id: 56456, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", caseAssignee: "John Doe" },
        // { id: 5645, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        // { id: 564, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
        // { id: 1, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", responsible: "John Doe" },
        // { id: 2, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        // { id: 54645, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
        // { id: 1, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", responsible: "John Doe" },
        // { id: 2, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        // { id: 3, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
        // { id: 1, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", responsible: "John Doe" },
        // { id: 2, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        // { id: 3, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
      //   { 
      //     caseNo: "12345", caseTitle: "Sample Case Title 2", caseDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", caseType: "Civil", 
      //     plaintiff: "Eve Johnson", defendant: "Charlie Brown", witness: ["Witness 3", "Witness 4"], 
      //     createdAt: "2024-05-03T10:45:00.123+00:00", updatedAt: "2024-05-06T08:20:00.456+00:00", caseAssignee: "" 
      //   },
      //   { 
      //     caseNo: "12345", caseTitle: "Sample Case Title 2", caseDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", caseType: "Civil", 
      //     plaintiff: "Eve Johnson", defendant: "Charlie Brown", witness: ["Witness 3", "Witness 4"], 
      //     createdAt: "2024-05-03T10:45:00.123+00:00", updatedAt: "2024-05-06T08:20:00.456+00:00", caseAssignee: "Jane Smith" 
      //   }
    
      // ];
    
    const handleRowClick = (prosecutor, index) => {
      // console.log(prosecutor)
      setSelectedAssigneeRow(index);
      setSelectedProsecutor(prosecutor);
  };

  const handleAssignConfirm = async () => {
    // console.log(selectedAssigneeRow);
    // console.log(selectedProsecutor.UPIN);
    // console.log(showAssignCase);

    if (selectedProsecutor && showAssignCase) {
        try {
            const response = await fetch(`http://localhost:8010/cases/assign`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    caseNumber: showAssignCase,
                    prosecutorUPIN: selectedProsecutor.UPIN,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to assign case');
            }
            // console.log('Case assigned successfully'); 

            setMessage('Case assigned successfully');
            setShowNotification(true);
            setShowAssignCase(false);
            setSelectedProsecutor(null);
            setSelectedAssigneeRow(null); 

            setTimeout(() => {
              window.location.reload();
          }, 5000);

          } catch (error) {
            console.error('Error assigning case:', error);

          }
    }
  };

  const handleAssignClose = () => {
    setShowAssignCase(false);
    setSelectedAssigneeRow(null);
    setShowAssignCase(null);
  };



  const extractNameFromAssignee = (assignee) => {
    if (!assignee) return null;
    const UPIN = assignee;
    if (!UPIN) return null;
    const prosecutor = prosecutors.find(prosecutor => prosecutor.UPIN === UPIN);
    if (prosecutor) {
        return `${prosecutor.firstName} ${prosecutor.lastName}`;
    } else {
        return null;
    }
};

const handleInspect = (caseNo) => {
  navigate(`/cases/case/${caseNo}`);
};

  return (
    <div className="cases-wrap h-full w-full flex flex-col md:flex-row justify-center 
    border-t shadow-inner">
      <div className="section-side-left 
        h-20 md:h-full w-full md:w-52 lg:w-72
        flex flex-row md:flex-col
        md:px-4 md:pt-16
        items-start md:gap-2 ld:gap-6 
        order-2 md:order-1 
        border-t 
        text-sm tracking-tighter
        "> 

{/* md:border-r  */}
{/* md:border-r  */}
    {sections.map((section, index) => (
      <div
        key={index}
        className={`status-cont h-full md:h-14 w-full 
        flex flex-col md:flex-row 
        py-8 md:pl-8 lg:pl-10
        items-center justify-center md:gap-6 
        md:text-base lg:text-lg text-white
        cursor-not-allowed
        ${ index === 0
            ? "item1 hidden md:pb-12 md:mt-16 md:flex  cursor-pointer"
            : ""
        }
        ${
          index === 3
            ? "item4 md:pb-12  "
            : ""
        }${
          index === 5
            ? "md:-mt-4"
            : ""
        }
        `}
        // ${ index === 0
        //     ? "item1 hidden md:pb-12 md:flex md:border-b md:border-gray-300 cursor-pointer"
        //     : ""
        // }
        // ${
        //   index === 3
        //     ? "item4 md:pb-12  md:border-b md:border-gray-300"
        //     : ""
        // }${
        //   index === 5
        //     ? "md:-mt-4"
        //     : ""
        // }
        
      >
        <img src={section.icon} alt="Icon" className="case-icon w-4 h-4 md:w-5 md:h-5
         mb-1 md:mb-0" />
        {/* <img src={require('../../icons/AAAA.svg').default} alt="Icon" className="case-icon w-6 h-6 mb-2 md:mb-0" /> */}
        <p className="md:w-2/3 text-sm">{section.text}</p>
      </div>
            
    ))}
    </div>
    <div  className="section-side-right  h-full flex-grow order-1 md:order-2 ">
        <div className="title-filter1-wrap w-full flex flex-row pl-4 md:pl-10 pr-7 md:pr-10 lg:pr-20 ">
            <div className="title-filter1 flex py-6 pl-2 md:pl-0 md:py-10 ">
                <h1 className="text-2xl md:text-3xl text-gray-700">CASES</h1>
            </div>
            <div className="buttons-wrap w-full flex flex-row pl-8 justify-between items-center">
                <div className="flex flex-row items-center md:ml-5">
                    <h1 className="text-xs md:text-base mr-2 font-thin">Filter on:</h1>
                    <div className="inline-flex w-24 md:w-48 h-6 md:h-7">
                        <button className="flex-1 bg-gray-100 hover:bg-gray-300 text-xs md:text-sm hover:text-white rounded-l-sm cursor-not-allowed">My</button>
                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-xs md:text-sm  hover:text-white  rounded-r-sm cursor-not-allowed">Other</button>
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <img src="/new1.ico" alt="Icon" className="w-4 h-4 mr-0 md:mr-2 " />
                    <h1 className="md:text-base lg:text-lg hidden md:flex cursor-pointer">
                        <a onClick={() => handleRouteClick(routes[0].path)}>Create Case</a>
                    </h1>
                </div>
            </div>
            
        </div>

        <div className="relative flex pl-4 md:pl-7 pr-3 md:pr-8 w-full">
            <input
                type="search"
                className="
                relative m-0 block flex-auto w-full rounded-tl-sm rounded-bl-sm  border-l border-t border-b border-solid border-gray-300 bg-transparent bg-clip-padding 
                px-3 pl-5 py-[0.25rem] text- font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out
                placeholder:text-gray-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none cursor-not-allowed
                "
                placeholder="Search"
                aria-label="Search"
                id="exampleFormControlInput2"
                aria-describedby="button-addon2" />
            <span
                className="flex items-center whitespace-nowrap rounded-tr-sm rounded-br-sm border-r border-t border-b px-3 border-solid  border-gray-300 py-[0.25rem] text-surface  [&>svg]:h-5 [&>svg]:w-5"
                id="button-addon2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </span>
        </div>

        <div className="relative flex pl-4 md:pl-7 pr-3 md:pr-8 w-full mt-5  ">
        <div className="w-full max-h-[60vh] overflow-y-auto border border-gray-300">

                <table className="min-w-full divide-y divide-gray-200  rounded-sm ">
                <thead className="bg-gray-50">
                <tr>
                    {headerTitles.map((title, index) => (
                        <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {title}
                        </th>
                    ))}
                </tr>
                </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cases.map((caseItem, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>

                              
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                {caseItem.caseNo.toString().padStart(7, '0')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {caseItem.caseTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {caseItem.caseType ? caseItem.caseType.charAt(0).toUpperCase() + caseItem.caseType.slice(1) : "None"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(caseItem.createdOn).toLocaleString()} 
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(caseItem.updatedOn).toLocaleString()} 
                            </td>

<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {extractNameFromAssignee(caseItem.caseAssignee) ? (
    <span>{extractNameFromAssignee(caseItem.caseAssignee)}</span>
  ) : (
    <button
      className="text-blue-600 hover:text-blue-900"
      onClick={() => setShowAssignCase(caseItem.caseNo)}
    >
      Assign
    </button>
  )}
</td>


{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {extractNameFromAssignee(caseItem.caseAssignee) ? (
    <span>{extractNameFromAssignee(caseItem.caseAssignee)}</span>
  ) : (
    <button
      className="text-blue-600 hover:text-blue-900"
      onClick={() => setShowAssignCase(caseItem.caseNo)}
    >
      Assign
    </button>
  )}
</td> */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button 
                                      className="text-blue-600 hover:text-blue-900"
                                      onClick={() => handleInspect(caseItem.caseNo)}
                                  >
                                      Inspect
                                  </button>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                </table>
        </div>
        </div>
        
    {showAssignCase && ( 
        <div className="confirmation-wrap fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center text-black">
           <div className="confirmation-container w-11/12 md:w-1/2 flex flex-col justify-center items-center bg-white rounded-sm text-gray-600">
           <h2 className="confirmation-title w-full px-8 md:px-16 py-8 text-center text-xl md:text-2xl border-b text-gray-600">
              Assign Case No: {showAssignCase.toString().padStart(7, '0')}
          </h2>                
          <p className="confirmation-content w-full text-sm md:text-base py-5 px-8 md:px-16 text-gray-600 text-justify">
            By assigning Case No. 1 to one of the prosecutors, you are assigning responsibility for handling this case to a 
            specific user or team. This action may affect the workflow and progress of the case. Please ensure that the 
            assignment is appropriate and necessary before proceeding.
          </p>
          <p className="confirmation-content w-full text-sm md:text-base  py-5 px-8 md:px-16 text-gray-600 text-justify">
            Assign to Prosecutor:
          </p>
          <div className="w-full px-8 md:px-16 mb-5"> 
            <div className="table-wrap w-full border">
              <table className="table-assign w-full divide-y divide-gray-200 rounded-sm ">
                <thead className="bg-gray-50 sticky border-r top-0 ">
                  <tr className="">
                      <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">First Name</th>
                      <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Last Name</th>
                      <th className="px-6 py-3 text-left text-xs md:text-sm xl:text-base text-gray-500  tracking-wider">Specialization</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 border-r">
              {prosecutors.map((prosecutor, index) => (
                      <tr 
                      key={index} 
                      onClick={() => handleRowClick(prosecutor, index)}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50 hover:bg-red-100' : 'bg-white hover:bg-red-100'
                    } ${
                        index === selectedAssigneeRow ? 'selected-row bg-red-300 text-white' : ''
                    }`}   
                    >                   

                          <td className={`px-6 text-xs md:text-sm xl:text-base text-gray-500 ${ index === selectedAssigneeRow ? ' bg-red-100' : '' }`}>{prosecutor.firstName}</td>                         
                          <td className={`px-6 text-xs md:text-sm xl:text-base text-gray-500 ${ index === selectedAssigneeRow ? ' bg-red-100' : '' }`}>{prosecutor.lastName}</td>                         
                          <td className={`px-6 text-xs md:text-sm xl:text-base text-gray-500 ${ index === selectedAssigneeRow ? ' bg-red-100' : '' }`}>{prosecutor.specialization}</td>                          
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
                        onClick={handleAssignConfirm}
                         >Confirm
                        </button>
                        <button 
                        className="px-4 py-2 text-xs md:text-base bg-white text-gray-500  rounded hover:bg-gray-50  hover:border-red-100  focus:outline-none border" 
                        onClick={handleAssignClose}
                        >Cancel
                        </button>
                     
                    </div>
                </div>
           </div>
         </div>
    )}


    {showNotification && <Notification message={message} onClose={() => setShowNotification(false)} />}
    </div>

  </div>


  );
};

export default Cases;
