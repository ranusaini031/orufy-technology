import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import userLogo from "../../assets/user-logo.avif"

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
            <img src={userLogo} alt="userLogo" />
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
