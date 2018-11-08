var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
    useNewUrlParser: true,
    // we are setting useFindAndModify to false, to make  findOneAndUpdate() and findOneAndRemove() 
    // use native findOneAndUpdate() rather than findAndModify().
    useFindAndModify: false
});

module.exports.mongoose = {mongoose};