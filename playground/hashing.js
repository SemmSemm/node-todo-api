const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

// access_token
// includes 3 parts, seperated by dots.
// first part as header E.g. { "alg": "HS256", "typ": "JWT" }
// second part: payload, E.g. { "id": 10, "lat": 1542136190 }
// third part: verify signature (hash, which allows us verify that the payload was not changed)
var token = jwt.sign(data, '123abc');
console.log(token);
var decoded = jwt.verify(token, '123abc');
console.log('decoded, ', decoded);
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     // + somesecret - salting
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // Example of situation, when someone try to change some data for another user, but person dont
// // know  secret to 'salt'
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was change, dont trust');
// }