import React from 'react'

// const Notification = ({ title, content }) => {
//   return (
//     <div className="universal-component">
//       <h2 className="title">{title}</h2>
//       <p className="content">{content}</p>
//     </div>
//   );
// };

const Notification = ({ message, onClose }) => {
  return (
    <div className="validation-wrap fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center  text-black overflow-y-auto items-start">
      <div className="validation-container mt-40 flex flex-col w-1/2 md:w-1/3 lg:w-1/4  bg-white rounded relative  ">
        <div className="title-container w-full border-b text-center">
          <h2 className="form-title text-xl lg:text-2xl text-gray-700 py-5">Warning</h2>
        </div>
        <div className="message-container w-full border-b text-center">
          <p className="message text-lg lg:text-xl text-gray-700 py-5 lg:py-6 px-6 lg:px-5">{message}</p>
        </div>
        <div className="button-container w-full  border-b text-center">
          <button className="button border py-2 px-5 my-3 text-sm lg:text-base text-gray-700 rounded"
          onClick={onClose}>Ok</button>
        </div>
      </div>
    </div>
  );
};
export default Notification;
