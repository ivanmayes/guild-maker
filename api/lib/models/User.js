
var mongoose = require( 'mongoose' );

module.exports = exports = mongoose.model( 'User', {
    name: String,
    firstName: String,
    lastName: String,
    email: String
} );

