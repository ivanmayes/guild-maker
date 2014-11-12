/* global assert, sinon */

'use strict';

var mongoose    = require( 'mongoose' ),
    Auth        = require( '../../lib/auth.js' ),
    User     = require( '../../lib/models/User' ),
    AccessToken = require( '../../lib/AccessToken' ),
    accessToken = new AccessToken(),
    tmpId       = mongoose.Types.ObjectId(),
    usr         = {
        '_id':       tmpId,
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    };

suite( 'Auth()', function () {

    suiteSetup( function ( done ) {
        return mongoose
            .connect( 'mongodb://localhost/nlmg_test' , done );
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    suiteTeardown( function ( done ) {
        return mongoose
            .connection
            .db
            .executeDbCommand({
                dropDatabase: 1
            },
            function( err , result ) {
                return mongoose.connection.close( done );
            });
    });


});
/*
auth.options( {
    userModel: User,
    accessToken: accessToken
} );
auth.server();
*/
