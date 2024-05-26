import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ history }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {  phoneNumber, password });
      const { role, _id: id, userName=null,username =null } = res.data;
      console.log(res.data);

      // Handle the redirection based on the role
      console.log(role);
      if (role === 'user') {
        toast.success('Login successful');
        navigate('/user/dashboard', { state: { id,username: userName , role } });
      } else if (role === 'driver') {
        toast.success('Login successful');
        navigate('/rider/dashboard', { state: { id, username:username, role } });
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Failed to login');
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
        <form onSubmit={handleLogin} autoComplete="off">
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
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
  Login
</button>
        </form>
        <p className='forLogin'>
          Dont  have account? <Link to="/register " className='signin-btn4' > Sign up</Link>
        </p>
       
      </div>
    </div>
  );
};

export default Login;
