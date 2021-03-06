require('./config/config');

const cors = require('cors');
const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
//bodyParser taking our JSON and convert it to object
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

/**
 * Adding a new todo
 */
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

/**
 * Get all todos
 */
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Get todo by id specified in request
 */
app.get('/todos/:id', authenticate, (req, res) => {
    var todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: todoId,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send('There is no todo exists yet.');
        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Deleting todo with id specified in request
 */
app.delete('/todos/:id', authenticate, (req, res) => {
    var todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: todoId,
        _creator: req.user.id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    }).catch((e) => {
        res.status(404).send(e);
    });
});

/**
 * Updating todo by id specified in request
 */
app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    // _.pick() takes an object, in our case its body
    // takes an array of properties, which we want to pull off
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // console.log(_.isBoolean(body.completed));
    // console.log(body.completed);
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedat = new Date().toUTCString();
    } else {
        body.completed = false;
        body.completedat = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user.id
    }, {
            $set: body
        }, {
            new: true
        }).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send(todo);
        }).catch((e) => {
            res.status(400).send();
        });
});

/**
 * Adding a user
 */
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password']);
    var user = new User(body);
    // model methods
    // User.findByToken

    // instance methods
    // user.generateAuthToken

    user.save().then(() => {
        res.status(200).send(user);
        //.then((token) => {
        // res.header('x-auth', token).send(user);
        // })
    }).catch((e) => {
        // check if json parameter/object exist, and then return it
        // pass it to another file called UserValidation
        // return error object with error fields for each property
        // E.g. "errors": {"name": "too short", "email": null, "username": null}
        // Upd: if null, then dont return
        var registerErrors = {};
        if(e.name && e.name === "MongoError") {
            let key = Object.keys(e.keyPattern)[0];
            registerErrors[key] = `This ${key} is already taken.`;
        }
        if(e.errors) {
            console.log(e.errors);
            if (e.errors.name) {
                registerErrors.name = e.errors.name.message;
            }
            if (e.errors.email) {
                registerErrors.email = e.errors.email.message;
            }
            if (e.errors.password) {
                registerErrors.password = e.errors.password.message;
            }
        }
		console.log(registerErrors);
        res.status(400).send(registerErrors);
    });
});

/**
 * Get information about user
 */
app.get('/users/me', authenticate, (req, res) => {
    
    User.getUserData(req.user._id).then((user) => {
        res.status(200).send({email: user.email, name: user.name, password: user.password});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/login', (req, res) => {
    var body = _.pick(req.body, ['name', 'password']);

    User.findByCredentials(body.name, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.send({ name: user.name, email: user.email, access_token: token });
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


module.exports = { app };