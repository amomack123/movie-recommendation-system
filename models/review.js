// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   },
//   movie: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Movie', 
//     required: true 
//   },
//   rating: { 
//     type: Number, 
//     required: true,
//     min: 0,
//     max: 10 
//   },
//   comment: { 
//     type: String 
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// module.exports = mongoose.model('Review', reviewSchema);

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
