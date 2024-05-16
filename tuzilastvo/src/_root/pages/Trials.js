import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useConfigContext } from "../../context/ConfigContext";
import React from "react";
import './style.css';
import { Notification } from '../../components';
const Trials = () => {
    const { isAuthenticated } = useAuth();
    const { configured } = useConfigContext();
    const navigate = useNavigate();
    const [trials, setTrials] = useState([]); 
    // const [selectedCase, setSelectedCase] = useState(null);
    const [selectedProsecutor, setSelectedProsecutor] = useState(null);
    const [selectedAssigneeRow, setSelectedAssigneeRow] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState(null);

    const [prosecutors, setProsecutors] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
          try {
              await fetchTrials();
            // await fetchProsecutorsInfo();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);

      const fetchTrials = async () => {
        try {
          const response = await fetch("http://localhost:8010/trials/", {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch trials');
          }
          
          const data = await response.json();
          setTrials(data.trials);
          // console.log(data); 
          // console.log(data.cases.caseAssignee); 

        } catch (error) {
          console.error('Error fetching trials:', error);
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
            // console.log(data);
        } catch (error) {
          console.error('Error fetching prosecutors info:', error);
        }
      };


  
    const routes = [
        { path: '/cases/new-case', label: 'Case', },
    ];

    const handleRouteClick = (path) => {
        navigate(path);
      };

      
      const headerTitles = ['#', 'Trial NO', 'Case No', 'Trial Date', 'Creation Date', 'Action'];


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
      console.log(prosecutor)
      setSelectedAssigneeRow(index);
      setSelectedProsecutor(prosecutor);
  };




const handleInspect = (trialNo) => {
  console.log(trialNo)
  navigate(`/trials/trial/${trialNo}`);
};

  return (
    <div className="cases-wrap h-full w-full lg:w-8/12 md:w-10/12 mx-auto flex flex-col md:flex-row justify-center 
    border-t shadow-inner">

    <div  className="section-side-right  h-full flex-grow order-1 md:order-2 ">
        <div className="title-filter1-wrap w-full flex flex-row pl-4 md:pl-10 pr-7 md:pr-10 lg:pr-20 ">
            <div className="title-filter1 flex py-6 pl-2 md:pl-0 md:py-10 ">
                <h1 className="text-2xl md:text-3xl text-gray-700">TRIALS</h1>
            </div>
            <div className="buttons-wrap w-full flex flex-row pl-8 justify-between items-center">
                <div className="flex flex-row items-center md:ml-5">
                    <h1 className="text-xs md:text-base mr-2 font-thin">Filter on:</h1>
                    <div className="inline-flex w-24 md:w-48 h-6 md:h-7">
                        <button className="flex-1 bg-gray-100 hover:bg-gray-300 text-xs md:text-sm hover:text-white rounded-l-sm cursor-not-allowed">My</button>
                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-xs md:text-sm  hover:text-white  rounded-r-sm cursor-not-allowed">Other</button>
                    </div>
                </div>
                {/* <div className="flex flex-row items-center">
                    <img src="/new1.ico" alt="Icon" className="w-4 h-4 mr-0 md:mr-2 " />
                    <h1 className="md:text-base lg:text-lg hidden md:flex cursor-pointer">
                        <a onClick={() => handleRouteClick(routes[0].path)}>Create Case</a>
                    </h1>
                </div> */}
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
                        {trials.map((trialItem, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                    {trialItem.trialNo.toString().padStart(7, '0')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                    {trialItem.caseNo.toString().padStart(7, '0')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(trialItem.trialDate).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(trialItem.createdOn).toLocaleString()}
                                </td>
                   
        
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button 
                                        className="text-blue-600 hover:text-blue-900"
                                        onClick={() => handleInspect(trialItem.trialNo)}
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
        
  


    {showNotification && <Notification message={message} onClose={() => setShowNotification(false)} />}
    </div>

  </div>


  );
};

export default Trials;
