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

const jobSchema = new mongoose.Schema({

  jobRoleName: {type: String, required: true, enum: ["Software Solutions Architect", "Full-Stack Systems Engineer", "Distributed Systems Developer", "AI Model Optimization Engineer", "Deep Learning Infrastructure Engineer", "Prompt Engineering Specialist", "Cloud-Native Software Engineer", "Kubernetes Automation Specialist", "Site Reliability Engineer (SRE)", "Data Engineering Architect", "Streaming Data Processing Engineer", "Data Pipeline Optimization Engineer", "GPU Computing Engineer", "CUDA Optimization Specialist", "Embedded AI Engineer", "Application Security Engineer", "Zero Trust Architect", "Blockchain Security Developer", "Interactive UI Engineer", "Web Performance Optimization Engineer", "Accessibility-Focused Frontend Developer", "High-Performance Backend Engineer", "Event-Driven Architecture Developer", "Serverless API Engineer"]},
  jobID: {type: String, required: true, unique: true}, // random # between 1 - 1000
  jobPay: {type: Number, required: true}, // Random 
  jobLocation: { type: String}, // longitude,latitude, locations in/near montreal
  description: { type: String, required: true}, // General job description
  tags: {type: [String],  enum: ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "Ruby", "PHP", "Dart", "R", "Scala", "Perl", "Haskell", "Elixir", "Lua", "Shell", "MATLAB", "Objective-C", "F#", "Erlang"]}

});

const Jobs = mongoose.model('Jobs', jobSchema);
// Create job
app.post('/Hirely/Jobs', async (req, res) => {
  try {
    const newJob = new Jobs(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all jobs
app.get('/Hirely/Jobs', async (req, res) => {
  try {
    const jobs = await Jobs.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
app.get('/Hirely/Jobs/:id', async (req, res) => {
  try {
    const job = await Jobs.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Helper to get distance in meters using Google Maps Distance Matrix
async function getDistanceInMeters(origin, destination) {
  return Math.floor(Math.random() * 10000) + 1; // Returns a random distance in meters
}

// Async function to rank jobs based on user profile and distance
async function rankJobs(user, jobs) {
  const ranked = [];
  for (const job of jobs) {
    let score = 0;
    if (user.education && job.tags.includes(user.education)) score += 10;
    if (user.experience_years && job.jobPay >= user.experience_years * 10000) score += 5;
    if (user.swipedJobsID && !user.swipedJobsID.includes(job.jobID)) score += 15;
    if (user.location && job.jobLocation) {
      const distance = await getDistanceInMeters(user.location, job.jobLocation);
      // Example: add more points if distance is small
      if (distance < 5000) score += 20;
      else if (distance < 20000) score += 10;
    }
    ranked.push({ job, score });
  }
  return ranked.sort((a, b) => b.score - a.score);
}

// Get ranked jobs for a user
app.get('/Hirely/RankedJobs/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const jobs = await Jobs.find();
    const rankedJobs = await rankJobs(user, jobs);
    res.json(rankedJobs.map(r => r.job));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get next few ranked jobs for swiping
app.get('/Hirely/NextJobs/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const jobs = await Jobs.find();
    const rankedJobs = await rankJobs(user, jobs);
    res.json(rankedJobs.slice(0, 5).map(r => r.job));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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