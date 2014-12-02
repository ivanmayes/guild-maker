
'use strict';

// TODO: rewrite tests as these tests were written prior to refactoring

var mongoose    = require( 'mongoose' ),
    AccessToken = require( '../../lib/models/token' ),
    // accessToken = new AccessToken(),
    tmpId       = mongoose.Types.ObjectId(),
    usr         = {
        '_id':       tmpId,
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    },
    tokenVal, createToken, removeToken;

createToken = function ( cacheToken , done ) {
    AccessToken.createToken({
            'client': { id: '12345' },
            'user':   usr,
            'scope':  null
        })
        .then( function( token ) {
            // console.log( token );
            if( cacheToken ){
                tokenVal = token;
                done();
            }
            else{
                done( token );
            }
        })
        .catch( function( err ) {
            return done( err );
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
        AccessToken.remove(
            {
                'token': tokenVal.token
            },
            done
        );
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
        AccessToken
            .findOneAsync({
                'userId': tmpId
            })
            .then( function ( token ) {
                assert.equal( token.token , tokenVal.token , 'Tokens match' );
                assert.equal( token.userId , tmpId.toString() , 'Token UserId Matches User\'s Id' );

                return AccessToken.countAsync({
                    'userId': tmpId
                });

            })
            .then( function ( count ) {
                assert.notEqual( count , 0 , 'Token count is not 0' );
                assert.equal( count , 1 , 'Token count is 1' );
                done();
            })
            .catch( function ( err ) {
                done( err );
            });
    });

    // test( 'doesn\'t overwrite token when existing token found', function ( done ) {
    //     var spy            = sinon.spy( AccessToken , 'createToken' ),
    //         tokenStub      = sinon.stub( AccessToken , 'generateToken' ),
    //         findTokens, firstResults, secondResults;

    //     AccessToken.countAsync({
    //         'userId': tmpId
    //     })
    //     .then( function ( count ) {
    //         assert.equal( count , 1 , 'Token count is 1' );

    //         return AccessToken.findOneAsync({
    //             'userId': tmpId
    //         });
    //     })
    //     .then( function ( token ) {
    //         // return existing token on first generate call
    //         tokenStub.onCall(0).returns( token );

    //         createToken( false , function ( token ) {
    //             return AccessToken.findOneAsync({
    //                 'userId': tmpId
    //             });
    //         });
    //     })
    //     .then( function ( token ) {
    //         return AccessToken.countAsync({
    //             'userId': tmpId
    //         });
    //     })
    //     .then( function ( count ) {
    //         assert.equal( count , 2 , 'Token count is now 2' );

    //         AccessToken.createToken.restore();
    //         AccessToken.generateToken.restore();

    //         done();
    //     })
    //     .catch( function ( err ) {
    //         done( err );
    //     });

    // });

    // test( 'test', function ( done ) {
    //     // write tests
    //     done();
    // });
});

// 1725c39691f4b7e6c8dcf82f820125f6bf79238d6a7f85ed9a62aa06601ee841708eaa4eec84b5a552294597bdbe52e2e2db5a9e96dd505b3f23006a3883aae
