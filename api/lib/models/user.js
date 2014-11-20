
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema( {
    username:  String,
    firstName: String,
    lastName:  String,
    email:     String,
    password:  String
}, { autoIndex: false } );

exports = module.exports = mongoose.model( 'User', schema );
