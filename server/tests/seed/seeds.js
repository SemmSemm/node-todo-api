const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const jwt = require('jsonwebtoken');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    name: 'SemmSemm2',
    email: 'example@gmail.com',
    password: 'semmsemm2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    name: 'SemmSemm3',
    email: 'example@example.com',
    password: 'semmsemm3'
}];

const todos = [{
    _id: new ObjectID,
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID,
    text: 'Second test todo',
    completed: true,
    completedat: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        var todoOne = new Todo(todos[0]).save();
        var todoTwo = new Todo(todos[1]).save();

        return Promise.all([todoOne, todoTwo]);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };