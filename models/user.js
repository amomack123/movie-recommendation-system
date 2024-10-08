const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        // required: true
    },
    lastname: {
        type: String,
        // required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        sparse: true,
        // unique: true,
        // required: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'invalid email format'
        }
    },
    hashedPassword: {
        type: String,
        required: true
    },
    preferences: {
        actors: [{ type: String }],
        genres: [{
            type: String,
            enum: ['Adventure', 'Drama', 'Comedy', 'Science fiction', 'Fantasy', 'Horror', 'Thriller', 'Western', 'Musical']
        }]
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model('User', userSchema);