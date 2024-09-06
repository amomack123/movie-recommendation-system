const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find({  })
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching movies' });
    }
});

router.get('/genre/:genre', async (req, res) => {
    try {
        console.log("hit");
        const movies = await Movie.find({ genre: req.params.genre });
        console.log(movies);
        res.json(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching movies by genre' });
    }
});

router.get('/:movieID', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieID)
        res.json(movie);
        console.log(movie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching movies' });
    }
});

// // Add movie (admin only)
// router.post('/', async (req, res) => {
//     const { title, description, genre, actors } = req.body;
//     try {
//       const newMovie = new Movie({ title, description, genre, actors });
//       const savedMovie = await newMovie.save();
//       res.status(201).json(savedMovie);
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while adding the movie' });
//     }
//   });
  
//   // Update movie (admin only)
//   router.put('/:movieID', async (req, res) => {
//     const { title, description, genre, actors } = req.body;
//     try {
//       const updatedMovie = await Movie.findByIdAndUpdate(
//         req.params.movieID,
//         { title, description, genre, actors },
//         { new: true }
//       );
//       res.json(updatedMovie);
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while updating the movie' });
//     }
//   });
  
//   // Delete movie (admin only)
//   router.delete('/:movieID', async (req, res) => {
//     try {
//       await Movie.findByIdAndDelete(req.params.movieID);
//       res.status(204).send();
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while deleting the movie' });
//     }
//   });
  

module.exports = router;