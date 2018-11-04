const express = require('express');
const {ObjectID} = require('mongodb');
//bodyParser taking our JSON and convert it to object
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/{id}
app.get('/todos/:id', (req, res) => {
    var todoId = req.params.id;

    if(!ObjectID.isValid(todoId)){
        return res.status(404).send();
    }

    Todo.findById(todoId).then((todo) => {
        if(!todo) {
            return res.status(404).send('There is no todo exists');
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

module.exports = {app};