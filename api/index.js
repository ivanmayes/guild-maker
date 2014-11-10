
var express  = require( 'express' ),
    config   = require( 'config' ),
    mongoose = require( 'mongoose' ),
    auth     = require( './lib/auth.js' );

mongoose.connect( config.db.uri, { db: { safe: true } } );

auth.server();


