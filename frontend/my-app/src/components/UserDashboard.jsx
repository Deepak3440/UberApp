import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './userDashboard.css';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { IoLocation } from "react-icons/io5";
import '../StylesSheet/ride.css'
import { FaUser } from 'react-icons/fa'; 
import ErrorPage from './ErrorPage';


const img1 = 'https://png.pngtree.com/element_our/sm/20180516/sm_5afbf1d28feb1.jpg';
const img2 = 'https://images.vexels.com/media/users/3/152654/isolated/preview/e5694fb12916c00661195c0a833d1ba9-sports-bike-icon.png';

const UserDashboard = () => {
  
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [driversHistory, setDriversHistory] = useState({});
  const [history, setHistory] = useState([]);
  const [historyClicked, setHistoryClicked] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [vehicleType, setVehicleType] = useState("Bike");
  const location = useLocation();

  const { id=null, username, role } = location.state ? location.state : {};
  const [expandedRideId, setExpandedRideId] = useState(null);

  const toggleDetails = (rideId) => {
    setExpandedRideId(expandedRideId === rideId ? null : rideId);
  };

  useEffect(() => {
    const fetchRides = async () => {
      const userId = id;
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/getTripsUser',
          { userId }
        );
        const ridesData = res.data;
        if(ridesData.length>0){
          setLoading(false);
        }

        const allUserIds = [...new Set(ridesData.map((ride) => ride.driverId))];
      
        // Fetch user details for all userIds
        const userDetailsPromises1 = allUserIds.map((driverId) =>
          axios.get(`http://localhost:5000/api/auth/drivers/${driverId}`)
        );
      
        const usersDetailsResponses1 = await Promise.all(userDetailsPromises1);
        const usersDetails1 = usersDetailsResponses1.reduce((acc, response, index) => {
          acc[allUserIds[index]] = response.data;
          return acc;
        }, {});
      
        // Add profile picture to each ride in ridesData
        const updatedRidesData = ridesData.map((ride) => {
          const user = usersDetails1[ride.driverId];
          if (user) {
            ride.profilePic = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
          }
          return ride;
        });

        setRides(updatedRidesData);

        // Fetch driver details for each ride
        const driverIds = ridesData.map((ride) => ride.driverId);
        const driverDetailsPromises = driverIds.map((driverId) =>
          axios.get(`http://localhost:5000/api/auth/drivers/${driverId}`)
        );

        const driversData = await Promise.all(driverDetailsPromises);
        const driversInfo = {};
        driversData.forEach((response, index) => {
          driversInfo[driverIds[index]] = response.data;
        });

        setDrivers(driversInfo);
      } catch (error) {
        toast.error('Failed to fetch rides');
      }
    };

    fetchRides();

    const interval = setInterval(() => {
      fetchRides();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [id]);

  const clearAllFields = () => {
    document.getElementById('pickup').value = "";
    document.getElementById('des').value = "";
    setDestinationSuggestions([]);
    setPickupSuggestions([]);
  };

  const find = async () => {
    setLoading(true);
    console.log(vehicleType,"111");
    const pickupLocation = document.getElementById('pickup').value;
    const destinationLocation = document.getElementById('des').value;
    const userId = id;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          pickupLocation,
          destinationLocation,
          userId,
          vehicleType
        }
      );
      // Check if the response contains a specific message
    if (response.data && response.data.message) {
      // If message exists, check if it indicates success or error
      if (response.data.trips) {
        // If it's a success message, show it as a success toast
        toast.success("Ride booked successfully");
      } else {
        // If it's an error message, show it as an error toast
        toast.error(response.data.message);
      }
    } else {
      // If no specific message found, show a generic success message
      toast.error('Something went wrong');
    }

    clearAllFields();
  } catch (error) {
    console.error('Failed to book ride');
  } finally {
    // setLoading(false);
  }
  };

  const toCheckHistory = async () => {
    setHistoryClicked(true);
    setExpandedRideId(null);
    const userId = id;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/getTripsUserHistory',
        { userId }
      );
      const ridesData = res.data;

      setHistory(ridesData);

      // Fetch driver details for each ride
      const driverIds = ridesData.map((ride) => ride.driverId);
      const driverDetailsPromises = driverIds.map((driverId) =>
        axios.get(`http://localhost:5000/api/auth/drivers/${driverId}`)
      );

      const driversData = await Promise.all(driverDetailsPromises);
      const driversInfo = {};
      driversData.forEach((response, index) => {
        driversInfo[driverIds[index]] = response.data;
      });

      setDriversHistory(driversInfo);
    } catch (error) {
      toast.error('Failed to fetch ride history');
    }
  };

  const handlePickupInputChange = async (inputValue) => {
    fetchLocationSuggestions(inputValue, 'pickup');
  };

  const handleDestinationInputChange = (input) => {
    fetchLocationSuggestions(input, 'destination');
  };

  const fetchLocationSuggestions = async (input, type) => {
    try {
      if (input.trim() !== '') {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
        );
        const suggestions = response.data.map((item) => item.display_name);

        const filteredSuggestions = suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(input.toLowerCase())
        );

        if (type === 'pickup') {
          setPickupSuggestions(filteredSuggestions);
        } else if (type === 'destination') {
          setDestinationSuggestions(filteredSuggestions);
        }
      } else {
        if (type === 'pickup') {
          setPickupSuggestions([]);
        } else if (type === 'destination') {
          setDestinationSuggestions([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch location suggestions:', error);
    }
  };
  if(id===null){
    return <ErrorPage/>
  }

  const handleAutocompletePickup = (suggestion) => {
    document.getElementById('pickup').value = suggestion;
    setPickupSuggestions([]);
  };
  const handleSelectChange=(e)=>{

    setVehicleType(e.target.value);
    console.log(vehicleType,"225")
  }

  const handleAutocompleteDestination = (suggestion) => {
    document.getElementById('des').value = suggestion;
    setDestinationSuggestions([]);
  };

  const showHome = () => {
    setHistoryClicked(false);
  };

  const handleCancelRide = async (tripId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/cancelRide/${tripId}`
      );
      setRides(
        rides.map((ride) =>
          ride._id === tripId ? { ...ride, status: 'canceled' } : ride
        )
      );
      toast.success('Ride canceled');
    } catch (error) {
      toast.error('Failed to cancel ride');
    }
  };

  const ridesToDisplay = historyClicked ? history : rides;

  return (
    <>
      <ToastContainer />
      <Header
        toCheckHistory={toCheckHistory}
        showHome={showHome}
        username={username}
        role={role}
      />
      <div className="dashboard-container">
        {historyClicked || rides.length > 0 || loading? <div></div> : 
        <>
        <div className="search-block">
          <input
            className='dist-auto'
            id="pickup"
            type="text"
            name="pickup"
            placeholder="Enter pickup location"
            onChange={(e) => handlePickupInputChange(e.target.value)}
          />
          {pickupSuggestions.length > 0 && (
            <ul className="dist-ul">
              {pickupSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleAutocompletePickup(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <input
            className='dist-auto2'
            id="des"
            type="text"
            name="destination"
            placeholder="Enter destination location"
            onChange={(e) => handleDestinationInputChange(e.target.value)}
          />
            
          {destinationSuggestions.length > 0 && (
            <ul className="dist-ul2">
              {destinationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleAutocompleteDestination(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <select style={{width:"100px"}}name="" id=""  className='dist-auto2'
              value={vehicleType}
              onChange={(e)=>handleSelectChange(e)}
             
            >
              
              <option value="Bike" selected>Bike</option>
              <option value="Car">Car</option>
            </select>
            </div>
            <div className="bookbutton">
              <button onClick={find}>Book</button>
            </div>
            </>
          
       
    }

        <h2>{historyClicked ? 'My Rides' : (loading ?  <div className="loader"><img style={{height:"50px"}} src='https://www.iconpacks.net/icons/2/free-car-icon-2901-thumb.png'/></div> : "")}</h2>
        {ridesToDisplay.length === 0 ? (
              ""
          ) 
          : (
        <div className="rides-list-container">
          
            <ul className="rides-list">
              {ridesToDisplay.map((ride) => (
                <li key={ride._id}>
                  {historyClicked ? 
                    driversHistory[ride.driverId] ? (
<div className='ride-details'>
      <div className='journey-details' >
        <div className='journey'>
          <IoLocation className='loc-dest' />
          <div className='journey-items'>
            <p className='journey-title'>PickUp Point</p>
            <p className='journey-detail'>{ride.pickupLocation}</p>
          </div>
        </div>
        <div className='journey'>
          <IoLocation className='loc' />
          <div className='journey-items'>
            <p className='journey-title'>Drop Point</p>
            <p className='journey-detail'>{ride.destinationLocation}</p>
          </div>
        </div>
        <div  style={{textAlign:'right'}}>
        <span  
            
            onClick={() => toggleDetails(ride._id)}
            
          >
          <img src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIMA4QMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAAABQcIBv/EAC4QAQABAwICCAcBAQEAAAAAAAABAgMFBAZBURciUlViksHSBxESEyExgTLhI//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxm9viHpNmaq1aymJyVyzej/y1Nimiq3XPGPnNUTExylzPT3tvuzLeS37wWyKm6e9t92ZbyW/edPe2+7Mt5LfvBbIqbp7233ZlvJb95097b7sy3kt+8FsipunvbfdmW8lv3nT3tvuzLeS37wWyKm6e9t92ZbyW/edPe2+7Mt5LfvBbIqbp7233ZlvJb96b2l8U8fu3K04/EYfK1V/L6rl2ui3Fu1Tzqn6/+yDvgAAAAAAAAAAAAAAAAAR+ewug3Bi72Nytim9pr0fKYn90zwqieExzZY+IextfsrKfavfVe0F6ZnTaqI/FcdmeVUcv61uj89hdBuDF3sblbFN7TXo+UxP7pnhVE8JjmDFg6z4h7G1+ysp9q99V7QXpmdNqoj8Vx2Z5VRy/rkwAAAAATuz9rZLd2Yox2Mt+K9eqjqWaO1V6RxA2ftbJbuzFGOxlvxXr1UdSzR2qvSOLVWz9rY3aOHox2Mt+K9eqjr3q+1V6RwNn7Wxu0cPRjsZb8V69VHXvV9qr0jgnAAAAAAAAAAAAAAAAAAAAAR+ewug3Bi72Nytim9pr0fKYn90zwqieExzZY+IextfsrKfavfVe0F6ZnTaqI/FcdmeVUcv61uj89hdBuDF3sblbFN7TXo+UxP7pnhVE8JjmDFg6z4h7G1+ysp9q99V7QXpmdNqoj8Vx2Z5VRy/rkwATuz9rZLd2Yox2Mt+K9eqjqWaO1V6RxA2ftbJbuzFGOxlvxXr1UdSzR2qvSOLVWz9rY3aOHox2Mt+K9eqjr3q+1V6RwNn7Wxu0cPRjsZb8V69VHXvV9qr0jgnAAAAAAAAAAAAAAAAAAAAAAAAAR+ewug3Bi72Nytim9pr0fKYn90zwqieExzZY+IextfsrKfavfVe0F6ZnTaqI/FcdmeVUcv61uj89hdBuDF3sblbFN7TXo+UxP7pnhVE8JjmDJOz9rZLd2Yox2Mt+K9eqjqWaO1V6Rxaq2ftbG7Rw9GOxlvxXr1Ude9X2qvSOBtDa2M2liaMfircxH+rt6v8A3eq51T6cE4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z'
             height='36px' />
           
          </span>
          </div>
      </div>
      

      {expandedRideId === ride._id ?
      <>
      
      <hr className='dashed-hr' />
      <div className={`travel-details }`}>
        <div className='travel-items'>
          <p className='item bolder' >
            <FaUser /> Driver Name
          </p>
          <p style={{marginLeft:"5px"}} className='item'>{driversHistory[ride.driverId]?.username}</p>
        </div>
        <div className='travel-items'>
          <p className='item bolder'>Duration</p>
          <p style={{marginLeft:"5px"}} className='item'>3 Hr</p>
        </div>
        <div className='travel-items'>
          <p className='item bolder'>Car Number</p>
          <p style={{marginLeft:"5px"}} className='item'>{driversHistory[ride.driverId]?.carNumber}</p>
        </div>
        <div className='travel-items'>
          <p className='item bolder'>Vehicle</p>
          <p  style={{marginLeft:"5px"}}className='item'>{driversHistory[ride.driverId]?.vehicleType}</p>
        </div>
        {/* <div className='travel-items'>
          <p className='item bolder'>OTP</p>
          <p style={{marginLeft:"5px"}} className='item'>{ride.Otp}</p>
        </div> */}
        <div className='travel-items'>
          <p className='item bolder'>Status</p>
          <p style={{marginLeft:"5px"}} className='item'>{ride.status}</p>
        </div>
        <div className='travel-items'>
          <p className='item bolder'>Time</p>
          <p  style={{marginLeft:"5px"}}className='item'>{new Date(ride.time).toLocaleString()}</p>
        </div>
      </div>
      </>
    
    :
    ""
  } 
    </div>
                      // <div className="rider-info">
                      //  <p>Driver: {driversHistory[ride.driverId].username}</p>
                      //   <p>Car: {driversHistory[ride.driverId].carType}</p>
                      //   <i mg src={driversHistory[ride.driverId].carType === 'car' ? img2 : img1} alt={driversHistory[ride.driverId].carType} />
                      //   <p>Car Number: {driversHistory[ride.driverId].carNumber}</p>
                      //   <p>Pickup Location: {ride.pickupLocation}</p>
                      //   <p>Destination Location: {ride.destinationLocation}</p>
                      //   <p>Status: {ride.status}</p>
                      //    <p>OTP: {ride.Otp}</p>
                      //   <p>Time:{new Date(ride.time).toLocaleString()}</p>
                      // </div>
                    ) : (
                      <p>Loading driver details...</p>
                    )
                  :
                    drivers[ride.driverId] ? (
                      <div className='box'>
                        <div className="rider-info">
                          <div className="driver-info">
                            <img src={ride.profilePic} className="driver-picture" alt="Driver"/>
                          </div>
                          <div className='journey-details'>
        <div className='journey'>
          <IoLocation className='loc-dest' />
          <div className='journey-items'>
            <p className='journey-title'>PickUp Point</p>
            <p className='journey-detail'>{ride.pickupLocation}</p>
          </div>
        </div>
        <div className='journey'>
          <IoLocation className='loc'/>
          <div className='journey-items'>
            <p className='journey-title'>Drop Point</p>
            <p className='journey-detail'>{ride.destinationLocation}</p>
          </div>
        </div>
      
                          <div className="information">
                            <p>Driver: {drivers[ride.driverId].username}</p>
                            <p>Vehicle: {drivers[ride.driverId].vehicleType}</p>
                            {/* <img src={drivers[ride.driverId].carType === 'car' ? img2 : img1} alt={drivers[ride.driverId].carType} /> */}
                            <p>Car Number: {drivers[ride.driverId].carNumber}</p>
                            <p>Phone Number: {drivers[ride.driverId].phoneNumber}</p>
                            <p>OTP: {ride.Otp}</p>
                            <p>Time: {new Date(ride.time).toLocaleString()}</p>
                            </div>
                            {ride.status === "completed" ? (
                              <p>Status: {ride.status}</p>
                            ) : (
                              <div className="button-container">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleCancelRide(ride._id)}
                                  sx={{ backgroundColor: '#FF0000', color: 'white', md: 2, mr: 2 }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>Loading driver details...</p>
                    )
                  }
                </li>
              ))}
            </ul>
          
        </div>
)}
      </div>
    </>
  );
};

export default UserDashboard;
