import { Outlet } from "react-router-dom";
import LeftDashboard from "../dashboardComponent/LeftDashboard";
import RightDashBoard from "../dashboardComponent/RightDashboard";

const DashboardLayout = () => {
    return (
        <div className="dashboard-main-container">

            <div className="left-side-dashboard-container">
                <LeftDashboard />
            </div>

            <div className="right-dashboard-container">
                <RightDashBoard />

                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>


        </div>
    );
};

export default DashboardLayout;
