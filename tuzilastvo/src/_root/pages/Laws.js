import React, { useState, useEffect } from 'react';

const Laws = () => {
  const [orderId, setOrderId] = useState('');
  const [caseId, setCaseId] = useState('');
  const [laws, setLaws] = useState([]);

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const response = await fetch('http://localhost:8010/laws/');
        if (response.ok) {
          const data = await response.json();
          setLaws(data.laws); 
        //   console.log(data.laws); 
        } else {
          console.error('Failed to fetch laws');
        }
      } catch (error) {
        console.error('Error fetching laws:', error.message);
      }
    };

    fetchLaws();
  }, []);


  const headerTitles = ['#', 'Legislation NO', 'Title', 'Type', 'Authority', 'Creation Date', 'Last Update'
];


  return (
    <div className="cases-wrap h-full w-full lg:w-8/12 md:w-10/12 mx-auto flex flex-col md:flex-row justify-center 
    border-t shadow-inner">

    <div  className="section-side-right  h-full flex-grow order-1 md:order-2 ">
        <div className="title-filter1-wrap w-full flex flex-row pl-4 md:pl-10 pr-7 md:pr-10 lg:pr-20 ">
            <div className="title-filter1 flex py-6 pl-2 md:pl-0 md:py-10 ">
                <h1 className="text-2xl md:text-3xl text-gray-700">LEGISLATIONS</h1>
            </div>
            {/* <div className="buttons-wrap w-full flex flex-row pl-8 justify-between items-center">
                <div className="flex flex-row items-center md:ml-5">
                    <h1 className="text-xs md:text-base mr-2 font-thin">Filter on:</h1>
                    <div className="inline-flex w-24 md:w-48 h-6 md:h-7">
                        <button className="flex-1 bg-gray-100 hover:bg-gray-300 text-xs md:text-sm hover:text-white rounded-l-sm cursor-not-allowed">My</button>
                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-xs md:text-sm  hover:text-white  rounded-r-sm cursor-not-allowed">Other</button>
                    </div>
                </div> */}
                {/* <div className="flex flex-row items-center">
                    <img src="/new1.ico" alt="Icon" className="w-4 h-4 mr-0 md:mr-2 " />
                    <h1 className="md:text-base lg:text-lg hidden md:flex cursor-pointer">
                        <a onClick={() => handleRouteClick(routes[0].path)}>Create Case</a>
                    </h1>
                </div> */}
            {/* </div> */}
            
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
                        {laws.map((lawItem, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                    {lawItem.lawNo.toString().padStart(7, '0')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                    {`${lawItem.lawTitle.charAt(0).toUpperCase() + lawItem.lawTitle.slice(1)}`.substring(0, 10)}
                                    {lawItem.lawTitle.length > 10 && '...'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                    {lawItem.lawType.charAt(0).toUpperCase() + lawItem.lawType.slice(1)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                    {lawItem.authority.charAt(0).toUpperCase() + lawItem.authority.slice(1)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(lawItem.createdOn).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(lawItem.updatedOn).toLocaleString()}
                                </td>
                       
        
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button 
                                        className="text-blue-600 hover:text-blue-900"
                                        // onClick={() => handleInspect(trialItem.trialNo)}
                                    >
                                        Inspect
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                        </tbody>
                </table>
        </div>
        </div>
        
  


    </div>

  </div>


  );
}

export default Laws
