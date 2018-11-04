const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

var userID = '5bdef1d19a5c5deb9bf628ef'

var id = '5bdeedf39be1a72fb0b309fc';

if(!ObjectID.isValid(id)){
    console.log('Id is not valid');
}



Todo.find({
    _id: id
}).then((todos) => {
    console.log('todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('todo', todo);
});

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log(`Todo by id ${id} not found`);
    }
    console.log('todo by id', todo);
}).catch((e) => {
    console.log(e);
});

User.findById(userID).then((user) => {
    if(!user) {
        return console.log(`User by id ${userID} not found`);
    }
    console.log('user by id', user);
}).catch((e) => {
    console.log(e);
});