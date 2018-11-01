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

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bda3fbf510dd0620e5bbb7a')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to update the document', err);
    // });

    db.collection('Users').findOneAndUpdate({
        name: 'Semen'
    }, {
        $inc: {
            age: 5
        },
        $unset: {
            location: ""
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to update user document', err);
    });

    // client.close();
});