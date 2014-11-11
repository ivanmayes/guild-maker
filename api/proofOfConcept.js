
var express     = require( 'express' ),
    mongoose    = require( 'mongoose' ),
    config      = require( './config' ),
    auth        = require( './lib/auth.js' ),
    User        = require( './lib/models/User.js' ),
    AccessToken = require( './lib/models/AccessToken.js' );
    ;

mongoose.connect( config.db.uri, config.db.options );

auth.options( {
    userModel: User,
    accessTokenModel: AccessToken
} );
auth.server();

var email = 'test@example.com';

var handleError = function( err ) {
    console.log( "error", err );
    mongoose.connection.close();
}

var createUser = function( ) {
    return User.create( {
        firstName: 'Test',
        lastName: 'User',
        email: email
    } );
};

var removeTestUser = function( email, done ) {
    User.remove( { email: email }, done );
}

removeTestUser( email, function( err ) {
    if ( err ) { return handleError(); }
    createUser().then( function( testUser ) {
        console.log ( 'yay', testUser );
        mongoose.connection.close();
    }, handleError );
} );
