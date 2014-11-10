
var express  = require( 'express' ),
    mongoose = require( 'mongoose' ),
    config   = require( './config' ),
    auth     = require( './lib/auth.js' );

mongoose.connect( config.db.uri, config.db.options );

auth.server();


