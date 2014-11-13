
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema( {
    name: String,
    firstName: String,
    lastName: String,
    email: String
}, { autoIndex: false } );

module.exports = exports = mongoose.model( 'User', schema );
