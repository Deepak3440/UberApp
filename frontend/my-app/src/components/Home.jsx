// Home.jsx
import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import HeaderMain from './HeaderMain';

const Home = () => {
  return (
    <>
    <HeaderMain/>
      <div className="homepage1">
        <div className="left-section1">
          <h1 className='userheading'> For User</h1>
          <p className='userText'>Our platform connects you with professional drivers who are committed to providing excellent service. Enjoy the comfort of our well-maintai</p>
          <Link to="/login" className="signin-btn1">Login</Link>
          <div className='create1'> Don't have an account?<br /> <Link to="/login" className="signup-link">Sign up</Link></div>
        </div>
        <div className="right-section1">
          <h1 className='userheading'> For Rider </h1>
          <p className='userText'>As a driver, you'll have the flexibility to choose your working hours and manage your schedule. We offer competitive earnings and provide .</p>
          <Link to="/login" className="signin-btn2">Login</Link>
          <div className='create1'> Don't have an account? <br /> <Link to="/driverRegister" className="signup-link">Sign up</Link></div>
        </div>
      </div>
     
    </>
  );
};

export default Home;
