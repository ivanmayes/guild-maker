
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema( {
    username:  { type: String },
    firstName: { type: String },
    lastName:  { type: String },
    email:     { type: String, index: { unique: true , dropDups: true } },
    password:  { type: String }
}, { autoIndex: false } );

exports = module.exports = mongoose.model( 'User', schema );
