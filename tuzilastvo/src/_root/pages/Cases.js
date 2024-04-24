import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useConfigContext } from "../../context/ConfigContext";
import React from "react";

const Cases = () => {
    const { isAuthenticated } = useAuth();
    const { configured } = useConfigContext();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (isAuthenticated) {
        console.log("bbb" ,isAuthenticated)
        navigate('/cases');
      }
      else {
        console.log("aaa" ,isAuthenticated)

        navigate('/');
      }
    }, [isAuthenticated, navigate]);















    const routes = [
        { path: '/case', label: 'Case', },
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
      
      const headerTitles = ['#', 'Case ID', 'Status', 'Created At', 'Last Update', 'Responsible', 'Action'];


      const cases = [
        { id: 56456, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", responsible: "John Doe" },
        { id: 5645, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        { id: 564, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
        { id: 1, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", responsible: "John Doe" },
        { id: 2, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        { id: 54645, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
        { id: 1, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", responsible: "John Doe" },
        { id: 2, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        { id: 3, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
        { id: 1, status: "New", createdAt: "2024-04-20 T08:00:00", lastUpdate: "2024-04-21 T10:30:00", responsible: "John Doe" },
        { id: 2, status: "InProgress", createdAt: "2024-04-19 T09:15:00", lastUpdate: "2024-04-20 T11:45:00", responsible: "Jane Smith" },
        { id: 3, status: "Resolved", createdAt: "2024-04-18 T10:45:00", lastUpdate: "2024-04-19 T12:20:00", responsible: "Alex Johnson" },
        // Add more cases as needed
    ];
    
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
                placeholder:text-gray-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none
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
                                {caseItem.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {caseItem.status}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {caseItem.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {caseItem.lastUpdate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {caseItem.responsible}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-900">Inspect</button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                </table>
        </div>
        </div>
        
    </div>
  </div>



    // <div className="cases-wrap h-full w-full flex  flex-col md:flex-row justify-center border-t shadow-inner	">
    //   {/* <div className="cases-container h-full w-full flex flex-col md:flex-row"> */}

    //     <div className="section-side-left h-20 md:h-full w-full md:w-52 lg:w-72 md:px-4 flex flex-row md:flex-col items-center justify-center order-2 md:order-1 border-t md:border-r text-sm tracking-tight">

    //         {/* <div className="section-wrap h-full w-full flex flex-row md:flex-col "> */}
    //             {/* <div className="sec-status-wrap w-full md:w-full h-full md:h-1/3 items-center justify-center "> */}
    //                 {/* <div className="sec-status-content-wrap w-full h-full flex flex-row md:flex-col items-center justify-center tracking-tight	"> */}




    //                     <div className="status-cont w-full h-full hidden md:h-1/6 md:flex flex-col md:flex-row items-center justify-center md:gap-5 md:text-lg md:font-light">
    //                         <img src="file6.ico" alt="Icon" className="w-4 h-4 mb-2 md:mb-0"/> 
    //                         <p className="md:w-2/3">New Case</p>
    //                     </div>


    //                     <div className="border-l border-gray-400 w-1 h-5/6 md:hidden"></div> 
    //                     <div className="status-cont w-5/6 hidden md:flex flex-col  md:flex-row items-center justify-center md:border-t border-gray-400"></div>



    //                     <div className="status-cont w-full h-full md:h-1/6 flex flex-col md:flex-row items-center justify-center md:gap-5 md:text-lg md:font-light">
    //                         <img src="file6.ico" alt="Icon" className="w-4 h-4 mb-2 md:mb-0"/> 
    //                         <p className="md:w-2/3">General</p>
    //                     </div>



    //                     <div className="status-cont w-full h-full md:h-1/6 flex flex-col md:flex-row items-center justify-center md:gap-5 md:text-lg md:font-light">
    //                         <img src="file.ico" alt="Icon" className="w-4 h-4 mb-2 md:mb-0"/> 
    //                         <p className="md:w-2/3">In progress</p>
    //                     </div>
    //                     <div className="status-cont w-full h-full md:h-1/6 flex flex-col md:flex-row items-center justify-center md:gap-5 md:text-lg md:font-light">
    //                         <img src="file7.ico" alt="Icon" className="w-4 h-4 mb-2 md:mb-0"/>  
    //                         <p className="md:w-2/3">Archived</p>
    //                     </div>

    //                     <div className="border-l border-gray-400 w-1 h-5/6 md:hidden"></div> 
    //                     <div className="status-cont w-5/6 hidden md:flex flex-col  md:flex-row items-center justify-center md:border-t border-gray-400"></div>



    //                     <div className="status-cont w-full h-full md:h-1/6 flex flex-col md:flex-row items-center justify-center md:gap-5 md:text-lg md:font-light">
    //                         <img src="file14.ico" alt="Icon" className="w-4 h-4 mb-2 md:mb-0"/>  
    //                         <p className="md:w-2/3">Assigned</p>
    //                     </div>
    //                     <div className="status-cont w-full h-full md:h-1/6 flex flex-col md:flex-row items-center justify-center md:gap-5 md:text-lg md:font-light">
    //                         <img src="file3.ico" alt="Icon" className="w-4 h-4 mb-2 md:mb-0"/>  
    //                         <p className="md:w-2/3">Unassigned</p>
    //                     </div>
    //                 </div>
    //             {/* </div> */}

    //             {/* <div className="sec-assigned-wrap w-2/5 md:w-full h-full md:h-1/3 items-center justify-center">
    //                 <div className="sec-assigned-content-wrap w-full h-full flex flex-row md:flex-col items-center justify-center">
    //                     <div className="assigned-cont w-full h-full flex items-center justify-center">
    //                         <p>Assigned</p>
    //                     </div>
    //                     <div className="assigned-cont w-full h-full flex items-center justify-center">
    //                         <p>Unassigned</p>
    //                     </div>
    //                 </div>
    //             </div> */}
    //         {/* </div> */}
    //     {/* </div> */}





    //     <div className="section-side-right h-full order-1 md:order-2 flex-grow">
    //         <p>bbbbbbbbbbbbbbbb</p>
    //     </div>
    //   {/* </div> */}
    // </div>
  );
};

export default Cases;
