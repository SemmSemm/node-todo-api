// MongoDB module v3
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// added useNewUrlParser to avoid url string parser warning
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Some text right here'}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to delete todos');
    // });


    // deleteOne
    // db.collection('Todos').deleteOne({text: 'text'}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to delete todos');
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to delete todos');
    // });

    db.collection('Users').deleteMany({name: 'Semen'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete users', err);
    });

    db.collection('Users').findOneAndDelete({
        _id: ObjectID('5bd8d098bc309f22a8a49ea9')
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log('Unable to delete user', err);
    });

    // client.close();
});