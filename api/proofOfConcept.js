
var express  = require( 'express' ),
    mongoose = require( 'mongoose' ),
    config   = require( './config' ),
    auth     = require( './lib/auth.js' );

mongoose.connect( config.db.uri, config.db.options );

auth.server();

var User = require( './lib/models/User' );

var email = 'test@example.com';

var createUser = function( ) {
    User.create( {
        firstName: 'Test',
        lastName: 'User',
        email: email
    } ).then( function( testUser ) {
        console.log ( 'yay', testUser );
        mongoose.connection.close();
    }, function( err ) {
        console.log( "error", err );
        mongoose.connection.close();
    } );
};

User.remove( {
    email: email
}, function( ) {
    createUser();
} );
