import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  confirmPasswordReset, 
  verifyPasswordResetCode 
} from 'firebase/auth';
import { auth } from './firebase'; // Adjust path to your Firebase config

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isValidCode, setIsValidCode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract the reset code from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const oobCode = searchParams.get('oobCode');

    if (oobCode) {
      // Verify the password reset code
      verifyPasswordResetCode(auth, oobCode)
        .then(() => {
          setIsValidCode(true);
        })
        .catch((error) => {
          console.error('Invalid or expired reset code:', error);
          setError('Invalid or expired reset link.');
        });
    } else {
      setError('No reset code provided.');
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const searchParams = new URLSearchParams(location.search);
      const oobCode = searchParams.get('oobCode');

      // Confirm the password reset
      await confirmPasswordReset(auth, oobCode, newPassword);
      
      setMessage('Password successfully reset');
      
      // Redirect to sign-in after a few seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Handle specific Firebase authentication errors
      switch (error.code) {
        case 'auth/invalid-action-code':
          setError('Invalid or expired reset link.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password.');
          break;
        default:
          setError('Failed to reset password. Please try again.');
      }
    }
  };

  // If the reset code is invalid, show an error
  if (!isValidCode && error) {
    return (
      <div style={{
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div>
          <h2>Error</h2>
          <p>{error}</p>
          <a href="/forgot-password">Request a new reset link</a>
        </div>
      </div>
    );
  }

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
        <h2>Reset Password</h2>
        
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
        
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;