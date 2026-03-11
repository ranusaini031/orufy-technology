import { Routes, Route, Navigate } from "react-router-dom";
// import LoginLayout from "./pages/auth/LoginLayout";
// import LoginScreen from "./pages/auth/LoginScreen";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Products from "./pages/dashboard/Products";
import Published from "./pages/dashboard/Published";
import Unpublished from "./pages/dashboard/Unpublished";
import SignUp from "./pages/auth/SignUp";
import ProductrLogin from "./pages/auth/ProductrLogin";
import OTP from "./pages/auth/OTP";

const App = () => {
  return (
    <Routes>

      {/* ROOT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* AUTH */}
      <Route path="/login" element={<ProductrLogin />}>
        

        {/* <Route index element={<LoginScreen />} /> */}
      </Route>
        <Route path="/otp" element={<OTP />} />


      {/* SIGNUP (separate) */}
      <Route path="/signup" element={<SignUp />} />

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="home" element={<Home />}>
          <Route index element={<Published />} />
          <Route path="published" element={<Published />} />
          <Route path="unpublished" element={<Unpublished />} />
        </Route>

        <Route path="products" element={<Products />} />
      </Route>

    </Routes>
  );
};

export default App;
