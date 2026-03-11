
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from "../../assets/bg-Img.png";
import logoIcon from "../../assets/logo-icon.png";
import card from "../../assets/card.png";

import './Home.css';

const ProductrLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (data.success) {

        localStorage.setItem("token", data.data.token);

        alert("Login successful");

        navigate('/dashboard/products');

      } else {

        alert(data.message || "Login failed");

      }

    } catch (error) {

      console.error("Login error:", error);
      console.log("product login error --->", error);

      alert("Server error. Check backend connection.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productr-login-container">

      <div className="left-side">
        <div
          className="background-image"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className="productr-text">
          Productr <img src={logoIcon} />
        </div>

        <div className="card-image-overlay">
          <img src={card} className="card-image" />
        </div>
      </div>

      <div className="right-side">
        <div className='right-side-login-container'>

          <div className="login-container">
            <h1>Login to your Product Account</h1>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

            </form>

          </div>

          <div className="signup-section">
            <p>Don't have a Product Account?</p>

            <span
              className="signup-link"
              onClick={() => navigate('/signup')}
            >
              SignUp Here
            </span>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ProductrLogin;