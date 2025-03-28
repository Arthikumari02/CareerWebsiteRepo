import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase'; // Adjust path to your Firebase config

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Firebase method to send password reset email
      await sendPasswordResetEmail(auth, email);
      
      setMessage('Password reset email sent. Check your inbox.');
      
      // Optional: Redirect after a few seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Handle specific Firebase authentication errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No user found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many reset attempts. Please try again later.');
          break;
        default:
          setError('Failed to send password reset email. Please try again.');
      }
    }
  };

  return (
    <div style={{
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <div style={{
        width: '300px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <h2>Forgot Password</h2>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '15px' 
          }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ 
            color: 'green', 
            marginBottom: '15px' 
          }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send Reset Link
          </button>
        </form>
        
        <div style={{ 
          marginTop: '15px', 
          textAlign: 'center' 
        }}>
          <a href="/signin" style={{ color: '#007bff', textDecoration: 'none' }}>
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;