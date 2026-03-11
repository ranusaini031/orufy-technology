import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const ProductrLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('Please enter email');
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Check if backend is running
      const healthCheck = await fetch('http://localhost:2026');
      console.log('Health check:', healthCheck.status);
      
      // Step 2: Send OTP request
      const response = await fetch('http://localhost:2026/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      console.log('OTP Response:', data);
      
      if (data.success) {
        // Step 3: Show OTP and navigate
        const userOTP = data.otp || '123456'; // Fallback OTP
        
        alert(`OTP Sent!\n\nEmail: ${email}\nOTP: ${userOTP}\n\nClick OK to continue`);
        
        // Step 4: Navigate to OTP page
        navigate('/otp', {
          state: {
            email: email,
            otp: userOTP,
            sentTime: new Date().toISOString()
          }
        });
        
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Full error:', error);
      
      // Fallback: Use mock data if backend fails
      alert(` Using demo mode (Backend offline)\n\nDemo OTP: 123456\n\nClick OK to continue`);
      
      navigate('/otp', {
        state: {
          email: email,
          otp: '123456',
          sentTime: new Date().toISOString(),
          isDemo: true
        }
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productr-login-container">
      <div className="left-side">
        <div className="background-image" style={{ backgroundImage: `url('public/image 1.png')` }} />
        <div className="productr-text">Productr <img src="public/Vector (1).png" alt="" /></div>
        <div className="card-image-overlay">
          <img src="public/Card.png" alt="Card" className="card-image" />
        </div>
      </div>
      
      <div className="right-side">
        <div className="login-container">
          <h1>Login to your Product Account</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email or Phone number</label>
              <input 
                type="text" 
                placeholder="Enter email or phone number" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <p style={{ fontSize: '12px', color: '#666' }}>
              💡 <strong>Note:</strong> Backend running on port 5000
            </p>
          </div>
          
          <div className="signup-section">
            <p>Don't have a Product Account?</p>
            <button type='submit' className="signup-link" onClick={() => navigate('/Signup')}  >
              SignUp Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductrLogin;