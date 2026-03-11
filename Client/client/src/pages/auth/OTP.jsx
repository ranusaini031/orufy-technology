import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OTP.css';

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  
  // 6 OTP inputs
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [receivedOTP, setReceivedOTP] = useState('');

  // Get email and OTP from previous page
  useEffect(() => {
    if (location.state) {
      console.log('Location state:', location.state);
      if (location.state.email) {
        setUserEmail(location.state.email);
      }
      if (location.state.otp) {
        setReceivedOTP(location.state.otp);
        console.log('OTP received:', location.state.otp);
      }
    }
  }, [location]);

  // Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
        console.log('First input focused');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);


  const handleOtpChange = (index, value) => {
    console.log(`Input ${index} changed to: "${value}"`);
    
    // Allow only numbers (0-9)
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      
      
      if (numericValue && index < 5) {
        setTimeout(() => {
          if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
          }
        }, 10);
      }
    }
  };
  const handleKeyDown = (index, e) => {
    console.log(`Key ${index} pressed:`, e.key);
    
    if (e.key === 'Backspace') {
      e.preventDefault(); // Prevent default backspace behavior
      
      const newOtp = [...otp];
      
      if (otp[index]) {
        // If current box has value, clear it
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // If empty, move to previous box
        setTimeout(() => {
          if (inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
          }
        }, 10);
      }
    }
    
    // Allow Ctrl+V paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedOTP = text.replace(/[^0-9]/g, '').slice(0, 6);
        console.log('Pasted OTP:', pastedOTP);
        
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pastedOTP[i] || '';
        }
        setOtp(newOtp);
        
        // Focus last filled box
        const lastIndex = Math.min(pastedOTP.length, 6) - 1;
        if (lastIndex >= 0 && lastIndex < 5) {
          setTimeout(() => {
            if (inputRefs.current[lastIndex + 1]) {
              inputRefs.current[lastIndex + 1].focus();
            }
          }, 10);
        }
      });
    }
  };

  
  const handleOtpClick = (index) => {
    console.log(`Clicked OTP box ${index}`);
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    console.log('Submitted OTP:', otpString);
    
    if (otpString.length !== 6) {
      alert('Please enter complete 6-digit OTP');
      // Focus first empty box
      const emptyIndex = otp.findIndex(digit => digit === '');
      if (emptyIndex !== -1 && inputRefs.current[emptyIndex]) {
        inputRefs.current[emptyIndex].focus();
      }
      return;
    }
    
    setIsLoading(true);
    
    // Check if OTP matches received OTP
    if (receivedOTP && otpString === receivedOTP) {
      setTimeout(() => {
        alert(` OTP ${otpString} verified successfully!\n\nWelcome ${userEmail}`);
        navigate('/dashboard', { state: { email: userEmail } });
        setIsLoading(false);
      }, 1000);
    } else {
      // For demo, accept any 6-digit OTP
      setTimeout(() => {
        alert(` Demo: OTP ${otpString} accepted!\n\nIn real app, this would verify with backend`);
        navigate('/dashboard', { state: { email: userEmail } });
        setIsLoading(false);
      }, 1000);
    }
  };

  // Resend OTP
  const handleResend = () => {
    if (!canResend) return;
    
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setReceivedOTP(newOTP);
    
    alert(`New OTP: ${newOTP}\n\nUse this OTP to verify`);
    
    setTimer(600);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    
    // Focus first input
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="productr-login-container">
      <div className="left-side">
        <div className="background-image" style={{ backgroundImage: `url('public/image 1.png')` }} />
        <div className="productr-text">Productr <img src="public/Vector (1).png" alt="" /></div>
        <div className="card-image-overlay">
          <img src="public/Card.png" alt="Uplist Card" className="card-image" />
        </div>
      </div>
      
      <div className="right-side">
        <div className="login-container">
          <h1>Login to your Productr Account</h1>
          <h2 style={{ color: '#666', fontWeight: 'normal', marginBottom: '30px' }}>Enter OTP</h2>
          
          {/* Email Info */}
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #e9ecef'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
               OTP sent to: <span style={{ color: '#007bff' }}>{userEmail || 'your email'}</span>
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
               Expires in: <strong>{formatTime(timer)}</strong>
            </p>
            {receivedOTP && (
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#28a745', background: '#d4edda', padding: '8px', borderRadius: '4px' }}>
              <strong>Your OTP is:</strong> {receivedOTP}
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '15px', fontWeight: '500', color: '#333' }}>
                Enter 6-digit OTP
              </label>
              
        
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                margin: '25px 0'
              }}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onClick={() => handleOtpClick(index)}
                      style={{
                        width: '55px',
                        height: '55px',
                        textAlign: 'center',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        border: `2px solid ${otp[index] ? '#28a745' : '#ddd'}`,
                        borderRadius: '10px',
                        outline: 'none',
                        backgroundColor: otp[index] ? '#f8fff9' : 'white',
                        cursor: 'text',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box'
                      }}
                      placeholder="•"
                      onFocus={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.25)';
                        e.target.style.backgroundColor = '#f0f8ff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = otp[index] ? '#28a745' : '#ddd';
                        e.target.style.boxShadow = 'none';
                        e.target.style.backgroundColor = otp[index] ? '#f8fff9' : 'white';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              
              <div style={{ textAlign: 'center', margin: '25px 0' }}>
                <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                  Didn't receive OTP? 
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: canResend ? '#007bff' : '#999',
                      cursor: canResend ? 'pointer' : 'not-allowed',
                      marginLeft: '8px',
                      fontWeight: canResend ? '600' : '400',
                      fontSize: '15px',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      if (canResend) e.target.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      if (canResend) e.target.style.textDecoration = 'none';
                    }}
                  >
                    {canResend ? 'Resend Now' : `Resend in ${formatTime(timer)}`}
                  </button>
                </p>
                
                <div style={{ fontSize: '13px', color: '#666', marginTop: '15px' }}>
                  <p style={{ margin: '5px 0' }}> <strong>How to enter OTP:</strong></p>
                  <p style={{ margin: '3px 0', fontSize: '12px' }}>1. Click on any box or type numbers</p>
                  <p style={{ margin: '3px 0', fontSize: '12px' }}>2. Use Backspace to delete</p>
                  <p style={{ margin: '3px 0', fontSize: '12px' }}>3. Press Ctrl+V to paste OTP</p>
                </div>
              </div>
            </div>
            
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '15px',
                boxShadow: '0 4px 6px rgba(0,123,255,0.2)'
              }}
              onMouseOver={(e) => e.target.style.background = '#0056b3'}
              onMouseOut={(e) => e.target.style.background = '#007bff'}
            >
              {isLoading ? (
                <>
                  <span style={{ marginRight: '10px' }}></span>
                  Verifying...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '10px' }}></span>
                  Verify OTP
                </>
              )}
            </button>
            
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '14px',
                background: '#f8f9fa',
                color: '#495057',
                border: '1px solid #dee2e6',
                borderRadius: '10px',
                fontSize: '15px',
                cursor: 'pointer',
                marginBottom: '25px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = '#e9ecef'}
              onMouseOut={(e) => e.target.style.background = '#f8f9fa'}
            >
              ← Back to Login
            </button>
          </form>
          
          {/* Bottom Section */}
          <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '15px' }}>Uplist your</p>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '10px 20px',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f0f8ff'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              product to market
            </button>
          </div>
          
          
          <div style={{
            marginTop: '40px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '10px',
            border: '2px dashed #dee2e6',
            fontSize: '13px',
            color: '#495057'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#007bff' }}>🛠️ Debug Panel</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <p style={{ margin: '5px 0' }}><strong>Email:</strong> {userEmail || 'None'}</p>
                <p style={{ margin: '5px 0' }}><strong>Expected OTP:</strong> {receivedOTP || 'None'}</p>
              </div>
              <div>
                <p style={{ margin: '5px 0' }}><strong>Entered OTP:</strong> {otp.join('') || 'Empty'}</p>
                <p style={{ margin: '5px 0' }}><strong>Can Resend:</strong> {canResend ? ' Yes' : ' No'}</p>
              </div>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
              Console me bhi check karo (F12) for detailed logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;