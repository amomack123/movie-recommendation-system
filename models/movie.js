// const mongoose = require('mongoose');

// const movieSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   genre: { type: [String], required: true },
//   rating: { type: Number, default: 0 },
//   reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
// });

// const Movie = mongoose.model('Movie', movieSchema);
// module.exports = Movie;

// models/Movie.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
  },
  description: { 
    type: String, 
    required: true 
  },
  genres: [
    { type: String, required: true }
  ],
  director: [
    { type: String }
  ],
  ratings: {
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  reviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
  ],
  language: { 
    type: String 
  },
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
