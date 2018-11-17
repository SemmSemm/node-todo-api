require('./config/config');

const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
//bodyParser taking our JSON and convert it to object
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

/**
 * Adding a new todo
 */
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed
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
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Get todo by id specified in request
 */
app.get('/todos/:id', (req, res) => {
    var todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send();
    }

    Todo.findById(todoId).then((todo) => {
        if (!todo) {
            return res.status(404).send('There is no todo exists');
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Deleting todo with id specified in request
 */
app.delete('/todos/:id', (req, res) => {
    var todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(todoId).then((todo) => {
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
app.patch('/todos/:id', (req, res) => {
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
        let date = new Date();
        body.completedat = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    } else {
        body.completed = false;
        body.completedat = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
            new: true
        }).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo });
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
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Get information about user
 */
app.get('/users/me', (req, res) => {
    var token = req.header('x-auth');

    User.findByUser(token);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


module.exports = { app };