import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Driver.css';
import { useNavigate, Link } from 'react-router-dom';

const DriverRegister = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [carType, setCarType] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [price, setPrice] = useState('');
  const [currentLocation, setLocation] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/registerDriver', {
        username,
        password,
        phoneNumber,
        carType,
        carNumber,
        pickupLocation,
        destinationLocation,
        price,
        currentLocation,
        otp
      });

      if (res.status === 201) {
        toast.success('Registration Successful');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } 
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.msg === 'Driver already exists') {
        toast.error('Driver already exists');
      } else {
        toast.error('Failed to Signup');
      }
    }
  };

  return (
    <div className="login-container2">
      <div className="login-form2">
      <h2>
        <img
  src="https://helios-i.mashable.com/imagery/articles/03y6VwlrZqnsuvnwR8CtGAL/hero-image.fill.size_1248x702.v1623372852.jpg"
  alt="Logo"
  style={{ width: '90px', borderRadius: '8px', display: 'block', margin: '0 auto 20px auto' }}
/>
         
        </h2>
        <form onSubmit={handleRegister} className="form-grid2" autoComplete="off">
          <div className="form-row2">
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}  autocomplete="off"
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
          </div>
          <div className="form-row2">
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
              <label>Car Type:</label>
              <input
                type="text"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}  autocomplete="off"
                required
              />
            </div>
          </div>
          <div className="form-row2">
            <div>
              <label>Car Number:</label>
              <input
                type="text"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}  autocomplete="off"
                required
              />
            </div>
            {/* <div>
              <label>Pickup Location:</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
              />
            </div> */}
          </div>
          <div className="form-row2">
            {/* <div>
              <label>Destination Location:</label>
              <input
                type="text"
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                required
              />
            </div> */}
            <div>
              <label>Price:</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}  autocomplete="off"
                required
              />
            </div>
            <div>
              <label>Current Location:</label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setLocation(e.target.value)}  autocomplete="off"
                required
              />
            </div>
          </div>
          <div className="form-row2">
            {/* <div>
              <label>OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div> */}
          </div>
          <button type="submit" className="register-button1">Register</button>
        </form>
        <p className='forLogin'>
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DriverRegister;
