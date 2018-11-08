const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

// Todo.remove is deprecated, but still working. It should remove all documents from database, 
// same as deleteMany()
// Todo.deleteOne is gonna delete first document
// Todo.deleteOne({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove();
// Todo.findByIdAndRemove();

// takes object as argument, in which we can specify fields of document to be deleted
Todo.findOneAndRemove({_id: '5be0ba99fa62075f32bd3303'}).then((todo) => {
    console.log(todo);
});

// remove one document by id
// takes id as one and only argument
Todo.findByIdAndRemove('5be0ba99fa62075f32bd3301').then((todo) => {
    console.log(todo);
});