// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// console.log("KILL:"+ process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


  
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  userType: {  type: String, required: true, enum: ["recruiter", "jobSeeker"]},

  // jobSeeker specific
  education: { type: String, required: function() { return this.userType === "jobSeeker";}, // Only requires education if usertype is a jobSeeker 
  enum: ["Bachelor", "Master", "PHD"]},
  experience_years: { type: Number, minimum: 0, required: function() { return this.userType === "jobSeeker";},},
  location: { type: [Number], required: function() { return this.userType === "jobSeeker";},},
  swipedJobsID: {type: [String]},

  // recruiter specific
  companyID: { type: String, required: function() { return this.userType === "recruiter";}, optional: true },
  companySize: { type: String, required: function() { return this.userType === "recruiter";}, optional: true },
  salaryRange: { type: String, required: function() { return this.userType === "recruiter";}, optional: true },
  likesReceivedCompany: { type: Number, required: function() { return this.userType === "recruiter";}, optional: true },
  swipedApplicantsEmail: {type: [String], }

});

const User = mongoose.model('Users', userSchema);

// Routes
// Get all users
app.get('/test', async (req, res) => {
  try {
    res.json("TEST, Dont mind me");
    // res.json({"Bruvss": "vdsf"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get all users
app.get('/Hirely/Users', async (req, res) => {
  try {
    const users = await User.find();
    console.log("BRUVVV:" + users);
    res.json(users);
    // res.json({"Bruvss": "vdsf"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get single user
app.get('/Hirely/Users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
app.post('/Hirely/Users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user
app.put('/Hirely/Users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
app.delete('/Hirely/Users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Route to get travel time
app.get('/Hirely/TravelTime', async (req, res) => {
  const { origin, destination, mode } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ message: 'Origin and destination are required' });
  }

  try {
    const travelTime = await getTravelTime(origin, destination, mode);
    res.json({ travelTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getTravelTime(origin, destination, mode = 'driving') {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
        destinations: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
        mode: mode,
        key: apiKey
      }
    });
    console.log("RESPONSE:" + JSON.stringify(response.data));
    const data = response.data;
    
    // Check if rows and elements exist
    if (data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0]) {
      const element = data.rows[0].elements[0];
      
      // Check if status is OK
      if (element.status === 'OK') {
        const duration = element.duration.text;
        return duration;
      } else {
        throw new Error('Unable to find the route');
      }
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error fetching travel time:', error);
    throw error;
  }
}


async function createTestUser() {
  try {
    const testUser = new User({
      name: "Test User 2",
      email: "testuser@example.com2 ",
      userType: "recruiter",
      education: "Bachelor"
    });
    const savedUser = await testUser.save();
    console.log("Test user created:", savedUser);
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

// Example usage
// getTravelTime({ lat: 45.4852608, lng: -73.5838208 }, 'Los Angeles, CA')
//   .then(time => console.log('Travel time:', time))
//   .catch(error => console.error('Error:', error));