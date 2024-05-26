import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useNavigate,Link } from 'react-router-dom';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      

      const res = await axios.post('http://localhost:5000/api/auth/registerProfile', {
        userName,
        password,
        phoneNumber,
      });

      // Check if registration was successful
      if (res.status === 201) {
        // If successful, show success toast
        toast.success('Registration Successful');
  
        // Delay the redirection to the login page
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after successful registration
        }, 1000); // Adjust the delay time as needed
    } 
}catch (error) {
      // Handle specific error cases
      if (error.response && error.response.status === 400 && error.response.data.msg === 'User already exists') {
        // If user already exists, show an error toast for that specific case
        toast.error('User already exists');
      } else {
        // For other errors, show a generic error toast
        toast.error('Failed to Signup');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
      <h2>
        <img
  src="https://helios-i.mashable.com/imagery/articles/03y6VwlrZqnsuvnwR8CtGAL/hero-image.fill.size_1248x702.v1623372852.jpg"
  alt="Logo"
  style={{ width: '90px', borderRadius: '8px', display: 'block', margin: '0 auto' }}
/>
         </h2>
        <form onSubmit={handleRegister} autoComplete="off">
          <div>
            <label>User Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}  autocomplete="off"
              required
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type='text'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}  autocomplete="off"
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  autocomplete="off"
              required
            />
          </div>
          <button 
                type="submit" 
                style={{
                display: 'block',
                 margin: '0 auto'
                }}
>
  Register
</button>
        </form>
        <p 
             className='forLogin'
             style={{
              textAlign: 'center'
                     }}
                       >
        Already have an account? <Link to="/login" className="signin-btn4">Login</Link>
</p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
