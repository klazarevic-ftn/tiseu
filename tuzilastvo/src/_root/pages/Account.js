import React, { useState, useEffect } from 'react';
import { useConfigContext } from "../../context/ConfigContext"; 
import { useNavigate } from "react-router-dom";
import {
  Notification,
  Form
} from '../../components/index'

const Account = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  //true -> civil acc
  const [formType, setFormType] = useState(true);
  const { configured } = useConfigContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (configured) {
      console.log(configured)
      navigate('/profile');
    }
    else {
      navigate('/account-config');
    }
  }, [configured, navigate]);

  const handleCardClick = (title, content, type) => {
    setShowConfirmation(true);
    setConfirmationContent({ title, content });
    setFormType(type);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };
  
  const handleConfirm = () => {
    setShowConfirmation(false);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="account-wrap  w-full flex justify-center border-t shadow-inner font-roboto " >
        <div className="account-content border flex flex-col px-8 lg:px-16 py-5 lg:py-10 my-0 lg:my-10 md:w-3/4 lg:w-3/4 xl:w-3/5 shadow">
          <div className="account-upper-section flex flex-col  w-full ">
            <div className="section-info-1 flex flex-col mb-7 lg:mb-5">
                <div className="section-info-title border-b font-light lg:text-5xl text-3xl lg:text-4xl mx-auto mb-5 lg:mb-10">
                  <h1 className=" ">Configure Account</h1>
                </div>
                <div className="section-info-content ">
                  <p className="text-gray-600 leading-tight	 lg:leading-relaxed px-1 lg:p-0 text-justify">
                  {/* Prior to proceeding, 
                  please configure your account by selecting the desired account type. 
                  It's important to note that once this selection is made, it cannot be altered. */}
                  
                  Before proceeding further into the General Public Prosecution Portal, 
                  we kindly request your attention to configuring your account. 
                  Your initial step involves selecting the desired account type 
                  from the options provided. It's paramount to understand the 
                  gravity of this decision, as once you make your selection, 
                  it is permanent and cannot be altered thereafter. 
                  </p>
                </div>
            </div>
          </div>




          <div className="account-lower-section py-0 lg:py-3 mb-0 lg:mb-8">
            <div className="section-account-types flex flex-col lg:flex-row gap-4 lg:gap-10 justify-between text-white  text-sm lg:text-base">


              <div className="account-type-1 flex flex-col mx-auto justify-center items-center w-4/5 lg:w-3/5 px-4 lg:px-10 pb-6 pt-4 hover:cursor-pointer hover:shadow-xl selection:shadow-red-500
              " 
              style={{ backgroundColor: '#171a29', border: "2px solid #c89c64", borderRadius: "2px"}}
              // onClick={() => handleCardClick("Confirm configuration", "Are you certain you wish to configure your account as a Civil Account? This action cannot be undone.", true)}>
              onClick={() => handleCardClick("Confirm configuration", "Are you certain you wish to configure your account as a Civil Account? This action cannot be undone.", true)}>

              <div className="acc-type items-center mx-auto ">
                <img className="mx-auto scale-90" src="/user.png" alt="" />
                <h3 className="mt-2 mb-3 font-medium">
                    Civil Account
                  </h3>
                </div>
                <p className="mx-auto text-center font-light tracking-tight	">
                  This option is for individuals who are citizens seeking legal assistance or reporting crimes.
                </p>
              </div>

              <div className="account-type-2 flex flex-col mx-auto justify-center items-center w-4/5 lg:w-3/5 px-4 lg:px-10 pb-6 pt-4 hover:cursor-pointer hover:shadow-xl selection:shadow-red-500
              " 
              style={{ backgroundColor: '#171a29', border: "2px solid #c89c64", borderRadius: "2px"}}
              onClick={() => handleCardClick("Confirm configuration", "Are you certain you wish to configure your account as a Prosecutor Account? This action cannot be undone.", false)}>
              
              <div className="acc-type items-center mx-auto">
                  <img className="mx-auto" src="/prosecutor.png" alt="" />
                  <h3 className="mt-2 mb-3 font-medium">
                    Prosecutor Account
                  </h3>
                </div>
                <p className="mx-auto text-center font-light tracking-tight	">
                  This option is intended for legal professionals such as prosecutors managing legal cases.
                </p>
              </div>
            </div>


        </div>
      </div>

      
      {showConfirmation && (
        <Confirmation
          title={confirmationContent.title}
          content={confirmationContent.content}
          onClose={handleCloseConfirmation}
          button1="Confirm"
          button2="Cancel"
          onConfirm={handleConfirm}
        />
      )}

  {showForm && 
        (<Form 
          onClose={handleCloseForm} 
          formType={formType} 

          />
        )}










{/* 
      {showConfirmation && (
          <Confirmation
            title={confirmationContent.title}
            content={confirmationContent.content}
            onClose={handleCloseConfirmation}
            button1="Confirm"
            button2="Cancel"
            onConfirm={handleConfirm}

          />
        )} */}
    
    </div>
    
  )
}

const Confirmation = ({ title, content, onClose, button1, button2, onConfirm  }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose(); 
 
  };

  const handleClose = () => {
    onClose(); 
  };

  return (
    <div className="confirmation-wrap fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center text-black">
      <div className="confirmation-container flex flex-col justify-center items-center bg-white pt-5 rounded-sm relative mx-10 lg:mx-0 ">
        {/* <button onClick={handleClose} className="absolute top-0 right-0 m-4 text-gray-900 hover:text-red-950 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button > */}

        <h2 className="confirmation-title   text-2xl mb-4 ">{title}</h2>
        <p className="confirmation-content text-base text-center border-t border-b py-5 px-8 text-gray-700">{content}</p>
        <div className="buttons-containter-wrap w-full my-3 lg:mt-3 pr-8">
          <div className="flex justify-end gap-6 ">
              <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 hover:text-gray-800 focus:outline-none border" onClick={handleConfirm}>{button1}
              </button>
              <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 hover:text-gray-800  focus:outline-none border" onClick={handleClose}>{button2}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account
