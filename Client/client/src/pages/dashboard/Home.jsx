import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const Home = () => {
    return (
        <>
            <div className="home-container" >
                <Navbar />
                <div className="home-content">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Home;
