import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Products from "./pages/dashboard/Products";
import Published from "./pages/dashboard/Published";
import Unpublished from "./pages/dashboard/Unpublished";
import SignUp from "./pages/auth/SignUp";
import ProductrLogin from "./pages/auth/ProductrLogin";

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<ProductrLogin />}>
      </Route>
      <Route path="/signup" element={<SignUp />} />

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
