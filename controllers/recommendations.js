const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { actors, genres } = user.preferences;

    // Find movies that match user preferences
    const recommendations = await Movie.aggregate([
      {
        $match: {
          $or: [
            { actors: { $in: actors } },
            { genre: { $in: genres } }
          ]
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: [{ $size: { $setIntersection: ["$actors", actors] } }, 2] },
              { $cond: [{ $in: ["$genre", genres] }, 3, 0] },
              "$averageRating"
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching recommendations' });
  }
});

module.exports = router;