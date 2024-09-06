const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    type: String,
    required: true,
    enum: ['Adventure', 'Drama', 'Comedy', 'Science fiction', 'Fantasy', 'Horror', 'Thriller', 'Western', 'Musical']
  },
  actors: [{ type: String }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Movie', movieSchema);