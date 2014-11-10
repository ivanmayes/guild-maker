
var mongoose = require( 'mongoose' );

module.exports = exports = mongoose.model( 'Users', {
    name: String,
    firstName: String,
    lastName: String,
    email: String
} );

