const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
         unique: true 
        },
        phoneNumber:{
            type:String
        },

    password: {
         type: String, 
         required: true
         },
    vehicleType: { 
        type: String,
         required: true
         },
    carNumber: { 
        type: String,
         required: true 
        },
    pickupLocation: { 
        type: String, 
        // required: true 
    },
    destinationLocation: {
         type: String,
        //   required: true
         },
    price: { 
        type: String
     },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true
        }
    },
    time: { 
        type: Date, default: Date.now 
    },
    Otp:String
});


DriverSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Driver', DriverSchema);
