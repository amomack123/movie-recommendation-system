require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const testJwtRoutes = require('./controllers/test-jwt');
const profilesRoutes = require('./controllers/profiles');
const usersRoutes = require('./controllers/users');
const reviewsRoutes = require('./controllers/reviews');
const recommendationsRoutes = require('./controllers/recommendations');
// const adminMoviesRoutes = require('./controllers/admin-movies');
const MoviesRoutes = require('./controllers/movies');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/test', testJwtRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
// app.use('/api/admin/movies', adminMoviesRoutes);
app.use('/api/movies', MoviesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));