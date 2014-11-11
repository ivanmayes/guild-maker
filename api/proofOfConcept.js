
'use strict';

var express     = require( 'express' ),
    mongoose    = require( 'mongoose' ),
    config      = require( './config' ),
    auth        = require( './lib/auth.js' ),
    AccessToken = require( './lib/AccessToken.js' ),
    User        = require( './lib/models/User.js' ),
    accessToken = new AccessToken();

mongoose.connect( config.db.uri, config.db.options );

auth.options( {
    userModel: User,
    accessToken: accessToken
} );
auth.server();

var email = 'test@example.com';

var handleError = function( err ) {
    console.log( "error", err );
    mongoose.connection.close();
};

var createUser = function( ) {
    return User.create( {
        firstName: 'Test',
        lastName: 'User',
        email: email
    } );
};

var removeTestUser = function( email , done ) {
    User.remove(
        {
            email: email
        },
        done
    );
};

var removeTestTokens = function( token , done ) {
    accessToken.remove( token , done );
};

var cleanup = function( options , done ) {
    var opts = options || {};

    User.remove(
        {
            email: opts.email
        },
        function ( err ) {
            if ( err ) {
                return handleError();
            }
            accessToken.remove( opts.token , done );
        }
    );


};

cleanup(
    {
        token: null,
        email: email
    },
    function( err ) {
    if ( err ) { return handleError(); }
    createUser()
        .then( function( testUser ) {
            console.log ( 'yay', testUser , '\n' );
            auth.createToken(
                {
                    id: '12345'
                },
                testUser,
                null,
                function( err , token ){
                    if( err ){
                        handleError( err );
                        return;
                    }
                    mongoose.connection.close();
                }
            );
        },
        handleError );
} );
