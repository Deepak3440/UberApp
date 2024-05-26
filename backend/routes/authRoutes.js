const express = require('express');
const { register, login, getTrips, acceptRide, rejectRide, cancelRide, getTripsUser, getDriverDetails ,getTripsUserHistory,getUserDetails
    ,getTripsDriverHistory,pickMe,updateDriverLocation,cancelRideDriver,registerProfiler,
    registerProfile,registerDriver }= require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/getTrips', getTrips);
router.post('/acceptRide/:tripId', acceptRide);
router.post('/rejectRide/:tripId', rejectRide);
router.post('/cancelRide/:tripId', cancelRide);
router.post('/cancelRideDriver/:tripId', cancelRideDriver);
router.post('/pick/:tripId', pickMe);
router.post('/getTripsUser', getTripsUser);
router.post('/getTripsUserHistory', getTripsUserHistory);
router.post('/getTripsDriverHistory', getTripsDriverHistory);
router.get('/drivers/:driverId', getDriverDetails);
router.get('/users/:userId', getUserDetails);
router.post('/updateDriverLocation', updateDriverLocation);


router.post('/login', login);
router.post('/registerProfile', registerProfile);
router.post('/registerDriver', registerDriver);


module.exports = router;
