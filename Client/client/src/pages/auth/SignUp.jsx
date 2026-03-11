import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      alert("All fields are required");
      return;
    }

    if (formData.password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        navigate("/dashboard/home");
      } else {
        alert("Signup successful. Please login now.");
        navigate("/");
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-content">
      <div className="signup-container">
        <h1>SignUp to your Product Account</h1>

        <div className="signup-input-container">
          <div className="singup-input">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
            />
          </div>

          <div className="singup-input">
            <input
              type="email"
              name="email"
              placeholder="Enter your email id"
              onChange={handleChange}
            />
          </div>

          <div className="singup-input">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
            />
          </div>

          <div className="singup-input">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={handleChange}
            />
          </div>

          <div className="singup-input">
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              onChange={handleChange}
            />
          </div>

          <button onClick={handleSignup} disabled={loading}>
            {loading ? "Creating Account..." : "SignUp"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
