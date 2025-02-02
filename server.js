// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Int32 } = require('mongodb');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
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
app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
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