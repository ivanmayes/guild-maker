/* global assert, sinon */

'use strict';

var EventEmitter = require( 'events' ).EventEmitter,
    mongoose     = require( 'mongoose' ),
    Auth         = require( '../../lib/auth.js' ),
    User         = require( '../../lib/models/User' ),
    AccessToken  = require( '../../lib/AccessToken' ),
    accessToken  = new AccessToken(),
    tmpId        = mongoose.Types.ObjectId(),
    usr          = {
        '_id':       tmpId,
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    },
    configureServer;


configureServer = function configureServer( options ) {
    var opts = options || {};

    Auth.options( opts )
        .server();
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

    test( 'inherits from event emitter', function ( done ) {
        assert.instanceOf( Auth, EventEmitter, 'Auth module is instance of EventEmitter' );
        done();
    });

    test( 'does not configure server more than once', function ( done ) {

        var spy  = sinon.spy( Auth , 'configureServer' ),
            opts = {
                userModel: User,
                accessToken: accessToken
            };

        // initial call
        configureServer( opts );

        // testing second call
        configureServer( opts );

        assert.equal( spy.callCount , 1 , 'Configure method called only once' );

        Auth.configureServer.restore();
        done();
    });

    test( 'throws error if no AccessToken supplied', function ( done ) {

        configureServer();
        assert.throws( Auth.createToken.bind( this ) , 'AccessToken must be provided to the auth module.' );
        done();
    });

    test( 'creates token', function ( done ) {
        var client = {
            'id': '9876543210'
        },
        opts = {
            userModel: User,
            accessToken: accessToken
        };

        configureServer( opts );

        Auth.createToken(
            client,
            usr,
            null,
            function ( err , token ) {
                accessToken.model
                    .findOne({
                        'userId': usr._id
                    },
                    '_id token userId clientId valid',
                    function ( err , token ) {
                        if( err ){
                            return;
                        }
                        assert.equal( token.userId.toString() , usr._id.toString() , 'Token UserId Matches User\'s Id' );

                        accessToken.model
                            .count({
                                'userId': usr._id
                            },
                            function ( err , count ) {
                                assert.notEqual( count , 0 , 'Token count is not 0' );
                                assert.equal( count , 1 , 'Token count is 1' );
                                done();
                            }
                        );
                    }
                );
            }
        );
    });
});
