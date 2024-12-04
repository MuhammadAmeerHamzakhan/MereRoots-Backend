const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // Correct import of the dotenv package
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes setup
app.use('/api/auth', authRoutes);

// MongoDB connection string from environment variable
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MongoDB URI is not defined in .env file');
  process.exit(1);  // Stop the server if the connection URI is not found
}

// Connect to MongoDB
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.log('MongoDB connection error: ', err);
  });

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
