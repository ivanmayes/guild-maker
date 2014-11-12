/* global assert, sinon */

'use strict';

var mongoose    = require( 'mongoose' ),
    AccessToken = require( '../lib/AccessToken' ),
    accessToken = new AccessToken(),
    tmpId       = mongoose.Types.ObjectId(),
    usr         = {
        '_id':       tmpId,
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    },
    tokenVal, createToken, removeToken;

createToken = function ( cacheToken , done ) {
    accessToken.createToken({
            'client': { id: '12345' },
            'user':   usr,
            'scope':  null
        },
        function( err , token ) {
            if ( err ) {
                return done( err );
            }
            if( cacheToken ){
                tokenVal = token;
                done();
            }
            else{
                done( token );
            }
        });
};

suite( 'AccessToken()', function () {

    suiteSetup( function ( done ) {
        return mongoose
            .connect( 'mongodb://localhost/nlmg_test' , done );
    });

    setup( function ( done ) {
        createToken( true , done );
    });

    teardown( function ( done ) {
        accessToken.remove( tokenVal , done );
    });

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

    test( 'insert token into db' , function( done ) {
        accessToken.model
            .findOne({
                'userId': tmpId
            },
            '_id token userId clientId valid',
            function ( err , token ) {
                if( err ){
                    return;
                }
                assert.equal( token.token , tokenVal , 'Tokens match' );
                assert.equal( token.userId , tmpId.toString() , 'Token UserId Matches User\'s Id' );

                accessToken.model
                    .count({
                        'userId': tmpId
                    },
                    function ( err , count ) {
                        assert.notEqual( count , 0 , 'Token count is not 0' );
                        assert.equal( count , 1 , 'Token count is 1' );
                        done();
                    }
                );
            }
        );
    });

    test( 'throws error when max token attempts reached', function ( done ) {
        var spy            = sinon.spy( accessToken , 'createToken' ),
            tokenStub      = sinon.stub( accessToken , 'generateToken' ),
            checkTokenStub = sinon.stub( accessToken , 'tokenCheck' ),
            maxAttempts    = 1;

        tokenStub.returns( '1725c39691f4b7e6c8dcf82f820125f6bf79238d6a7f85ed9a62aa06601ee841708eaa4eec84b5a552294597bdbe52e2e2db5a9e96dd505b3f23006a3883aae' );
        checkTokenStub.yields( null , false );
        accessToken.ERROR_MAX = maxAttempts;

        createToken( false , function ( token ) {

            assert.equal( spy.callCount , maxAttempts , 'Create Token Called Max times' );
            assert.instanceOf( token , Error , 'Stub returns Error' );

            accessToken.createToken.restore();
            accessToken.generateToken.restore();
            accessToken.tokenCheck.restore();

            // accessToken.remove( null , done );
            done();
        });
    });

    test( 'will create and check token until max attempts is reached', function ( done ) {
        var spy            = sinon.spy( accessToken , 'createToken' ),
            tokenStub      = sinon.stub( accessToken , 'generateToken' ),
            checkTokenStub = sinon.stub( accessToken , 'tokenCheck' ),
            maxAttempts    = 3;

        tokenStub.returns( '1725c39691f4b7e6c8dcf82f820125f6bf79238d6a7f85ed9a62aa06601ee841708eaa4eec84b5a552294597bdbe52e2e2db5a9e96dd505b3f23006a3883aae' );
        checkTokenStub.yields( null , false );
        accessToken.ERROR_MAX = maxAttempts;

        createToken( false , function ( token ) {

            assert.equal( checkTokenStub.callCount , maxAttempts , 'tokenCheck Called Max times' );

            accessToken.createToken.restore();
            accessToken.generateToken.restore();
            accessToken.tokenCheck.restore();

            // accessToken.remove( null , done );
            done();
        });
    });

    test( 'doesn\'t overwrite token when existing token found', function ( done ) {
        var spy            = sinon.spy( accessToken , 'createToken' ),
            tokenStub      = sinon.stub( accessToken , 'generateToken' ),
            maxAttempts    = 3,
            findTokens, firstResults, secondResults;

        // before hook inserts an access token in to db,
        // retrieving that token to use as a return on subsequent call
        // to verify existing token check.
        findTokens = function ( cb ) {
            accessToken.model
                .findOne({
                    'userId': tmpId
                },
                '_id token userId clientId valid',
                cb );
        };

        firstResults = function ( err , res ) {
            // this is the first result set of the token call
            // this will give us the token to return on the create attempt
            if( err ){
                return;
            }

            // return existing token on first generate call
            tokenStub.onCall(0).returns( res.token );

            createToken( false , function ( token ) {

                assert.equal( spy.callCount , 2 , 'Create Token Called twice, as first call is existing token' );
                findTokens( secondResults );
            });
        };

        secondResults = function ( err , res ) {

            accessToken.model
                .count({
                    'userId': tmpId
                },
                function ( err , count ) {
                    assert.equal( count , 2 , 'Token count is now 2' );

                    accessToken.createToken.restore();
                    accessToken.generateToken.restore();

                    done();
                }
            );
        };

        accessToken.model
            .count({
                'userId': tmpId
            },
            function ( err , count ) {
                assert.equal( count , 1 , 'Token count is 1' );
                findTokens( firstResults );
            }
        );
    });

    // test( 'test', function ( done ) {
    //     // write tests
    //     done();
    // });
});

// 1725c39691f4b7e6c8dcf82f820125f6bf79238d6a7f85ed9a62aa06601ee841708eaa4eec84b5a552294597bdbe52e2e2db5a9e96dd505b3f23006a3883aae
