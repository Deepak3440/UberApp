const express = require('express');
const mongoose = require('mongoose');
const Driver=require('./models/Driver');
const cors = require('cors');


 const authRoutes = require('./routes/authRoutes');

const url='mongodb://localhost:27017/Uber';



const connectToMongoDB=async()=>{
    try{
        await mongoose.connect(url);
        console.log("connected to MongoDb");
    }
    catch(err){
        console.log("error connecting to MongoDb");
    }
}
connectToMongoDB();


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
