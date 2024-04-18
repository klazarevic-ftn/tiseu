import React, { useState } from 'react';

const LogoWrap = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('ENG');


  return (
    <div className="logo-wrap flex justify-center bg-white text-black font-roboto text-base ">
      <div className="logo-wrap-container h-full relative   lg:w-8/12 md:w-10/12 w-full">
        <div className="logo-wrap-row h-full relative flex justify-between lg:px-1 px-4 py-4 border-b border-gray-300">
          <div className="logo-title-lang-section flex items-center ">
            <div className="logo-title-lang flex items-center">
              <a className="logo-img mr-4 " style={{ maxWidth: "50px", maxHeight: "50px" }} href="/">
                <img src="/logo100.png" alt="Logo of General Public Prosecution" className="logo-header-img" title="Logo of General Public Prosecution" />
              </a>
              <a className="logo-title inline-block max-w-[150px] tracking-tight"  href="/">
                <h2 className=" ">GENERAL PUBLIC PROSECUTION</h2>              
              </a>
              {/* <div className="d-flex d-lg-none ml-auto">
                <div className="hamburger d-flex">
                  <button data-tip="true" className="hamburger__btn button button--flat button--flatter button--transition" type="button">
                    <i className="far fa-bars"></i>
                  </button>
                </div>
              </div> */}
            </div>
            <div className="lang-cont flex items-center hidden md:flex ">
              <a className="tracking-tight" href="/" onClick={() => setSelectedLanguage('ENG')}>
                <span className={`mr-4 ml-1 ${selectedLanguage === 'ENG' ? 'text-blue-500' : 'text-gray-500 hover:text-black'}`}>ENG</span>
              </a>
              {/* <a className="" href="/" onClick={() => setSelectedLanguage('SRB')}>
                <span className={`mr-2 ${selectedLanguage === 'SRB' ? 'text-blue-300' : 'text-gray-500 hover:text-black'}`}>SRB</span>
              </a> */}
            <a className="cursor-not-allowed tracking-tight" href="/" onClick={(e) => e.preventDefault()}>
                  <span className="mr-2 text-gray-500">SRB</span>
                </a>
            </div>
          </div>

          <div className="links-logo-w hidden md:flex items-center">
            <div className="links-block flex  ">
              <a className="s-n-img mx-2  " href="https://www.facebook.com">
                  <img src="/facebook_icon.svg" style={{ maxWidth: "22px", maxHeight: "22px" }} />
              </a>
              <a className="s-n-img mx-2 " href="https://www.twitter.com">
                  <img src="/tweeter_icon.svg" style={{ maxWidth: "22px", maxHeight: "22px" }} />
              </a>
              <a className="s-n-img mx-2" href="https://www.youtube.com">
                  <img src="/youtube_icon.svg" style={{ maxWidth: "22px", maxHeight: "22px" }} />
              </a>
              <a className="s-n-img mx-2 mr-1" href="https://www.google.com">
                  <img src="/google_plus_icon.svg" style={{ maxWidth: "22px", maxHeight: "22px" }} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LogoWrap
