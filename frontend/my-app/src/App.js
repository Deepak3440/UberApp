import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import DriverDashboard from './components/DriverDashboard';
import Home from './components/Home'; 
import header from './components/Header'
import Register from './components/Register'
import DriverRegister from './components/DriverRegister';
import ErrorPage from './components/ErrorPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/driverRegister" element={<DriverRegister />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/rider/dashboard" element={<DriverDashboard />} />
        {/* <Route path="/user/request-ride" element={<RequestRide />} /> */}
        {/* Add a route for the root URL */}
        <Route path="/" element={<Home/>} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
