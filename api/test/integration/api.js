
'use strict';
var mongoose    = require( 'mongoose' ),
    Auth        = require( '../../lib/auth.js' ),
    User        = require( '../../lib/models/user' ),
    AccessToken = require( '../../lib/access-token' ),
    accessToken = new AccessToken(),
    sampleUserData, sampleClientData, testUser;

sampleUserData = {
    'firstName': 'Test',
    'lastName':  'User',
    'email':     'test@example.com'
};

sampleClientData = {
    'id': '12345'
};

suite( 'API Integration Test ::', function () {

    suiteSetup( function ( done ){
        return mongoose
            .connect( 'mongodb://localhost/nlmg_test' , done );
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    suiteTeardown( function ( done ){
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

    test( 'create auth.server()', function ( done ) {
        Auth.options( {
            userModel: User,
            accessToken: accessToken
        });
        Auth.server();
        // TODO: write up tests.
        assert.ok( 'something' , 'something is ok.' );

        done();
    });

    test( 'create user()', function ( done ) {

        User.create( sampleUserData )
            .then( function ( user ) {

                // cache testuser
                testUser = user;

                // mongoose
                assert.equal( user.firstName , sampleUserData.firstName , 'mongoose user returns matching user.firstName' );
                assert.equal( user.lastName , sampleUserData.lastName , 'mongoose user returns matching user.lastName' );
                assert.equal( user.email , sampleUserData.email , 'mongoose user returns matching user.email' );

                // db
                User.findOne({
                    'email': sampleUserData.email
                },
                '_id firstName lastName email',
                function ( err , userData ) {
                    if( err ){
                        return;
                    }
                    assert.equal( userData.firstName , sampleUserData.firstName , 'mongo data First Name matches' );
                    assert.equal( userData.lastName , sampleUserData.lastName , 'mongo data Last Name matches' );
                    assert.equal( userData.email , sampleUserData.email , 'mongo data Email Name matches' );

                    done();
                });
            });
    });

    test( 'create token()', function ( done ) {
        // callback for create token, write tests here
        var testToken = function ( err , token ) {
            if( err ){
                console.log( 'error:' , err );
                return;
            }

            accessToken.model
                .findOne({
                    'userId': testUser._id
                },
                '_id token userId clientId valid',
                function ( err , token ) {
                    if( err ){
                        return;
                    }
                    assert.equal( token.userId.toString() , testUser._id , 'Token UserId Matches User\'s Id' );

                    accessToken.model
                        .count({
                            'userId': testUser._id
                        },
                        function ( err , count ) {
                            assert.notEqual( count , 0 , 'Token count is not 0' );
                            assert.equal( count , 1 , 'Token count is 1' );
                            done();
                        }
                    );
                }
            );
        };

        Auth.createToken( sampleClientData , testUser , null , testToken );
    });
});
