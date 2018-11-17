const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid e-mail'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: Number,
            required: true
        }
    }]
});

// overriding mongoose toJSON method
// determining how Mongoose documents get serialized by JSON.stringify()
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

// Generating auth token
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();
    // token equals e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    // .eyJpZCI6MTAsImlhdCI6MTU0MjE0MTYzN30.WDOgue7n5q0iQA2MRFziCROU9R0ChBqzukPMtnhCrS4
    // concat creates one array, merging two arrays
    // In our case user.tokens should be like this
    // tokens[ 0 => [id, access, token] ]
    user.tokens = user.tokens.concat({ access, token });

    return user.save().then(() => {
        return token;
    });
};

// TODO: findByToken
// UserSchema.statics.findByToken();

var User = mongoose.model('User', UserSchema);

module.exports = { User };