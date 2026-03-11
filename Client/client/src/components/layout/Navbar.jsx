import { GoHome } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Logout from "../common/Logout";

const Navbar =()=>{

const navigate = useNavigate();

return (
    <>
        <header className="header-1">
            <ul
                onClick={() => navigate("/dashboard/home")}
                className="home-logo-container">
                    <GoHome />
                <li id="home-t ext"  >
                    Home
                </li>
            </ul>

          <Logout/>
        </header >

        <header className="header-2">
            <div className="home-navbar-2">
                <ul>
                    <li>
                        <NavLink
                            to="published"
                            className={({ isActive }) => isActive ? "active-tab" : ""}
                        >
                            Published
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="unpublished"
                            className={({ isActive }) => isActive ? "active-tab" : ""}
                        >
                            Unublished
                        </NavLink>
                    </li>
                </ul>
            </div>
        </header>
    </>
);
};

export default Navbar;
