// const express = require('express');
// const router = express.Router();
// const Movie = require('../models/movie');
// const isAdmin = require('../middleware/isAdmin');
// const verifyToken = require('../middleware/verify-token');

// router.use(verifyToken);

// // Create a new movie (admin only)
// router.post('/', isAdmin, async (req, res) => {
//     try {
//         const newMovie = await Movie.create(req.body);
//         res.status(201).json(newMovie);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Update a movie (admin only)
// router.put('/:movieId', isAdmin, async (req, res) => {
//     try {
//         const updatedMovie = await Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true });
//         res.status(200).json(updatedMovie);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Delete a movie (admin only)
// router.delete('/:movieId', isAdmin, async (req, res) => {
//     try {
//         await Movie.findByIdAndDelete(req.params.movieId);
//         res.status(200).json({ message: 'Movie deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const verifyToken = require('../middleware/verify-token');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while verifying admin status' });
  }
};

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, genre, actors } = req.body;
    const movie = new Movie({ title, description, genre, actors });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the movie' });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, genre, actors } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, description, genre, actors },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the movie' });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the movie' });
  }
});

module.exports = router;
