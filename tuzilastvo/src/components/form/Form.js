import React, { useState } from 'react';
import { useConfigContext } from '../../context/ConfigContext'; 
import { isFormValid } from '../../validations/configFormV';
import Notification from '../../components/pop-up/Notification';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom";

// const ValidationPopup = ({ message }) => {
//   return (
//     <div className="validation-wrap fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center  text-black overflow-y-auto items-start">
//       <div className="validation-container mt-40 flex flex-col w-1/2 md:w-1/3 lg:w-1/4  bg-white rounded relative  ">
//         <div className="title-container w-full border-b text-center">
//           <h2 className="form-title text-xl lg:text-2xl text-gray-700 py-5">Warning</h2>
//         </div>
//         <div className="message-container w-full border-b text-center">
//           <p className="message text-lg lg:text-xl text-gray-700 py-6 ">{message}</p>
//         </div>
//         <div className="button-container w-full  border-b text-center">
//           <button className="button border py-2 px-5 my-3 text-sm lg:text-base text-gray-700 rounded">Ok</button>
//         </div>
//       </div>
//     </div>
//   );
// };


const Form = ({ onClose, formType }) => {
  const { isConfigured, userData } = useConfigContext();
  const [showPopup, setShowPopup] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  console.log(userData);

  const hidePassword = (password) => {
    return password.replace(/./g, '*');
  };


  const handleDateChange = (date) => {
    setSelectedDate(date); 
  };

  const handleClose = () => {
    onClose(); 
  };

  const handleCloseNotification = () => {
    setShowPopup(false);
  };
  
  const handleSubmit = (e, isSecondForm) => {
    e.preventDefault();
    // console.log(userData.user.email);

    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;

    const UPIN = document.getElementById('UPIN').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const streetAddress = document.getElementById('streetAddress').value;
    const aptNumber = document.getElementById('aptNumber').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const phone = document.getElementById('phone').value;
  
    const formData = {
      firstName: firstName,
      lastName: lastName,
      UPIN: UPIN,
      dateOfBirth: dateOfBirth,
      streetAddress: streetAddress,
      aptNumber: aptNumber,
      city: city,
      country: country,
      phone: phone,
      userEmail: (userData && userData.email) ? userData.email : '',
    };

    console.log("AAAA" + formData.userEmail);
    if (isSecondForm) {
      formData.accountType = 'PROSECUTOR';
      const specialization = document.getElementById('specialization').value;
      const license = document.getElementById('license').value;
      formData.specialization = specialization;
      formData.license = license;
    } else {
      formData.accountType = 'CIVIL';
    }
    
    // const formValidityMessage = isFormValid(formData, isSecondForm);
    // if (formValidityMessage !== true) {
    //   setShowPopup(true);
    //   setErrorMessage(formValidityMessage);
    //   return;
    // }

    fetch("http://localhost:8010/users/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),

    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // setShowPopup(true);
      // setErrorMessage('Form submitted successfully.');
      navigate("/profile");
    })
    .catch(error => {
      console.error('Error:', error);
      // setShowPopup(true);
      // setErrorMessage('An error occurred while submitting the form.');
    });
   console.log(formData); 

    onClose(); 
  };
  
  



  
  return (
    <div>
      {formType === true && (
      <div className="form-wrap fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center text-black h-screen overflow-y-auto">
        <div className="form-container flex flex-col justify-center items-center bg-white pt-6 px-0 rounded-sm relative mx-10 lg:mx-0">
          <div className="title-container w-full border-b text-center">
            <h2 className="form-title text-2xl text-gray-600 mb-4 ">Account Configuration</h2>
          </div>


          <div className="content-containter flex flex-col px-10 pt-6 pb-9  border-b">
            <div className="first-last-n-wrap flex flex-row justify-between mb-4 ">
              <div className="field-wrap flex flex-col text-sm w-full mr-6">
                <label htmlFor="firstname" className=" text-gray-500 text-xs font-medium mb-1">First name</label>
                <input type="text" id="firstname" name="firstname" placeholder="Your first name"
                className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                focus:border-gray-300"></input>
              </div>
              <div className="field-wrap flex flex-col text-sm w-full">
                <label htmlFor="lastname" className=" text-gray-500 text-xs font-medium mb-1">Last name</label>
                <input type="text" id="lastname" name="lastname" placeholder="Your last name"
                className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                focus:border-gray-300"></input>
              </div>


            </div>
            <div className="field-wrap flex flex-col w-full text-sm mb-4">
                <label htmlFor="UPIN" className=" text-gray-500 text-xs font-medium	mb-1">UPIN</label>
                <input type="text" id="UPIN" name="UPIN" placeholder="Your UPIN"
                className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                focus:border-gray-300"></input>
            </div>


            <div className="sec-1 flex flex-row  mb-4">
              <div className="field-wrap w-1/3 flex flex-col text-sm mr-6">
                <label  className=" text-gray-500 text-xs font-medium mb-1">Date of birth</label>
                <DatePicker id="dateOfBirth" selected={selectedDate} onChange={handleDateChange}
                className="w-full h-10 border rounded-sm py-2 mr-2 bg-gray-50 focus:outline-none
                focus:border-gray-300 text-center"
                />
              </div>
              <div className="field-wrap flex flex-grow flex-col text-sm">
                <label htmlFor="phone" className=" text-gray-500 text-xs font-medium mb-1">Phone number</label>
                <input type="text" id="phone" name="phone" placeholder="Your phone number"
                className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                focus:border-gray-300"></input>
              </div> 
            </div>


            <div className="address-wrap flex flex-col text-sm mb-4">



              <div className="sec-1 flex flex-row  mb-4">
                <div className="field-wrap flex flex-col flex-grow text-sm mr-6">
                  <label htmlFor="Street Address" className=" text-gray-500 text-xs font-medium	mb-1">Street Address</label>
                  <input type="text" id="streetAddress" name="streetAddress" placeholder="Your street address"
                  className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                  focus:border-gray-300"></input>
                </div>
                <div className="field-wrap flex flex-col w-1/5 text-sm">
                  <label htmlFor="Apt. Number" className=" text-gray-500 text-xs font-medium	mb-1">Nmb.</label>
                  <input type="text" id="aptNumber" name="aptNumber" placeholder="Nmb."
                  className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                  focus:border-gray-300"></input>
                </div>
              </div>
              <div className="sec-2 flex flex-row">
              <div className="field-wrap flex flex-col w-full text-sm mr-6">
                  <label htmlFor="City" className=" text-gray-500 text-xs font-medium	mb-1">City</label>
                  <input type="text" id="city" name="city" placeholder="Your city"
                  className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                  focus:border-gray-300"></input>
                </div>
                <div className="field-wrap flex flex-col w-full text-sm">
                  <label htmlFor="Country" className=" text-gray-500 text-xs font-medium	mb-1">Country</label>
                  <input type="text" id="country" name="country" placeholder="Your country"
                  className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                  focus:border-gray-300"></input>
                </div>
              </div>
            </div>
            {/* <div className="field-wrap flex flex-col text-sm mb-4">
                <label htmlFor="phone" className=" text-gray-500 text-xs font-medium mb-1">Phone number</label>
                <input type="text" id="phone" name="phone" placeholder="Your phone number"
                className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                focus:border-gray-300"></input>
            </div> */}
            <div className="field-wrap flex flex-col text-sm mb-4">
                <label htmlFor="email" className=" text-gray-500 text-xs font-medium mb-1">E-Mail</label>
                <input 
                type="text" 
                id="email" 
                name="email" 
                placeholder="Your E-Mail"
                value={userData && userData.email ? userData.email : ''}
                className="w-full border rounded-sm px-4 py-2 text-gray-400 bg-gray-50 focus:outline-none
                focus:border-gray-300 cursor-not-allowed" 
                disabled></input>
            </div>
            <div className="field-wrap flex flex-col text-sm">
                <label htmlFor="password" className=" text-gray-500 text-xs font-medium mb-1">Password</label>
                <input type="text" id="password" name="password" placeholder="Your password"
                className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                focus:border-gray-300 cursor-not-allowed text-gray-400" 
          value={userData && userData.nickname ? hidePassword(userData.nickname) : ''}
                disabled></input>
            </div>

          </div>
          <div className="buttons-containter-wrap w-full my-3 lg:mt-3 pr-11">
            <div className="flex justify-end py-2 gap-6 ">
                <button 
                className="px-4 py-2 w-1/5 lg:h-1/4 bg-white text-gray-600 rounded hover:bg-gray-50  focus:outline-none border hover:border-green-200"
                onClick={(e) => handleSubmit(e, false)} 
                >Ok
                </button>
                <button 
                className="px-4 py-2 w-1/4 lg:w-3/12 bg-white text-gray-600 rounded hover:bg-gray-50  focus:outline-none border hover:border-red-200"
                onClick={handleClose} 
                >Cancel
                </button>
            </div>
          </div>
        </div>
      </div>
        )}

      {formType === false && (
     <div className="form-wrap fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center text-black h-screen overflow-y-auto">
     <div className="form-container flex flex-col justify-center items-center bg-white pt-6 px-0 rounded-sm relative mx-10 lg:mx-0">
       <div className="title-container w-full border-b text-center">
         <h2 className="form-title text-2xl text-gray-600 mb-4 ">Account Configuration</h2>
       </div>


       <div className="content-containter flex flex-col px-10 pt-6 pb-9  border-b">
         <div className="first-last-n-wrap flex flex-row justify-between mb-4 ">
           <div className="field-wrap flex flex-col text-sm w-full mr-6">
             <label htmlFor="firstname" className=" text-gray-500 text-xs font-medium mb-1">First name</label>
             <input type="text" id="firstname" name="firstname" placeholder="Your first name"
             className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
             focus:border-gray-300"></input>
           </div>
           <div className="field-wrap flex flex-col text-sm w-full">
             <label htmlFor="lastname" className=" text-gray-500 text-xs font-medium mb-1">Last name</label>
             <input type="text" id="lastname" name="lastname" placeholder="Your last name"
             className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
             focus:border-gray-300"></input>
           </div>


         </div>
         <div className="field-wrap flex flex-col w-full text-sm mb-4">
             <label htmlFor="UPIN" className=" text-gray-500 text-xs font-medium	mb-1">UPIN</label>
             <input type="text" id="UPIN" name="UPIN" placeholder="Your UPIN"
             className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
             focus:border-gray-300"></input>
         </div>


         <div className="sec-1 flex flex-row  mb-4">
           <div className="field-wrap w-1/3 flex flex-col text-sm mr-6">
             <label  className=" text-gray-500 text-xs font-medium mb-1">Date of birth</label>
             <DatePicker id="dateOfBirth" selected={selectedDate} onChange={handleDateChange}
             className="w-full h-10 border rounded-sm py-2 mr-2 bg-gray-50 focus:outline-none
             focus:border-gray-300 text-center" 
             />
           </div>
           <div className="field-wrap flex flex-grow flex-col text-sm">
             <label htmlFor="phone" className=" text-gray-500 text-xs font-medium mb-1">Phone number</label>
             <input type="text" id="phone" name="phone" placeholder="Your phone number"
             className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
             focus:border-gray-300"></input>
           </div> 
         </div>


         <div className="address-wrap flex flex-col text-sm mb-4">
           <div className="sec-1 flex flex-row  mb-4">
             <div className="field-wrap flex flex-col flex-grow text-sm mr-6">
               <label htmlFor="Street Address" className=" text-gray-500 text-xs font-medium	mb-1">Street Address</label>
               <input type="text" id="streetAddress" name="streetAddress" placeholder="Your street address"
               className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
               focus:border-gray-300"></input>
             </div>
             <div className="field-wrap flex flex-col w-1/5 text-sm">
               <label htmlFor="Apt. Number" className=" text-gray-500 text-xs font-medium	mb-1">Nmb.</label>
               <input type="text" id="aptNumber" name="aptNumber" placeholder="Nmb."
               className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
               focus:border-gray-300"></input>
             </div>
           </div>
           <div className="sec-2 flex flex-row">
           <div className="field-wrap flex flex-col w-full text-sm mr-6">
               <label htmlFor="City" className=" text-gray-500 text-xs font-medium	mb-1">City</label>
               <input type="text" id="city" name="city" placeholder="Your city"
               className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
               focus:border-gray-300"></input>
             </div>
             <div className="field-wrap flex flex-col w-full text-sm">
               <label htmlFor="Country" className=" text-gray-500 text-xs font-medium	mb-1">Country</label>
               <input type="text" id="country" name="country" placeholder="Your country"
               className="w-full  border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
               focus:border-gray-300"></input>
             </div>
           </div>
         </div>
         {/* <div className="field-wrap flex flex-col text-sm mb-4">
             <label htmlFor="phone" className=" text-gray-500 text-xs font-medium mb-1">Phone number</label>
             <input type="text" id="phone" name="phone" placeholder="Your phone number"
             className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
             focus:border-gray-300"></input>
         </div> */}

              <div className="field-wrap flex flex-col text-sm mb-4">
                  <label htmlFor="specialization" className=" text-gray-500 text-xs font-medium mb-1">Specialization</label>
                  <input type="text" id="specialization" name="specialization" placeholder="Your specialization"
                  className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                  focus:border-gray-300 " ></input>
              </div>
              <div className="field-wrap flex flex-col text-sm mb-4">
                  <label htmlFor="license" className=" text-gray-500 text-xs font-medium mb-1">License Number</label>
                  <input type="text" id="license" name="license" placeholder="Your license"
                  className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
                  focus:border-gray-300 " ></input>
              </div>


         <div className="field-wrap flex flex-col text-sm mb-4">
             <label htmlFor="email" className=" text-gray-500 text-xs font-medium mb-1">E-Mail</label>
             <input 
             type="text" 
             id="email" 
             name="email" 
             placeholder="Your E-Mail"
             value={userData && userData.email ? userData.email : ''}
             className="w-full border rounded-sm px-4 py-2 text-gray-400 bg-gray-50 focus:outline-none
             focus:border-gray-300 cursor-not-allowed" 
             disabled></input>
         </div>
         <div className="field-wrap flex flex-col text-sm">
             <label htmlFor="password" className=" text-gray-500 text-xs font-medium mb-1">Password</label>
             <input type="text" id="password" name="password" placeholder="Your password"
             className="w-full border rounded-sm px-4 py-2 bg-gray-50 focus:outline-none
             focus:border-gray-300 cursor-not-allowed text-gray-400" 
             //just for presentation nickname used, pass not being sent when submiting
       value={userData && userData.nickname ? hidePassword(userData.nickname) : ''}
             disabled></input>
         </div>



       </div>
       <div className="buttons-containter-wrap w-full my-3 lg:mt-3 pr-11">
            <div className="flex justify-end py-2 gap-6 ">
                <button 
                className="px-4 py-2 w-1/5 lg:h-1/4 bg-white text-gray-600 rounded hover:bg-gray-50  focus:outline-none border hover:border-green-200"
                onClick={(e) => handleSubmit(e, true)} 
                >Ok
                </button>
                <button 
                className="px-4 py-2 w-1/4 lg:w-3/12 bg-white text-gray-600 rounded hover:bg-gray-50  focus:outline-none border hover:border-red-200"
                onClick={handleClose} 
                >Cancel
                </button>
            </div>
          </div>
     </div>
   </div>
     )}

{showPopup && <Notification message={errorMessage} onClose={handleCloseNotification} />}

    </div>
  );
};

export default Form;

