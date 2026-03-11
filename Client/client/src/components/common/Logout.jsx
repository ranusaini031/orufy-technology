import { IoIosArrowDown } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Logout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div
        className="login-main-container"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <ul className="login-icon-container">
          <li className="login-icon">
            <img src="https://in.images.search.yahoo.com/yhs/view;_ylt=AwrKBBxWHrBp.FYBu7AO9olQ;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzdjMmIxMmY2OTUyMTZjZjNhYTA5OTA4YmZhOTQ4ODRmBGdwb3MDMQRpdANiaW5n?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fyhs%2Fsearch%3Fp%3Dorufy%2Btechnology%2Blogo%26ei%3DUTF-8%26type%3Dtype80260-2760478073%26fr%3Dyhs-sz-002%26hsimp%3Dyhs-002%26hspart%3Dsz%26param1%3D3794795661%26tab%3Dorganic%26ri%3D1&w=994&h=391&imgurl=orufy.com%2Fstatic%2Fimages%2Flogo-label.png&rurl=https%3A%2F%2Forufy.com%2Fconnect&size=36KB&p=orufy+technology+logo&oid=7c2b12f695216cf3aa09908bfa94884f&fr2=&fr=yhs-sz-002&tt=Orufy&b=0&ni=21&no=1&ts=&tab=organic&sigr=ZepnX6tluApD&sigb=sBImcM7ubBrA&sigi=c42HYEgyuDfL&sigt=g9qHMVKmGNBT&.crumb=O4/CAN7wZRf&fr=yhs-sz-002&hsimp=yhs-002&hspart=sz&type=type80260-2760478073&param1=3794795661alt=" />
          </li>

          <li className="toggle-dropdown">
            <IoIosArrowDown />
          </li>
        </ul>

        {showDropdown && (
          <div className="profile-dropdown">
            <div className="dropdown-item">Profile</div>
            <div className="dropdown-item">Settings</div>
            <div className="dropdown-item" onClick={() => logout()}>
              Logout
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Logout;
