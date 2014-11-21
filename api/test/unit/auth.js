

'use strict';

var EventEmitter = require( 'events' ).EventEmitter,
    Promises     = require( 'bluebird' ),
    mongoose     = Promises.promisifyAll( require( 'mongoose' ) ),
    auth         = require( '../../lib/auth.js' ),
    User         = require( '../../lib/models/user' ),
    AccessToken  = require( '../../lib/models/token' ),
    tmpId        = mongoose.Types.ObjectId(),
    usr          = {
        '_id':       tmpId,
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com',
        'password':  '12345'
    },
    user, configureServer;


configureServer = function configureServer( options ) {
    var opts = options || {};

    auth.options( opts )
        .server();
};

suite( 'auth()', function () {

    suiteSetup( function ( done ) {
        return mongoose
            .connectAsync( 'mongodb://localhost/nlmg_test' )
            .then( function () {
                // hash a pw and create a user (assume it works)
                // really this should be stubbed... but i'm tired :(
                auth.hashPassword( usr.password )
                    .then( function ( hash ) {
                        // create a Test User
                        return User.createAsync({
                            'firstName': usr.firstName,
                            'lastName':  usr.lastName,
                            'email':     usr.email,
                            'password':  hash
                        });
                    })
                    .then( function ( userModel ) {
                        user = userModel;
                        done();
                    });
            });
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
        assert.instanceOf( auth, EventEmitter, 'auth module is instance of EventEmitter' );
        done();
    });

    test( 'does not configure server more than once', function ( done ) {

        var spy  = sinon.spy( auth , 'configureServer' ),
            opts = {
                userModel: User,
                accessTokenModel: AccessToken
            };

        // initial call
        configureServer( opts );

        // testing second call
        configureServer( opts );

        assert.equal( spy.callCount , 1 , 'Configure method called only once' );

        auth.configureServer.restore();
        done();
    });

    test( 'throws error if no AccessToken Model supplied', function ( done ) {

        configureServer();
        assert.throws( auth.createToken.bind( this ) , Error , 'AccessToken model must be provided to the auth module.' );
        done();
    });

    test( 'creates token', function ( done ) {
        var client = {
            'id': '9876543210'
        },
        opts = {
            userModel: User,
            accessTokenModel: AccessToken
        };

        configureServer( opts );

        auth.createToken( client , usr , null )
            .then( function ( token ) {
                return AccessToken.findOneAsync({
                    'userId': usr._id
                });
            })
            .then( function ( tokenModel ) {

                assert.equal( tokenModel.userId.toString() , usr._id.toString() , 'Token UserId Matches User\'s Id' );

                AccessToken
                    .count({
                        'userId': usr._id
                    },
                    function ( err , count ) {
                        assert.notEqual( count , 0 , 'Token count is not 0' );
                        assert.equal( count , 1 , 'Token count is 1' );
                        done();
                    }
                );
            })
            .catch( function ( err ) {
                console.log( err , '??!?' );
                assert.ok( false , 'Error creating token' );
                done();
            });
    });

    test( 'exchanges password for token' , function ( done ) {
        var client = {
            id: 'Shoptology.wut.wut'
        },
        opts = {
            userModel: User,
            accessTokenModel: AccessToken
        };

        configureServer( opts );

        auth.exchangePassword( client , usr.email , usr.password , null )
            .then( function ( token ) {
                assert.isDefined( token , 'Token was exchanged' );

                done();
            });
    });

    test( 'does not exchanges password for token when user not found' , function ( done ) {
        var client = {
            id: 'Shoptology.wut.wut'
        },
        opts = {
            userModel: User,
            accessTokenModel: AccessToken
        };

        configureServer( opts );

        auth.exchangePassword( client , 'foo' , 'foo' , null )
            .then( function ( token ) {
                assert.isUndefined( token , 'Token was not exchanged' );
            })
            .catch( function ( e ) {
                assert.equal( e.message , 'A user was not found with the given username/password.' );

                done();
            });
    });

    test( 'hashPassword' , function ( done ) {
        var t = auth.hashPassword( usr.password )
            .then( function ( hash ) {
                assert.instanceOf( t , Promises , 'Method is a Promise' );
                assert.isDefined( hash , 'hashPassword hashes password' );

                done();
            })
            .catch( function ( e ) {
                done( e );
            });
    });

    test( 'checkPassword should verify passwords match' , function ( done ) {
        var success = auth.checkPassword( usr.password , user.password )
            .then( function ( match ) {
                assert.instanceOf( success , Promises , 'Method is a Promise' );
                assert.isDefined( match , 'method returns result of password match' );
                assert.ok( match , 'passwords match' );

                done();
            })
            .catch( function ( e ) {
                done( e );
            });
    });



    test( 'checkPassword should fail if passwords don\'t match' , function ( done ) {
        var fail = auth.checkPassword( '3ojb23rj' , user.password )
            .then( function ( match ) {
                assert.instanceOf( fail , Promises , 'Method is a Promise' );
                assert.isDefined( match , 'method returns result of password match' );
                assert.notOk( match , 'passwords don\'t match' );

                done();
            })
            .catch( function ( e ) {
                done( e );
            });
    });
});
