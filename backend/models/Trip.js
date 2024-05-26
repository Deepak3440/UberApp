const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
          required: true
         },
    driverId: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Driver', 
          required: true 
        },
    status: { 
        type: String,
        default: 'pending'
     },
     pickupLocation:{
        type:String
     },
     destinationLocation:{
        type:String
     },
    time: { 
        type: Date, default: Date.now 
    },
    price:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    Otp:{
        type:String
    }
});

module.exports = mongoose.model('Trip', TripSchema);
