import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import './driverDasboard.css';
import ErrorPage from './ErrorPage';

const styles = {
  listItem: {
    display: "grid",
    gridTemplateColumns: "60px calc(97% - 300px) auto",
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#fff',
    marginTop: '40px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  userDetails: {
    marginTop: '8px',
    width: "300px",
  },
  historyDetails: {
    marginTop: '0px'
  },
  listItemHistory: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    backgroundColor: '',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  otpBox: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    borderRadius: '8px',
  },
  otpInput: {
    width: '95%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitButton: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#00CC00',
    color: '#fff',
    cursor: 'pointer',
  }
};

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const location = useLocation();
  const { id = null, username, role } = location.state ? location.state : {};
  const [history, setHistory] = useState([]);
  const [historyClicked, setHistoryClicked] = useState(false);
  const [showRides, setShowRides] = useState(false);
  const [otpModal, setOtpModal] = useState({ visible: false, tripId: '', otp: '',OTP:"" });
  const [otp,setOtp]=useState("");

  useEffect(() => {
    const fetchRides = async () => {
      const driverId = id;
      try {
        const res = await axios.post('http://localhost:5000/api/auth/getTrips', { driverId });
        if (res.data.mes) {
          toast.info(res.data.mes);
        }
        const ridesData = res.data;
        if (ridesData.length > 0) {
          setShowRides(true);
        }
        const allUserIds = [...new Set(ridesData.map(ride => ride.userId))];
        const userDetailsPromises1 = allUserIds.map(userId =>
          axios.get(`http://localhost:5000/api/auth/users/${userId}`)
        );
        const usersDetailsResponses1 = await Promise.all(userDetailsPromises1);
        const usersDetails1 = usersDetailsResponses1.reduce((acc, response, index) => {
          acc[allUserIds[index]] = response.data;
          return acc;
        }, {});
        const updatedRidesData = ridesData.map(ride => {
          const user = usersDetails1[ride.userId];
          if (user) {
            ride.profilePic = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
          }
          return ride;
        });

        const acceptedRides = ridesData.filter(ride => ride.status === 'accepted');
        const userIds = acceptedRides.map(ride => ride.userId);
        const userDetailsPromises = userIds.map(userId =>
          axios.get(`http://localhost:5000/api/auth/users/${userId}`)
        );

        const usersDetailsResponses = await Promise.all(userDetailsPromises);
        const usersDetails = usersDetailsResponses.reduce((acc, response, index) => {
          acc[userIds[index]] = response.data;
          return acc;
        }, {});

        setUserDetails(usersDetails);
        setRides(updatedRidesData);
      } catch (error) {
        toast.error('Failed to fetch rides');
      }
    };

    fetchRides();
    const interval = setInterval(() => {
      fetchRides();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (id === null) {
    return <ErrorPage />;
  }

  const toCheckHistory = async () => {
    setHistoryClicked(true);
    const userId = id;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/getTripsDriverHistory', { userId });
      const ridesData = res.data;

      setHistory(ridesData);

      const userIds = ridesData.map(ride => ride.userId);
      const userDetailsPromises = userIds.map(userId =>
        axios.get(`http://localhost:5000/api/auth/users/${userId}`)
      );

      const usersData = await Promise.all(userDetailsPromises);
      const usersInfo = {};
      usersData.forEach((response, index) => {
        usersInfo[userIds[index]] = response.data;
      });

      setDrivers(usersInfo);
    } catch (error) {
      toast.error('Failed to fetch ride history');
    }
  };

  const showHome = () => {
    setHistoryClicked(false);
  };

  const fetchUserDetails = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/users/${userId}`);
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [userId]: res.data,
      }));
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  const handleAcceptRide = async (tripId, userId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/acceptRide/${tripId}`);
      toast.success('Ride accepted');
      setRides(rides.map(ride => ride._id === tripId ? { ...ride, status: 'accepted' } : ride));
      fetchUserDetails(userId);
    } catch (error) {
      toast.error('Failed to accept ride');
    }
  };

  const handleRejectRide = async (tripId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/rejectRide/${tripId}`);
      toast.success('Ride rejected');
      setRides(rides.filter(ride => ride._id !== tripId));
    } catch (error) {
      toast.error('Failed to reject ride');
    }
  };

  const handleCancelRide = async (tripId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/cancelRideDriver/${tripId}`);
      toast.success('Ride canceled');
      setRides(rides.map(ride => ride._id === tripId ? { ...ride, status: 'canceled' } : ride));
    } catch (error) {
      toast.error('Failed to cancel ride');
    }
  };

  const handlePickme = async (tripId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/pick/${tripId}`);
      toast.success('Ride successfully completed');
      setRides(rides.map(ride => ride._id === tripId ? { ...ride, status: 'completed' } : ride));
    } catch (error) {
      toast.error('Failed to pick ride');
    }
  };

  const openOtpModal = (tripId,OTP) => {
    setOtpModal({ visible: true, tripId, otp: '',OTP });
  };

  const closeOtpModal = () => {
    setOtpModal({ visible: false, tripId: '', otp: '',OTP:"" });
  };

  const handleOtpChange = (e) => {
    setOtpModal({ ...otpModal, otp: e.target.value });
  };

  const handleOtpSubmit = () => {
    if(otpModal.OTP===otpModal.otp){
      closeOtpModal();
      handlePickme(otpModal.tripId);
    }
else{
  toast.error('Incorrect OTP');
  return;
}
  };

  return (
    <>
      <ToastContainer />
      <Header toCheckHistory={toCheckHistory} showHome={showHome} username={username} role={role} />
      <Container>
        {historyClicked ? (
          <List>
            {history.map((ride) => (
              <ListItem key={ride._id} divider style={styles.listItemHistory}>
                <ListItemText
                  primary={`Ride from ${ride.pickupLocation} to ${ride.destinationLocation}`}
                  secondary={`Price: $${ride.price} | Status: ${ride.status}`}
                />
                {drivers[ride.userId] && (
                  <Box sx={styles.historyDetails}>
                    <Typography variant="subtitle1">User Details:</Typography>
                    <Typography variant="body2">Username: {drivers[ride.userId].userName}</Typography>
                    <Typography variant="body2">Phone Number: {drivers[ride.userId].phoneNumber}</Typography>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <>
            {showRides ? (
              <List>
                {rides.map((ride) => (
                  <ListItem key={ride._id} divider style={styles.listItem}>
                    <span>
                      <img style={{ height: '45px', borderRadius: '50%', marginRight: '20px' }} src={ride.profilePic} alt="" />
                    </span>
                    {ride.status === "accepted" ? "" :
                      <ListItemText
                        primary={`Ride from ${ride.pickupLocation} to ${ride.destinationLocation} `}
                        secondary={`Price: $${ride.price} | Status: ${ride.status}`}
                      />
                    }
                    {ride.status === 'pending' && (
                      <Box sx={styles.buttonContainer}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAcceptRide(ride._id, ride.userId)}
                          sx={{ backgroundColor: '#00FF00', color: 'white', md: 2, mr: 2, width: "130px" }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRejectRide(ride._id)}
                          sx={{ backgroundColor: '#FF0000', color: 'white', md: 2, mr: 2, width: "130px" }}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                    {ride.status === 'accepted' && (
                      <>
                        {userDetails[ride.userId] && (
                          <Box sx={styles.userDetails}>
                            <Typography variant="subtitle1">User Details:</Typography>
                            <Typography variant="body2">Username: {userDetails[ride.userId].userName}</Typography>
                            <Typography variant="body2">Pickup From: {ride.pickupLocation}</Typography>
                            <Typography variant="body2">PhoneNumber: {userDetails[ride.userId].phoneNumber}</Typography>
                          </Box>
                        )}
                        <Box sx={styles.buttonContainer}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleCancelRide(ride._id)}
                            sx={{
                              backgroundColor: '#FF0000',
                              color: 'white',
                              md: 2,
                              mr: 2,
                              width: '130px',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              '&:hover': {
                                backgroundColor: '#CC0000' // Darker red on hover
                              }
                            }}
                          >
                            Cancel Ride
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => openOtpModal(ride._id,ride.Otp)}
                            sx={{
                              backgroundColor: '#00CC00',
                              color: 'white',
                              md: 2,
                              mr: 2,
                              width: '130px',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              '&:hover': {
                                backgroundColor: '#00FF00' // Darker green on hover
                              }
                            }}
                          >
                            Ride Start
                          </Button>
                        </Box>
                      </>
                    )}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '20vh',
                  marginTop: '160px'
                }}
              >
                Waiting for Ride...
              </Typography>
            )}
          </>
        )}
      </Container>
      {otpModal.visible && (
        <>
          <div style={styles.overlay} onClick={closeOtpModal}></div>
          <div style={styles.otpBox}>
            <h3>Enter OTP</h3>
            <input
              type="text"
              value={otpModal.otp}
              onChange={handleOtpChange}
              style={styles.otpInput}
              placeholder="Enter OTP"
            />
            <button
              onClick={handleOtpSubmit}
              style={styles.submitButton}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default DriverDashboard;

