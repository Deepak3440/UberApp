const User = require('../models/User');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const geocodeAddress = async (address) => {
  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: address,
      format: 'json',
      addressdetails: 1,
      limit: 1
    },
    headers: {
      'User-Agent': 'RiderApp' 
    }
  });

  if (response.data.length === 0) {
    return {
      latitude:null,
      longitude:null
    }
  }

  

  const location = response.data[0];
  return {
    latitude: parseFloat(location.lat),
    longitude: parseFloat(location.lon)
  };
};


 const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};



const register = async (req, res) => {
  try {
    const { pickupLocation, destinationLocation, userId ,vehicleType} = req.body;

    // Convert pickup address to coordinates
    console.log(vehicleType);
    const { latitude: pickupLat, longitude: pickupLng } = await geocodeAddress(pickupLocation);

    // Fetch riders from Rider collection where the pickup location matches
    // Fetch drivers from Driver collection and filter those within 10,000 meters range
    if(pickupLat===null || pickupLng===null){
      return res.status(200).json({ message: 'No drivers found within 10,000 meters of the pickup location.' });
    }
    console.log(pickupLng,destinationLocation);
   
    // Fetch drivers within 10,000 meters range from the pickup location
    const driversWithinRange = await Driver.find({
      currentLocation: {
        $geoWithin: {
          $centerSphere: [
            [pickupLng, pickupLat],
            10000 / 6378137 // 10,000 meters converted to radians (Earth's radius in meters)
          ]
        }
      },
      vehicleType
    });


    // Check if drivers were found
    if (driversWithinRange.length === 0) {
      return res.status(200).json({ message: 'No drivers found within 10,000 meters of the pickup location.' });
    }

    console.log(driversWithinRange,"61","  ",userId)

    // Prepare the data for the Trip collection
    const tripsData = driversWithinRange.map(driver => ({
      userId:userId,
      driverId: driver._id,
      status: 'pending',
      time: new Date(),
      price: driver.price,
       pickupLocation: pickupLocation,
       destinationLocation:destinationLocation,
      phoneNumber:driver.phoneNumber,
      Otp:driver.Otp


    }));

    // Store the data in the Trip collection
    await Trip.insertMany(tripsData);
   

    // Send a success response
    res.status(201).json({ message: 'Trips created successfully.', trips: tripsData });
  } catch (error) {
    console.error('Error creating trips:', error);
    res.status(500).json({ message: 'An error occurred while creating trips.' });
  }
};

const registerProfile = async (req, res) => {
  const { userName, password, phoneNumber } = req.body;
  console.log(req.body);
  console.log(userName);

  try {
    let user = await User.findOne({ userName });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      userName,
      phoneNumber,
      password,
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const registerDriver = async (req, res) => {
  const { username, password, phoneNumber, carType, carNumber,  price, currentLocation, Otp } = req.body;

  const { latitude, longitude } = await geocodeAddress(currentLocation);
  if (!username || !password || !carType || !carNumber) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    let driver = await Driver.findOne({ username });
    if (driver) {
      return res.status(400).json({ msg: 'Driver already exists' });
    }

    driver = new Driver({
      username,
      phoneNumber,
      password,
      vehicleType:carType,
      carNumber,
      // pickupLocation,
      // destinationLocation,
      price,
      currentLocation: {type:'Point', coordinates: [longitude, latitude]},
      Otp
    });


    await driver.save();

    res.status(201).json({ msg: 'Driver registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = registerDriver;


const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    console.log('Username:', phoneNumber);

    // Check if the user exists in the User collection
    const user = await User.findOne({ phoneNumber:phoneNumber });
    console.log('User:', user);

    if (user) {
      // Check if the password matches
      const passwordMatch = user.password===password?true:false;
      if (passwordMatch) {
        // Send a success response
        return res.status(200).json({...user._doc,role:"user"});
      } 
      else 
      {
        console.log('User password does not match');
      }
    } else {
      console.log('User not found in User collection');
    }

    // Check if the user exists in the Driver collection
    const driver = await Driver.findOne({phoneNumber: phoneNumber });
    console.log('Driver:', driver);

    if (driver)
       {
      // Check if the password matches
      const passwordMatch = driver.password===password?true:false;
      if (passwordMatch)
         {
        // Send a success response
        return res.status(200).json({...driver._doc,role:"driver"});
      }
       else
        {
        console.log('Driver password does not match');
      }
    }
     else 
     {
      console.log('User not found in Driver collection');
    }

    // If no match is found, respond with an error
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    // Handle internal server error
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getTrips = async (req, res) => {
  try {
    const { driverId } = req.body;

    // Fetch trips from Trip collection where riderId and status match
    const trips = await Trip.find({ driverId,  status: { $in: ['pending', 'accepted'] }});
    if(!trips){
      return res.status(404).json({mes:"No trips found"})
    }
    // Send the found trips as the response
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  
const acceptRide = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Find the trip by _id
    const trip = await Trip.findById(tripId);

    const Otp=generateOtp();

    // If the trip is not found, send a 404 response
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await Trip.updateMany(
      { userId: trip.userId, status: 'pending' }, // Filter trips by userId and status
      { $set: { status: 'waiting' } } // Update status to 'waiting'
    );

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { status: 'accepted',Otp },
      { new: true } 
    );

   
    res.status(200).json(updatedTrip);
  }
   catch (error)
    {
    console.error('Error updating trip status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getTripsUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch trips from Trip collection where riderId and status match
    const trips = await Trip.find({ userId, status :'accepted'});

    // Send the found trips as the response
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTripsUserHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch trips from Trip collection where userId and status match
    const trips = await Trip.find({ 
      userId, 
      status: { $in: ['canceled', 'rejected', 'accepted','completed'] }
    });

    // Send the found trips as the response
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTripsDriverHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch trips from Trip collection where userId and status match
    const trips = await Trip.find({ 
      driverId:userId, 
      status: { $in: ['canceled', 'rejected', 'accepted',"pending","completed"] }
    });

    // Send the found trips as the response
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const getDriverDetails = async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error fetching driver details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching driver details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectRide = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findByIdAndUpdate(tripId, { status: 'rejected' }, { new: true });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error('Error updating trip status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const cancelRide = async (req, res) => {
//   try {
//     const { tripId } = req.params;
//     const trip = await Trip.findByIdAndUpdate(tripId, { status: 'canceled' }, { new: true });
//     if (!trip) {
//       return res.status(404).json({ message: 'Trip not found' });
//     }
//     res.status(200).json(trip);
//   } catch (error) {
//     console.error('Error updating trip status:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
try {
  const { tripId } = req.params;
  const trip = await Trip.findByIdAndUpdate(tripId, { status: 'canceled' }, { new: true });
  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }
  res.status(200).json(trip);
} catch (error) {
  console.error('Error updating trip status:', error);
  res.status(500).json({ error: 'Internal server error' });
}
};


const cancelRideDriver = async (req, res) => {
    try {
      const { tripId } = req.params;
      const trip = await Trip.findByIdAndUpdate(tripId, { status: 'canceled' }, { new: true });
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.status(200).json(trip);
    } catch (error) {
      console.error('Error updating trip status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
 

const pickMe = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findByIdAndUpdate(tripId, { status: 'completed' }, { new: true });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error('Error updating trip status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDriverLocation = async (req, res) => {
  try {
    const { driverId, latitude, longitude } = req.body;
    
    // Update the driver's document with the new current location
    const driver = await Driver.findByIdAndUpdate(driverId, {
      currentLocation: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.status(200).json({ message: 'Driver location updated successfully' });
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { register, login, getTrips, acceptRide,cancelRideDriver, rejectRide, cancelRide, getTripsUser, getDriverDetails ,getTripsUserHistory,getUserDetails,getTripsDriverHistory,pickMe,updateDriverLocation,registerProfile,registerDriver};
