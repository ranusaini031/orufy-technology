import {  NavLink } from "react-router-dom"
import dashboardLogo from "../../assets/dashboardLogo.png"
import { IoSearch } from "react-icons/io5";
import { CgHome } from "react-icons/cg";
import { MdOutlineShoppingBag } from "react-icons/md";

const LeftDashboard = () => {
    return (
        <>
            <div className="left-dashboard-container">
                <div className="dashboard-search-logo-container">
                    <div className="dashboard-logo" >
                        <img src={dashboardLogo} alt="" />
                    </div>
                    <div className="product-search" >
                        <span><IoSearch/>     Search</span>
                        <input type="text" placeholder="Search" />
                    </div>

                </div>
                <div className="dashboard-product-bar" >
                    <NavLink to="/dashboard/home" className="menu-link">
                        <span><CgHome/></span>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/dashboard/products" className="menu-link">
                        <span><MdOutlineShoppingBag/></span>
                        <span>Products</span>
                    </NavLink>
                </div>

            </div>
        </>
    )
}

export default LeftDashboard;