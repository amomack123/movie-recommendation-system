// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
//   watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
//   preferences: { type: [String], default: [] }
// });

// userSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         delete returnedObject.hashedPassword;
//     }
// });

// module.exports = mongoose.model('User', userSchema);
// models/User.js

// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
  },
  password: { 
    type: String, 
    required: true 
  },
  preferences: {
    genres: [{ type: String }],
    actors: [{ type: String }],
    directors: [{ type: String }],
  },
  watchlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
  ],
  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
  ],
  reviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
  ],
});

module.exports = mongoose.model('User', userSchema);
