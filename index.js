require('dotenv').config(); // to use .env file
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const { ERROR } = require('./utils/httpStatusText');
const cors = require('cors');
const app = express();
app.use(cors());  // enable CORS for all routes
app.use(express.json()) // middleware to handle body (return json instead of undefined)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // to serve static files from uploads folder
const url = process.env.MONGOODB_URL;  // Connction String

mongoose.connect(url).then(() => {
  console.log("Mongodb connected successfully");
})

app.use('/api/courses', coursesRouter)
app.use('/api/users', usersRouter);

// Handle 404 - Route not found
app.all('/*splat', (req, res, next) => {
  return res.status(404).json({status: ERROR, message: 'Route not found'});
})

// Global Error Handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: ERROR,
    message: error.message || 'Internal Server Error'
  });
});

app.listen(process.env.PORT, () => {
  console.log("Listening on port:", process.env.PORT);
})