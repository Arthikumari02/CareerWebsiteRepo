import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './styles/SignUp.css'

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const result = await login(email, password);
  
      if (result.success) {
        const userId = result.user?.uid; // Get UID directly from result
  
        if (!userId) {
          throw new Error('User ID (UID) is missing');
        }
  
        const response = await fetch('http://localhost:5000/store-user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, uid: userId }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to store user data');
        }
  
        const data = await response.json();
        console.log('User data sent to email:', data);
        alert('Sign-in successful! Data sent to email.');
        navigate('/career-website-repo');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error storing user data:', error);
      setError(error.message || 'An error occurred while storing data');
    }
  };
  

  return (
    <div style={{height:"100vh", display:"flex", flexDirection:"column", 
        justifyContent:"center", alignItems:"center"}}>
        <div className="signup-container">
            <h1>Sign In</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignIn}>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit">Sign In</button>
            </form>
            <p>
                Don't have an account? <a href="/signup">Sign Up</a>
            </p>
            <p>
                Forgot your password? <a href="/forgot-password">Reset Password</a>
            </p>
        </div>
    </div>
  );
};

export default SignIn;