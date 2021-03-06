const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: val => hasValidLength(val, 5),
            message: 'Username is too short'
        }
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
        validate: {
            validator: val => hasValidLength(val, 6),
            message: 'Password should include 6 or more characters'
        }
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

var hasValidLength = (val, size) => {
    if (val.length < size) {
        return false;
    } else {
        return true;
    }
};

// TODO var userValidation;

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

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

// TODO: findByToken
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
};

UserSchema.statics.findByCredentials = function (name, password) {
    var User = this;

    return User.findOne({ name }).then((user) => {  
        if (!user) {
            return Promise.reject({"error": "no user found"});
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.statics.getUserData = function (_id) {
    var User = this;

    return User.findOne({ _id }).then((user) => {
        return new Promise((resolve) => {
            console.log(user);
            resolve(user);
        });
    })
}

UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };